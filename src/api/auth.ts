import { post, get } from '@/utils/request'

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

// 定义菜单项类型
export interface MenuItem {
  id: number
  parent_id: number
  name: string
  type: 'menu' | 'button'
  code: string
  title: string
  icon?: string
  sort: number
  is_leaf?: boolean
  children?: MenuItem[]
}

// 定义菜单权限响应类型
export interface MenuPermissionResponse {
  code: number
  msg: string
  data: {
    menus: MenuItem[]
  }
}

// 定义按钮权限响应类型
export interface ButtonPermissionResponse {
  code: number
  msg: string
  data: {
    buttons: {
      code: string
      title: string
    }[]
  }
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

// 获取菜单权限
export function getMenuPermissions() {
  return get<MenuPermissionResponse>('/v1/auth/menu-permissions')
}

// 获取按钮权限
export function getButtonPermissions(menuCode: string) {
  return get<ButtonPermissionResponse>(`/v1/auth/button-permissions?menuCode=${menuCode}`)
}
