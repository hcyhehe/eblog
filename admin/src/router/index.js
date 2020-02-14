import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'


/**
 * constantRouterMap： 代表那些不需要动态判断权限的路由，如登录页、404、等通用页面。
 * asyncRouterMap： 代表那些需求动态判断权限并通过 addRouters 动态添加的页面。
*/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
]

export const asyncRouterMap = [
  {
    path: '/gift',
    component: Layout,
    redirect: '/gift/list',
    meta: {roles: ['admin','editor']},
    children: [
      {
        path: 'list',
        component: () => import('@/myviews/gift/list'),
        name: 'giftList',
        meta: { title: '礼品管理', icon: 'theme', noCache: true }
      },
      {
        path: 'add',
        component: () => import('@/myviews/gift/add'),
        name: 'giftAdd',
        meta: { title: '添加礼品', icon: '', noCache: true },
        hidden: true,
      },
      {
        path: 'edit',
        component: () => import('@/myviews/gift/edit'),
        name: 'giftEdit',
        meta: { title: '编辑礼品', icon: '', noCache: true },
        hidden: true,
      },
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    meta: {roles: ['admin'], icon: 'wechat', title: '会员管理'},
    children: [
      {
        path: 'list',
        component: () => import('@/myviews/user/list'),
        name: 'userList',
        meta: { title: '所有会员', noCache: true }
      }
    ]
  },
  {
    path: '/rule',
    component: Layout,
    redirect: '/rule/info',
    meta: {roles: ['admin']},
    children: [
      {
        path: 'info',
        component: () => import('@/myviews/rule/info'),
        name: 'ruleInfo',
        meta: { title: '奖励规则', icon: 'example', noCache: true }
      }
    ]
  },

  {
    path: '/point',
    component: Layout,
    redirect: '/point/list',
    meta: {roles: ['admin']},
    children: [
      {
        path: 'list',
        component: () => import('@/myviews/point/list'),
        name: 'pointList',
        meta: { title: '积分管理', icon: 'tree', noCache: true }
      }
    ]
  },
  
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
