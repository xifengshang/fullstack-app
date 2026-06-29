<template>
    <div class="login-container">
        <div class="login-left">
            <div class="brand">
                <h1>后台管理系统</h1>
                <p>登录以继续使用</p>
            </div>
        </div>
        <div class="login-right">
            <el-card shadow="hover">
                <el-tabs v-model="activeTab">
                    <el-tab-pane label="登录" name="login">登录表单</el-tab-pane>
                    <el-tab-pane label="注册" name="register">注册表单</el-tab-pane>
                </el-tabs>
                <!-- 登录表单 -->
                <el-form :model="loginForm" ref="loginFormRef" :rules="loginRules" label-width="80px" label-position="right" v-if="activeTab === 'login'" class="mt-4">
                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="loginForm.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="loginForm.password" type="password"></el-input>
                    </el-form-item>
                    <!-- <el-button @click="handleRegister">注册</el-button> -->
                    <el-button @click="handleLogin" type="primary" class="w-full mt-2">登录</el-button>
                </el-form>
                <!-- 注册表单 -->
                <el-form :model="registerForm" ref="registerFormRef" label-width="80px" label-position="right" :rules="registerRules" v-if="activeTab === 'register'" class="mt-4">
                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="registerForm.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="registerForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="registerForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-button @click="handleRegister" type="primary" class="w-full mt-2">注册</el-button>
                </el-form>
            </el-card>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { loginApi, registerApi } from '@/api/auth.ts'

const router = useRouter()
const authStore = useAuthStore()

// tab切换
const activeTab = ref('login')

// 登录
const loginFormRef = ref()
const loginForm = ref({
  username: '',
  password: '',
  nickname: ''
})

const loginRules = ref({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const handleLogin = async () => {
    await loginFormRef.value.validate()
    const res = await loginApi(loginForm.value)
    if (res.data.code === 200) {
        authStore.setLoginState(res.data.data.token, res.data.data)
        router.push({ name: 'HomeView' })
    }
    console.log(res)
}

// 注册
const registerFormRef = ref()
const registerForm = ref({
  username: '',
  password: '',
  nickname: ''
})

const registerRules = ref({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const handleRegister = async () => {
  await registerFormRef.value.validate()
  const res = await registerApi(registerForm.value)
  if (res.data.code === 200) {
    alert(res.data.msg)
  } else {
    alert(res.data.msg)
  }
}
</script>
<style scoped>
.login-container {
  display: flex;
  height: 100vh;
}
.login-left {
  flex: 1;
  background: #165DFF;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}
.brand h1 {
  font-size: 36px;
  margin-bottom: 12px;
}
.brand p {
  opacity: 0.8;
  font-size: 16px;
}
.w-full {
  width: 100%;
}
.mt-2 {
  margin-top: 16px;
}
.mt-4 {
  margin-top: 24px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  .login-left {
    flex: none;
    height: 200px;
  }
}
</style>