<template>
    <div>
        <el-form :model="form">
            <el-form-item label="用户名">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
                <el-input v-model="form.nickname"></el-input>
            </el-form-item>
            <el-button @click="handleRegister">注册</el-button>
            <el-button @click="handleLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { loginApi, registerApi } from '@/api/auth.ts'

const form = ref({
  username: '',
  password: '',
  nickname: ''
})

const handleRegister = async () => {
  const res = await registerApi(form.value)
  if (res.data.code === 200) {
    alert(res.data.msg)
  } else {
    alert(res.data.msg)
  }
}

const handleLogin = async () => {
  const res = await loginApi(form.value)
  console.log(res)
}
</script>