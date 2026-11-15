import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { titleKey: 'navHome' },
    },
    {
      path: '/browse',
      name: 'browse',
      component: () => import('@/views/BrowseView.vue'),
      meta: { titleKey: 'navBrowse' },
    },
    {
      path: '/audios/:slug',
      name: 'audio-detail',
      component: () => import('@/views/AudioDetailView.vue'),
      meta: { titleKey: 'audioDetailTitle' },
    },
    {
      path: '/teachers',
      name: 'teachers',
      component: () => import('@/views/TeachersView.vue'),
      meta: { titleKey: 'navTeachers' },
    },
    {
      path: '/teachers/:slug',
      name: 'teacher-detail',
      component: () => import('@/views/TeacherDetailView.vue'),
      meta: { titleKey: 'navTeachers' },
    },
    {
      path: '/download',
      name: 'download',
      component: () => import('@/views/DownloadView.vue'),
      meta: { titleKey: 'navDownload' },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
      meta: { titleKey: 'navPrivacy' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { titleKey: 'errorNotFoundTitle' },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

export default router
