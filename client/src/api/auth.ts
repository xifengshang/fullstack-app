import request from '../utils/request.ts'

// 登录入参类型
export interface LoginForm {
  username: string
  password: string
}

// 注册入参类型
export interface RegisterForm {
  username: string
  password: string
  nickname: string
}

// 用户信息
export interface UserInfo {
  id: string
  username: string
  nickname: string
  token: string
}

// 登录接口
export function loginApi(data: LoginForm) {
  return request.post<UserInfo>('/auth/login', data)
}

// 注册接口
export function registerApi(data: RegisterForm) {
  return request.post('/auth/register', data)
}
