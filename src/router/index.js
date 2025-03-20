import { createRouter, createWebHistory } from 'vue-router'
import FontsHome from '../components/FontsHome.vue'
import FontDetailView from '../components/FontDetailView.vue'

const routes = [
  {
    path: '/',
    redirect: '/fonts'
  },
  {
    path: '/fonts',
    name: 'Fonts',
    component: FontsHome
  },
  {
    path: '/fonts/:id',
    name: 'FontDetail',
    component: FontDetailView,
    props: true
  },
  {
    path: '/fonts/:id/family',
    name: 'FontFamily',
    // Lazy-loading route
    component: () => import('../components/FontFamilyView.vue'),
    props: true
  },
  {
    path: '/pairs',
    name: 'Pairs',
    // Lazy-loading route
    component: () => import('../components/PairsView.vue')
  },
  {
    path: '/licenses',
    name: 'Licenses',
    // Lazy-loading route
    component: () => import('../components/LicensesView.vue')
  },
  // {
  //   path: '/font-demo',
  //   name: 'FontDemo',
  //   // Lazy-loading route
  //   component: () => import('../views/FontDemo.vue')
  // },
  {
    path: '/font-example',
    name: 'FontExample',
    // Lazy-loading route
    component: () => import('../views/FontExample.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 