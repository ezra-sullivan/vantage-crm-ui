import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 定义接口响应数据结构
export interface ResponseData<T = unknown> {
  code: number
  msg: string
  data: T
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1', // 从环境变量读取 API 基础路径
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('access_token')
    // 如果 token 存在，则添加到请求头
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data as ResponseData
    
    // 如果响应码不是 200，则判断为错误
    if (res.code !== 200) {
      // 注释掉这行，不在拦截器中显示错误消息
      // ElMessage.error(res.msg || '请求失败')
      
      // 处理特定错误码
      if (res.code === 401) {
        // token 过期或无效，可以在这里处理登出逻辑
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_info')
        // 可以在这里添加重定向到登录页的逻辑
      }
      
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    
    // 修改这里：返回修改后的response对象，而不是直接返回data
    response.data = res.data
    return response
  },
  (error) => {
    console.error('响应错误:', error)
    
    // 处理网络错误
    if (error.message && error.message.includes('Network Error')) {
      ElMessage.error('网络错误，请检查您的网络连接')
    } else if (error.message && error.message.includes('timeout')) {
      ElMessage.error('请求超时，请稍后重试')
    } else if (error.response) {
      // 处理 HTTP 状态码错误
      switch (error.response.status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          break
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error(`请求失败: ${error.response.data?.msg || error.message}`)
      }
    } else {
      ElMessage.error('请求失败，请稍后重试')
    }
    
    return Promise.reject(error)
  }
)

// 定义请求参数类型
type RequestParams = Record<string, string | number | boolean | null | undefined>

// 封装 GET 请求
export function get<T = unknown>(url: string, params?: RequestParams, config?: AxiosRequestConfig): Promise<T> {
  return service.get<unknown, AxiosResponse<T>>(url, { params, ...config }).then(res => res.data)
}

// 封装 POST 请求
export function post<T = unknown>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
  return service.post<unknown, AxiosResponse<T>>(url, data, config).then(res => res.data)
}

// 封装 PUT 请求
export function put<T = unknown>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
  return service.put<unknown, AxiosResponse<T>>(url, data, config).then(res => res.data)
}

// 封装 DELETE 请求
export function del<T = unknown>(url: string, params?: RequestParams, config?: AxiosRequestConfig): Promise<T> {
  return service.delete<unknown, AxiosResponse<T>>(url, { params, ...config }).then(res => res.data)
}

export default service
