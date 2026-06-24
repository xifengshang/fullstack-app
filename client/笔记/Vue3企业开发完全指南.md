# Vue3 企业开发完全指南

> 面向企业级前端开发的 Vue 3 系统学习文档。基于当前项目技术栈：`Vue 3.5.x` + `TypeScript 6.x` + `Vite 8.x` + `Vue Router 5.x` + `Pinia 3.x`。

---

## 目录

1. [Vue3 核心优势与选型](#1-vue3-核心优势与选型)
2. [项目初始化与工程配置](#2-项目初始化与工程配置)
3. [组合式 API 深入理解](#3-组合式-api-深入理解)
4. [响应式系统](#4-响应式系统)
5. [计算属性与侦听器](#5-计算属性与侦听器)
6. [生命周期](#6-生命周期)
7. [组件化开发](#7-组件化开发)
8. [组件通信](#8-组件通信)
9. [可复用逻辑：Composables](#9-可复用逻辑composables)
10. [TypeScript 集成](#10-typescript-集成)
11. [Vue Router 5 企业实践](#11-vue-router-5-企业实践)
12. [Pinia 状态管理](#12-pinia-状态管理)
13. [性能优化](#13-性能优化)
14. [企业开发规范与最佳实践](#14-企业开发规范与最佳实践)
15. [常见问题与面试题](#15-常见问题与面试题)

---

## 1. Vue3 核心优势与选型

### 1.1 为什么选择 Vue3

| 特性 | Vue2 | Vue3 |
| --- | --- | --- |
| 响应式原理 | `Object.defineProperty` | `Proxy` |
| API 风格 | Options API | Options API + Composition API |
| TypeScript 支持 | 较弱 | 原生友好 |
| 性能 | 一般 | 更快，Tree-shaking 更好 |
| 逻辑复用 | Mixins | Composables |
| 组件结构 | 单一选项对象 | 更灵活的组合式函数 |

### 1.2 企业级关键特性

- **Proxy 响应式**：支持 Map、Set、数组索引、属性新增/删除的监听。
- **Composition API**：将相关逻辑组织在一起，解决 Options API 中逻辑分散的问题。
- **更好的 Tree-shaking**：未使用的 API 不会被打包。
- **Teleport / Suspense**：更优雅的模态框、异步组件处理。
- **更好的 TypeScript 支持**：类型推断更自然。

---

## 2. 项目初始化与工程配置

### 2.1 使用 create-vue 初始化

```bash
npm create vue@latest client
```

推荐配置：

- TypeScript：Yes
- JSX：按需开启
- Vue Router：Yes
- Pinia：Yes
- Vitest：测试
- ESLint / Prettier：Yes

### 2.2 当前项目关键文件说明

```text
client/
├── src/
│   ├── App.vue          # 根组件
│   ├── main.ts          # 应用入口
│   ├── router/index.ts  # 路由配置
│   ├── stores/          # Pinia Store
│   └── views/           # 页面级组件
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TS 配置
└── env.d.ts             # 环境变量类型声明
```

### 2.3 Vite 配置示例

```ts
// vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

---

## 3. 组合式 API 深入理解

### 3.1 setup 函数与 `<script setup>`

推荐直接使用 `<script setup>`，它是 Composition API 的语法糖。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">Count: {{ count }}</button>
</template>
```

### 3.2 为什么需要组合式 API

在大型组件中，Options API 会导致同一功能的代码分散在 `data`、`methods`、`computed`、`watch` 中。Composition API 允许按功能组织代码。

```vue
<script setup lang="ts">
// 功能 A：用户列表
import { useUsers } from './composables/useUsers'
// 功能 B：搜索
import { useSearch } from './composables/useSearch'

const { users, loadUsers } = useUsers()
const { keyword, filteredList } = useSearch(users)
</script>
```

---

## 4. 响应式系统

### 4.1 ref 与 reactive 的区别

| 特性 | ref | reactive |
| --- | --- | --- |
| 数据类型 | 任意类型（推荐原始值） | 对象、数组、Map、Set |
| 访问方式 | `.value` | 直接访问属性 |
| 模板中 | 自动解包 | 直接使用 |
| 适用场景 | 单一值、需要重新赋值 | 复杂对象结构 |

```ts
import { ref, reactive } from 'vue'

const count = ref(0)
const user = reactive({ name: 'Tom', age: 20 })

// 修改
console.log(count.value) // 0
count.value++
user.age++
```

### 4.2 ref 在 reactive 中自动解包

```ts
const count = ref(0)
const state = reactive({ count })

console.log(state.count) // 0
state.count = 1
console.log(count.value) // 1
```

### 4.3 响应式丢失场景

```ts
const state = reactive({ list: [1, 2, 3] })

// ❌ 错误：直接解构会丢失响应式
const { list } = state

// ✅ 正确：使用 toRefs 保持响应式
import { toRefs } from 'vue'
const { list: reactiveList } = toRefs(state)
```

### 4.4 响应式工具函数

| 函数 | 作用 |
| --- | --- |
| `toRef` | 为响应式对象的属性创建 ref |
| `toRefs` | 将整个响应式对象转为普通对象，属性为 ref |
| `isRef` | 检查是否为 ref |
| `isReactive` | 检查是否为 reactive |
| `unref` | 是 ref 返回 `.value`，否则返回原值 |
| `shallowRef` | 只追踪 `.value` 的变更，不深层响应 |
| `shallowReactive` | 只进行第一层响应式代理 |
| `readonly` | 创建只读响应式对象 |
| `toRaw` | 获取原始对象 |

---

## 5. 计算属性与侦听器

### 5.1 computed

```ts
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// 只读计算属性
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// 可写计算属性
const fullNameWritable = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (val) => {
    const [first, last] = val.split(' ')
    firstName.value = first
    lastName.value = last
  }
})
```

> 注意：`computed` 不应有副作用，只用于派生状态。

### 5.2 watch

```ts
import { ref, watch } from 'vue'

const userId = ref(1)
const userInfo = ref(null)

watch(
  userId,
  async (newVal, oldVal) => {
    userInfo.value = await fetchUser(newVal)
  },
  { immediate: true, deep: false }
)
```

监听多个源：

```ts
watch([foo, bar], ([newFoo, newBar], [oldFoo, oldBar]) => {
  // ...
})
```

### 5.3 watchEffect

自动追踪依赖，立即执行。

```ts
import { ref, watchEffect } from 'vue'

const count = ref(0)
const double = ref(0)

watchEffect(() => {
  double.value = count.value * 2
})
```

### 5.4 watch vs watchEffect

| 特性 | watch | watchEffect |
| --- | --- | --- |
| 懒执行 | 是 | 否 |
| 明确源 | 是 | 自动追踪 |
| 旧值 | 可获取 | 不可获取 |
| 适用场景 | 特定状态变化时执行副作用 | 依赖自动收集的副作用 |

---

## 6. 生命周期

### 6.1 组合式 API 生命周期钩子

| Options API | Composition API | 说明 |
| --- | --- | --- |
| `beforeCreate` | 无需 | setup 替代 |
| `created` | 无需 | setup 替代 |
| `beforeMount` | `onBeforeMount` | 挂载前 |
| `mounted` | `onMounted` | 挂载完成 |
| `beforeUpdate` | `onBeforeUpdate` | 更新前 |
| `updated` | `onUpdated` | 更新完成 |
| `beforeUnmount` | `onBeforeUnmount` | 卸载前 |
| `unmounted` | `onUnmounted` | 卸载完成 |
| `errorCaptured` | `onErrorCaptured` | 错误捕获 |
| `renderTracked` | `onRenderTracked` | 调试依赖追踪 |
| `renderTriggered` | `onRenderTriggered` | 调试重新渲染触发 |

### 6.2 典型使用场景

```ts
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  // DOM 已就绪，可执行初始化请求、绑定事件
})

onUnmounted(() => {
  // 清理定时器、事件监听、WebSocket 连接
})
```

---

## 7. 组件化开发

### 7.1 组件命名规范

- 文件名使用大驼峰：`UserProfile.vue`
- 基础组件使用 `Base` 前缀：`BaseButton.vue`
- 业务组件使用模块前缀：`ArticleList.vue`
- 页面组件使用 `View` 后缀：`HomeView.vue`

### 7.2 Props 定义（TypeScript 严格模式）

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  items: { id: number; name: string }[]
}

// 使用 withDefaults 提供默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// 等价于 defineProps<Props>()
</script>
```

### 7.3 Emits 定义

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update', id: number): void
  (e: 'change', value: string, oldValue: string): void
}>()

function handleClick() {
  emit('update', 1)
}
</script>
```

### 7.4 Slots 使用

```vue
<!-- BaseCard.vue -->
<template>
  <div class="card">
    <header v-if="$slots.header">
      <slot name="header" />
    </header>
    <main>
      <slot />
    </main>
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
```

### 7.5 异步组件与 Suspense

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => import('./HeavyComponent.vue'))
</script>

<template>
  <Suspense>
    <AsyncComp />
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

---

## 8. 组件通信

### 8.1 通信方式总览

| 方式 | 场景 |
| --- | --- |
| Props / Emits | 父子组件 |
| v-model | 父子双向绑定 |
| Provide / Inject | 跨层级祖孙组件 |
| Pinia / Vuex | 全局状态 |
| Event Bus | 不推荐，可用 mitt 替代 |
| Slots / Scoped Slots | 内容分发 |
| `$attrs` | 透传属性和事件 |
| `$refs` | 直接访问子组件实例 |

### 8.2 v-model 多个绑定

```vue
<!-- 父组件 -->
<Child v-model:title="pageTitle" v-model:content="pageContent" />

<!-- 子组件 -->
<script setup lang="ts">
const title = defineModel<string>('title')
const content = defineModel<string>('content')
</script>
```

### 8.3 Provide / Inject

```ts
// 祖先组件
import { provide, readonly, ref } from 'vue'

const user = ref({ id: 1, name: 'Tom' })
provide('user', readonly(user))

// 后代组件
import { inject } from 'vue'

const user = inject('user')
if (!user) {
  throw new Error('user must be provided')
}
```

> 建议提供默认值并做非空判断，生产环境可通过 `InjectionKey` + TypeScript 保证类型安全。

### 8.4 使用 `$attrs` 透传

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <input v-bind="$attrs" class="base-input" />
</template>
```

---

## 9. 可复用逻辑：Composables

### 9.1 什么是 Composable

以 `use` 开头的函数，封装响应式状态和逻辑，可在多个组件中复用。

### 9.2 示例：useFetch

```ts
// src/composables/useFetch.ts
import { ref, watchEffect, toValue } from 'vue'

export function useFetch<T>(url: string | (() => string)) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(toValue(url))
      data.value = await res.json()
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error, loading, refresh: fetchData }
}
```

### 9.3 Composable 设计原则

1. 以 `use` 开头命名。
2. 只封装响应式逻辑，不耦合 UI。
3. 在 `setup` 或 `<script setup>` 顶层调用，不要在异步函数中调用。
4. 返回对象，便于解构。
5. 注意副作用清理（`onUnmounted`）。

---

## 10. TypeScript 集成

### 10.1 组件 Props 类型

```vue
<script setup lang="ts">
interface Props {
  title: string
  tags?: string[]
}

const props = defineProps<Props>()
</script>
```

### 10.2 为 Template Ref 标注类型

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" />
</template>
```

### 10.3 为组件实例标注类型

```ts
import { ref, onMounted } from 'vue'
import type MyComponent from './MyComponent.vue'

const myRef = ref<InstanceType<typeof MyComponent> | null>(null)

onMounted(() => {
  myRef.value?.open()
})
```

### 10.4 tsconfig 配置要点

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

---

## 11. Vue Router 5 企业实践

### 11.1 路由配置结构

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/posts/:id',
    name: 'PostDetail',
    component: () => import('@/views/PostDetailView.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
```

### 11.2 导航守卫

```ts
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})
```

### 11.3 路由元信息与类型扩展

```ts
// env.d.ts 或 router 类型文件
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    title?: string
    roles?: string[]
  }
}
```

### 11.4 组合式路由 API

```ts
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

console.log(route.params.id)

function goBack() {
  router.back()
}
```

---

## 12. Pinia 状态管理

### 12.1 定义 Store

```ts
// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('token'))
  const userInfo = ref<{ id: number; name: string } | null>(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  async function fetchUserInfo() {
    if (!token.value) return
    const res = await fetch('/api/user/info', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    userInfo.value = await res.json()
  }

  function logout() {
    token.value = null
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    fetchUserInfo,
    logout
  }
})
```

### 12.2 在组件中使用

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

// 保持响应式
const { userInfo, isLoggedIn } = storeToRefs(userStore)

// 方法可直接解构
const { logout } = userStore
</script>
```

### 12.3 Pinia vs Vuex

| 特性 | Vuex | Pinia |
| --- | --- | --- |
| API | Options API | Composition API |
| TypeScript | 需要繁琐类型封装 | 原生支持 |
| 体积 | 较大 | 更轻量 |
| 模块化 | modules | 直接分文件定义 Store |
| Devtools | 支持 | 支持更好 |

---

## 13. 性能优化

### 13.1 常用优化手段

| 手段 | 说明 |
| --- | --- |
| `v-once` | 只渲染一次，跳过更新 |
| `v-memo` | 按条件缓存子树 |
| `computed` | 缓存计算结果 |
| `defineAsyncComponent` | 异步加载组件 |
| `shallowRef` / `shallowReactive` | 减少深层响应式开销 |
| `keep-alive` | 缓存组件实例 |
| 虚拟列表 | 大数据量列表渲染 |
| 事件委托 | 减少事件监听器数量 |

### 13.2 减少不必要的响应式

```ts
// 仅需要引用，不需要响应式
const chartInstance = shallowRef<echarts.ECharts | null>(null)
```

### 13.3 列表渲染 key 的重要性

```vue
<template>
  <ul>
    <li v-for="item in list" :key="item.id">{{ item.name }}</li>
  </ul>
</template>
```

> 永远为 `v-for` 提供稳定唯一的 `key`，避免使用索引作为 key。

---

## 14. 企业开发规范与最佳实践

### 14.1 项目结构建议

```text
src/
├── api/              # 接口请求
├── assets/           # 静态资源
├── components/       # 通用组件
│   ├── base/         # 基础组件
│   └── business/     # 业务组件
├── composables/      # 组合式函数
├── directives/       # 自定义指令
├── hooks/            # 与 composables 可合并
├── layouts/          # 布局组件
├── router/           # 路由
├── stores/           # Pinia Store
├── styles/           # 全局样式、变量
├── utils/            # 工具函数
├── views/            # 页面
└── types/            # 全局类型定义
```

### 14.2 代码规范要点

1. **统一使用 `<script setup>` + TypeScript**。
2. **Props / Emits 必须显式定义类型**。
3. **API 请求统一封装到 `api/` 目录**。
4. **状态管理按业务领域拆分 Store**。
5. **避免在模板中写复杂表达式**，使用 `computed`。
6. **组件职责单一**，避免一个组件超过 300 行代码。
7. **图片、SVG 等资源统一使用 `import` 引入**。
8. **错误处理统一，API 请求使用 try/catch**。

### 14.3 API 封装示例

```ts
// src/api/request.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    ...options
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Request failed: ${response.status}`)
  }

  return response.json()
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
```

```ts
// src/api/posts.ts
import { request } from './request'

export interface Post {
  id: string
  title: string
  content: string
  createdAt: string
}

export function getPosts() {
  return request<Post[]>('/posts')
}

export function getPostById(id: string) {
  return request<Post>(`/posts/${id}`)
}

export function createPost(data: Omit<Post, 'id' | 'createdAt'>) {
  return request<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
```

---

## 15. 常见问题与面试题

### Q1：Vue3 响应式原理是什么？

使用 `Proxy` 代理对象，拦截 `get`、`set`、`deleteProperty`、`has`、`ownKeys` 等操作。结合 `Reflect` 实现响应式依赖收集和触发。

### Q2：ref 和 reactive 的区别？

`ref` 用于任意类型，访问需 `.value`，可被整个替换；`reactive` 只用于对象，不能直接替换整个对象（会丢失响应式）。

### Q3：Composition API 相比 Options API 的优势？

逻辑按功能组织，便于复用和拆分；更好的 TypeScript 支持；代码更可维护。

### Q4：Pinia 如何实现状态持久化？

可在 action 中同步 `localStorage`，或使用 `pinia-plugin-persistedstate`。

### Q5：v-if 和 v-for 为什么不建议同时使用？

`v-if` 优先级低于 `v-for` 时，`v-if` 无法访问 `v-for` 作用域内的变量（Vue3 中 `v-if` 优先级更高，但仍不建议混用）。建议先用 `computed` 过滤数据。

### Q6：nextTick 的作用？

在 DOM 更新之后执行回调，用于获取更新后的 DOM。

### Q7：Teleport 的使用场景？

将组件模板渲染到 DOM 其他位置，常用于 Modal、Toast、Tooltip。

---

## 附录：当前项目启动命令

```bash
# 安装依赖
cd client && npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 构建生产包
npm run build
```

---

> 本文档持续维护，建议结合 [Vue 官方文档](https://cn.vuejs.org/) 和项目实际代码一起学习。
