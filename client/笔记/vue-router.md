前端

单独安装：npm install vue-router

如果使用create-vue脚手架，其中包含了vue router的选项：npm create vue@latest

## 创建路由实例
```JavaScript
import { createMemoryHistory, createRouter } from 'vue-router';

import HomeView from './HomeView.vue';
import AboutView from 'AboutView.vue';

const routes = [
    {path: '/', component: HomeView},
    {path: '/about', component: AboutView}
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router;
```

## 在main.js或者main.ts中使用
```JavaScript
const app = createApp(App);

app.use(router);
app.mount('#app');
```