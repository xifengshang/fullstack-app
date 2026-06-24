# Pinia 详细使用 Demo

> 基于当前项目：Pinia 3.x + Vue 3.5 + TypeScript 6.x

---

## 目录

1. [注册 Pinia](#1-注册-pinia)
2. [Option Store vs Setup Store](#2-option-store-vs-setup-store)
3. [基础用法：计数器](#3-基础用法计数器)
4. [在组件中使用](#4-在组件中使用)
5. [Getters：计算属性](#5-getters计算属性)
6. [Actions：异步操作](#6-actions异步操作)
7. [多 Store 互相调用](#7-多-store-互相调用)
8. [状态订阅与监听](#8-状态订阅与监听)
9. [插件：持久化存储](#9-插件持久化存储)
10. [完整实战：用户认证模块](#10-完整实战用户认证模块)

---

## 1. 注册 Pinia

```ts
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())  // 注册 Pinia
app.mount('#app')
```

---

## 2. Option Store vs Setup Store

### Option Store（传统写法）

```ts
// src/stores/counter-option.ts
import { defineStore } from 'pinia'

export const useCounterOptionStore = defineStore('counterOption', {
  state: () => ({
    count: 0,
    name: 'Eduardo'
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    doublePlusOne(): number {
      return this.doubleCount + 1
    }
  },
  actions: {
    increment() {
      this.count++
    },
    async fetchUser() {
      const res = await fetch('/api/user')
      this.name = await res.json()
    }
  }
})
```

### Setup Store（推荐写法，Composition API 风格）

```ts
// src/stores/counter.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // ===== State =====
  const count = ref(0)
  const name = ref('Eduardo')

  // ===== Getters =====
  const doubleCount = computed(() => count.value * 2)
  const doublePlusOne = computed(() => doubleCount.value + 1)

  // ===== Actions =====
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  async function fetchUser() {
    const res = await fetch('/api/user')
    name.value = await res.json()
  }

  return {
    count,
    name,
    doubleCount,
    doublePlusOne,
    increment,
    decrement,
    fetchUser
  }
})
```

> **企业推荐**：Setup Store，与 Vue 3 Composition API 风格一致，TypeScript 类型推断更自然。

---

## 3. 基础用法：计数器

```ts
// src/stores/counter.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = 0
  }

  return { count, doubleCount, increment, decrement, reset }
})
```

---

## 4. 在组件中使用

### 4.1 基础使用

```vue
<!-- src/views/CounterView.vue -->
<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Double: {{ counter.doubleCount }}</p>
    <button @click="counter.increment">+</button>
    <button @click="counter.decrement">-</button>
    <button @click="counter.reset">Reset</button>
  </div>
</template>
```

### 4.2 解构保持响应式（storeToRefs）

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

// ✅ 保持响应式
const { count, doubleCount } = storeToRefs(counter)

// ❌ 错误：直接解构会失去响应式
// const { count } = counter

// 方法可以直接解构
const { increment, reset } = counter
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

### 4.3 直接修改 State（不推荐但允许）

```ts
const counter = useCounterStore()

// 可以直接修改（Pinia 允许）
counter.count = 10

// 批量修改（更推荐）
counter.$patch({
  count: counter.count + 1,
  name: 'New Name'
})

// 函数式批量修改（推荐用于复杂逻辑）
counter.$patch((state) => {
  state.count++
  state.name = 'New Name'
})
```

---

## 5. Getters：计算属性

```ts
// src/stores/cart.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface Product {
  id: number
  name: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<Product[]>([])

  // 基础 Getter
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // 依赖其他 Getter
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  // 带参数的 Getter（返回函数）
  const itemById = computed(() => {
    return (id: number) => items.value.find((item) => item.id === id)
  })

  function addItem(product: Product) {
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity += product.quantity
    } else {
      items.value.push(product)
    }
  }

  function removeItem(id: number) {
    const index = items.value.findIndex((item) => item.id === id)
    if (index > -1) items.value.splice(index, 1)
  }

  return { items, totalItems, totalPrice, itemById, addItem, removeItem }
})
```

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const { totalItems, totalPrice, itemById } = storeToRefs(cart)

const product = itemById.value(1) // 使用带参数的 Getter
</script>
```

---

## 6. Actions：异步操作

```ts
// src/stores/post.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
}

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPosts() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('http://localhost:5000/posts')
      if (!res.ok) throw new Error('Failed to fetch')
      posts.value = await res.json()
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  async function fetchPostById(id: string) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`http://localhost:5000/posts/${id}`)
      if (!res.ok) throw new Error('Post not found')
      currentPost.value = await res.json()
    } catch (err) {
      error.value = (err as Error).message
      currentPost.value = null
    } finally {
      loading.value = false
    }
  }

  async function createPost(data: Omit<Post, 'id' | 'createdAt'>) {
    loading.value = true
    try {
      const res = await fetch('http://localhost:5000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to create')
      const newPost = await res.json()
      posts.value.unshift(newPost)
      return newPost
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    currentPost,
    loading,
    error,
    fetchPosts,
    fetchPostById,
    createPost
  }
})
```

```vue
<!-- src/views/PostsView.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostStore } from '@/stores/post'

const postStore = usePostStore()
const { posts, loading, error } = storeToRefs(postStore)

onMounted(() => {
  postStore.fetchPosts()
})
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ul v-else>
      <li v-for="post in posts" :key="post.id">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
      </li>
    </ul>
  </div>
</template>
```

---

## 7. 多 Store 互相调用

```ts
// src/stores/user.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoggedIn = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function clearToken() {
    token.value = null
    localStorage.removeItem('token')
  }

  return { token, isLoggedIn, setToken, clearToken }
})
```

```ts
// src/stores/notification.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', () => {
  const messages = ref<{ id: number; text: string; type: string }[]>([])
  let nextId = 0

  function addMessage(text: string, type = 'info') {
    messages.value.push({ id: nextId++, text, type })
    setTimeout(() => removeMessage(nextId - 1), 3000)
  }

  function removeMessage(id: number) {
    const index = messages.value.findIndex((m) => m.id === id)
    if (index > -1) messages.value.splice(index, 1)
  }

  return { messages, addMessage, removeMessage }
})
```

```ts
// src/stores/cart.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useNotificationStore } from './notification'

