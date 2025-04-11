import { post } from '@/utils/request'

// 定义登录响应数据类型
export interface LoginResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  user: {
    id: string
    role: string
    department: string
    last_login: string
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
  return post<SmsCodeResponse>('/v1/auth/sms/login', { phone })
}

// 账号密码登录
export function loginByEmail(username: string, password: string) {
  return post<LoginResponse>('/v1/auth/login-email', { username, password })
}

// 手机号登录
export function loginByPhone(phone: string, smsCode: string) {
  return post<LoginResponse>('/v1/auth/login-phone', { phone, code: smsCode })
}
