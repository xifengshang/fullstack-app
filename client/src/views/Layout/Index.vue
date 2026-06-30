<template>
    <el-container style="height: 100vh;">
        <!-- 左边侧边栏 -->
         <el-aside width="220px" class="aside">
            <div class="logo">后台管理系统</div>
            <el-menu
                default-active="1"
                class="menu"
                background-color="#304156"
                text-color="#bfcbd9"
                active-text-color="#409EFF"
            >
                <el-menu-item index="1">
                    <el-icon><House /></el-icon>
                    <span>首页</span>
                </el-menu-item>
                <el-sub-menu index="user">
                    <template #title>
                        <el-icon><User /></el-icon>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="user-list">用户列表</el-menu-item>
                    <el-menu-item index="role-list">角色管理</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="movie">
                    <template #title>
                        <el-icon><Film /></el-icon>
                        <span>电影管理</span>
                    </template>
                    <el-menu-item index="movie-list">电影列表</el-menu-item>
                </el-sub-menu>
            </el-menu>
         </el-aside>
         <el-container>
            <!-- 顶部头部 -->
            <el-header class="header">
                <div class="left">欢迎回来</div>
                <div class="right">
                    <el-dropdown>
                        <span class="user">管理员</span>
                        <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>修改密码</el-dropdown-item>
                            <el-dropdown-item>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-header>
            <!-- 主要内容 -->
             <el-main class="main">
                <router-view></router-view>
             </el-main>
         </el-container>
    </el-container>
</template>
<script setup lang="ts">
import { House, User, Film } from '@element-plus/icons-vue'
</script>
<style scoped>
.aside {
  background-color: #304156;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: white;
  font-size: 18px;
  border-bottom: 1px solid #1f2d3d;
}
.menu {
  border: none;
}
.header {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
}
.main {
  background: #f5f7fa;
  padding: 15px;
}
.user {
  cursor: pointer;
}
</style>