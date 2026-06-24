import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

// 定义后端返回格式
interface ResponseData<T = any> {
  code: number
  data: T
  msg: string
}

// 创建axios实例
const service:AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/admin', // 后端统一前缀
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    return res
  }
  ,
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

export default service