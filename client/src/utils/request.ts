import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/auth'

// 定义后端返回格式
interface ResponseData<T = any> {
  code: number
  data: T
  message: string
}

// 创建axios实例
const service:AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/admin', // 后端统一前缀
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token && config.headers) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response
    return res
  }
  ,
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

export default service