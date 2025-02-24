import { createRouter, createWebHistory } from 'vue-router';
import Experience from '../views/AudioVideoCall/Experience/Index.vue';

// 定义路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Experience
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;