export const useCartStore = defineStore('cart', () => {
  const items = ref<{ id: number; name: string; price: number }[]>([])

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price, 0)
  )

  function addToCart(product: { id: number; name: string; price: number }) {
    const userStore = useUserStore()
    const notificationStore = useNotificationStore()

    if (!userStore.isLoggedIn) {
      notificationStore.addMessage('请先登录', 'warning')
      return
    }

    items.value.push(product)
    notificationStore.addMessage(`${product.name} 已加入购物车`, 'success')
  }

  function checkout() {
    // 结算逻辑...
    items.value = []
  }

  return { items, totalPrice, addToCart, checkout }
})
```

---

## 8. 状态订阅与监听

### 8.1 订阅整个 Store 变化

```ts
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

// 每次 state 变化时执行
const unsubscribe = counter.$subscribe((mutation, state) => {
  console.log('mutation type:', mutation.type)
  console.log('mutation storeId:', mutation.storeId)
  console.log('new state:', state)

  // 可以持久化到 localStorage
  localStorage.setItem('counter', JSON.stringify(state))
})

// 取消订阅
unsubscribe()
```

### 8.2 监听特定属性

```ts
import { watch } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

watch(
  () => userStore.token,
  (newToken, oldToken) => {
    if (newToken) {
      console.log('用户已登录')
    } else {
      console.log('用户已登出')
    }
  },
  { immediate: true }
)
```

### 8.3 监听 Action

```ts
counter.$onAction(({ name, store, args, after, onError }) => {
  const startTime = Date.now()
  console.log(`Action "${name}" started with args:`, args)

  after((result) => {
    console.log(`Action "${name}" finished in ${Date.now() - startTime}ms, result:`, result)
  })

  onError((error) => {
    console.error(`Action "${name}" failed:`, error)
  })
})
```

---

## 9. 插件：持久化存储

### 9.1 手写持久化插件

```ts
// src/plugins/piniaPersist.ts
import type { PiniaPluginContext } from 'pinia'

