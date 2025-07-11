import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomeView.vue')
  },
  {
    path: '/sight-editor',
    name: 'SightEditor',
    component: () => import('./views/SightEditorView.vue')
  },
  {
    path: '/skin-editor',
    name: 'SkinEditor',
    component: () => import('./views/SkinEditorView.vue')
  },
  {
    path: '/library',
    name: 'Library',
    component: () => import('./views/LibraryView.vue')
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('./views/CommunityView.vue')
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('./views/BlogView.vue')
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('./views/FAQView.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('./views/ContactView.vue')
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('./views/PrivacyView.vue')
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('./views/TermsView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/RegisterView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/ProfileView.vue')
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
