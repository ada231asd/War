import { createRouter, createWebHistory } from 'vue-router'
import BlogHome from '../views/BlogHome.vue'

const routes = [
  {
    path: '/',
    redirect: '/blog'
  },
  {
    path: '/blog',
    name: 'BlogHome',
    component: BlogHome
  },
  {
    path: '/sight-editor',
    name: 'SightEditor',
    component: () => import('../views/SightEditor.vue')
  },
  {
    path: '/skin-editor',
    name: 'SkinEditor',
    component: () => import('../views/SkinEditor.vue')
  },
  {
    path: '/library',
    name: 'Library',
    component: () => import('../views/Library.vue')
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('../views/Community.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router 