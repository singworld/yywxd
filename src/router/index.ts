import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('pages/IndexPage.vue'),
    meta: { title: '中国业余无线电考试系统' }
  },
  {
    path: '/categories',
    component: () => import('pages/CategoryPage.vue'),
    meta: { title: '题目分类' }
  },
  {
    path: '/study/:category',
    component: () => import('pages/StudyPage.vue'),
    meta: { title: '学习模式' }
  },
  {
    path: '/memory-handbook',
    component: () => import('pages/MemoryHandbookPage.vue'),
    meta: { title: '记忆手册' }
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router