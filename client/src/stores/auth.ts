import { defineStore } from 'pinia';
import { ref } from 'vue';

// 用户信息类型
interface User {
    id: string
    username: string
    nickname: string
    roleId?: string
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref('')
    const userInfo = ref<User | null>(null)
    
    // 登录赋值
    const setLoginState = (newToken: string, user: User) => {
        token.value = newToken
        userInfo.value = user
    }

    // 退出登录
    const logout = () => {
        token.value = ''
        userInfo.value = null
        localStorage.clear()
    }

    // 判断是否登录
    const isLogin = () => {
        return !!token.value
    }

    return {
        token,
        userInfo,
        setLoginState,
        logout,
        isLogin,
    }
}
,{
    // 开启持久化
    persist:true
})