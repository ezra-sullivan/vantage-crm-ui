import { get } from '@/utils/request'

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

// 获取菜单权限
export function getMenuPermissions() {
  return get<MenuPermissionResponse>('/v1/authz/menu-permissions')
}

// 获取按钮权限
export function getButtonPermissions(menuCode: string) {
  return get<ButtonPermissionResponse>(`/v1/authz/button-permissions?menuCode=${menuCode}`)
}
