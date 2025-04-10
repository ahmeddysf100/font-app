import { createRouter, createWebHistory } from 'vue-router'
import FontsHome from '../components/FontsHome.vue'
import FontDetailView from '../components/FontDetailView.vue'
import ContactView from '../views/ContactView.vue'
import TermsView from '../views/TermsView.vue'
import AboutView from '../views/AboutView.vue'

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
    path: '/licenses',
    name: 'Licenses',
    // Lazy-loading route
    component: () => import('../components/LicensesView.vue')
  },
  {
    path: '/about',
    name: 'About',
    // Lazy-loading route
    component: AboutView
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsView
  },
  // {
  //   path: '/font-demo',
  //   name: 'FontDemo',
  //   // Lazy-loading route
  //   component: () => import('../views/FontDemo.vue')
  // },

]

const router = createRouter({
  history: createWebHistory('/kotype/'),
  routes
})

export default router 