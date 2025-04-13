import { post } from '@/utils/request'
import axios from 'axios'

// 定义登录响应数据类型
export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    username: string
    name: string
    email: string
    phone: string
    last_login_time: string
  }
}

// 定义短信验证码响应类型
export interface SmsCodeResponse {
  code: number
  msg: string
  data: {
    expires_in: number
    next_retry: number
  } | null
}

// 发送验证码
export function sendVerificationCode(phone: string) {
  return post<SmsCodeResponse>('/v1/account/sms/login', { phone })
}

// 账号密码登录
export function loginByEmail(username: string, password: string) {
  return post<LoginResponse>('/v1/account/login-email', { username, password })
}

// 手机号登录
export function loginByPhone(phone: string, smsCode: string) {
  return post<LoginResponse>('/v1/account/login-phone', { phone, code: smsCode })
}

// 定义刷新token响应类型
export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
}

// 刷新token
export async function refreshToken(): Promise<RefreshTokenResponse> {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
    return Promise.reject(new Error('没有刷新令牌'))
  }

  const baseURL = import.meta.env.VITE_API_BASE_URL || '/v1'
  const response = await axios.post(`${baseURL}/api/v1/account/refresh-token`, {
    refresh_token: refreshToken
  })

  if (response.data.code === 200 && response.data.data) {
    return response.data.data
  } else {
    return Promise.reject(new Error(response.data.msg || '刷新令牌失败'))
  }
}