export function piniaPersist({ store }: PiniaPluginContext) {
  // 从 localStorage 恢复
  const stored = localStorage.getItem(store.$id)
  if (stored) {
    store.$patch(JSON.parse(stored))
  }

  // 监听变化并保存
  store.$subscribe((mutation, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state))
  })
}
```

```ts
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { piniaPersist } from './plugins/piniaPersist'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPersist)

const app = createApp(App)
app.use(pinia)
app.mount('#app')
```

### 9.2 使用官方插件

```bash
npm install pinia-plugin-persistedstate
```

```ts
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.mount('#app')
```

```ts
// src/stores/user.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string | null>(null)
    const userInfo = ref<{ name: string; email: string } | null>(null)

    function setToken(newToken: string) {
      token.value = newToken
    }

    return { token, userInfo, setToken }
  },
  {
    persist: {
      key: 'my-app-user',
      paths: ['token'] // 只持久化 token，不持久化 userInfo
    }
  }
)
```

---

## 10. 完整实战：用户认证模块

```ts
// src/stores/auth.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

interface User {
  id: number
  username: string
  email: string
  avatar?: string
}

interface LoginForm {
  username: string
  password: string
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    // ===== State =====
    const token = ref<string | null>(null)
    const user = ref<User | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // ===== Getters =====
    const isLoggedIn = computed(() => !!token.value && !!user.value)
    const isAdmin = computed(() => user.value?.username === 'admin')

    // ===== Actions =====
    async function login(form: LoginForm) {
      loading.value = true
      error.value = null

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.message || '登录失败')
        }

        const data = await res.json()
        token.value = data.token
        user.value = data.user

        // 保存到本地
        localStorage.setItem('token', data.token)

        return true
      } catch (err) {
        error.value = (err as Error).message
        return false
      } finally {
        loading.value = false
      }
    }

    async function fetchUser() {
      if (!token.value) return

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token.value}` }
        })

        if (res.ok) {
          user.value = await res.json()
        } else {
          logout()
        }
      } catch {
        logout()
      }
    }

    function logout() {
      token.value = null
      user.value = null
      error.value = null
      localStorage.removeItem('token')
    }

    function initAuth() {
      const savedToken = localStorage.getItem('token')
      if (savedToken) {
        token.value = savedToken
        fetchUser()
      }
    }

    return {
      token,
      user,
      loading,
      error,
      isLoggedIn,
      isAdmin,
      login,
      logout,
      fetchUser,
      initAuth
    }
  },
  {
    persist: {
      key: 'auth',
      paths: ['token'] // 只持久化 token
    }
  }
)
```

```vue
<!-- src/views/LoginView.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)

const form = ref({
  username: '',
  password: ''
})

async function handleSubmit() {
  const success = await authStore.login(form.value)
  if (success) {
    router.push('/')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <h2>登录</h2>
    <div v-if="error" class="error">{{ error }}</div>
    <input v-model="form.username" placeholder="用户名" required />
    <input v-model="form.password" type="password" placeholder="密码" required />
    <button type="submit" :disabled="loading">
      {{ loading ? '登录中...' : '登录' }}
    </button>
  </form>
</template>
```

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">首页</RouterLink>
      <template v-if="authStore.isLoggedIn">
        <span>欢迎, {{ authStore.user?.username }}</span>
        <button @click="authStore.logout">退出</button>
      </template>
      <RouterLink v-else to="/login">登录</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>
```

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/views/HomeView.vue') },
    { path: '/login', component: () => import('@/views/LoginView.vue') },
    {
      path: '/profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
```

---

## 附录：当前项目已有的 Store

```ts
// src/stores/counter.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

---

> 更多内容参考 [Pinia 官方文档](https://pinia.vuejs.org/zh/)
