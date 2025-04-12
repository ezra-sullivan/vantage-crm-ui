import { get } from '@/utils/request'
import axios from 'axios'

// 定义刷新token响应类型
export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
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

// 刷新token
export async function refreshToken(): Promise<RefreshTokenResponse> {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
    return Promise.reject(new Error('没有刷新令牌'))
  }

  const baseURL = import.meta.env.VITE_API_BASE_URL || '/v1'
  const response = await axios.get(`${baseURL}/api/v1/authz/refresh-token`, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  })

  if (response.data.code === 200 && response.data.data) {
    return response.data.data
  } else {
    return Promise.reject(new Error(response.data.msg || '刷新令牌失败'))
  }
}

// 获取菜单权限
export function getMenuPermissions() {
  return get<MenuPermissionResponse>('/v1/authz/menu-permissions')
}

// 获取按钮权限
export function getButtonPermissions(menuCode: string) {
  return get<ButtonPermissionResponse>(`/v1/authz/button-permissions?menuCode=${menuCode}`)
}
