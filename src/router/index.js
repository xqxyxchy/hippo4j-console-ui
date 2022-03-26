import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'
import toolRouter from './modules/tool'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
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
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/admin/index'),
        name: 'Dashboard',
        meta: { title: '运行报表', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/hippo4j/monitor',
    component: () => import('@/views/hippo4j/monitor/index'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },
  {
    path: '/hippo4j/tenant',
    component: Layout,
    redirect: '/hippo4j/tenantList',
    name: 'tenant',
    meta: { title: '租户管理', icon: 'lessee' },
    children: [
      {
        path: 'tenantList',
        name: 'tenantList',
        component: () => import('@/views/hippo4j/tenant/index'),
        meta: { title: '租户管理', icon: 'lessee' }
      }
    ]
  },
  {
    path: '/hippo4j/item',
    component: Layout,
    redirect: '/hippo4j/itemList',
    name: 'item',
    meta: { title: '项目管理', icon: 'project' },
    children: [
      {
        path: 'itemList',
        name: 'itemList',
        component: () => import('@/views/hippo4j/item/index'),
        meta: { title: '项目管理', icon: 'documentation' }
      }
    ]
  },
  {
    path: '/hippo4j/threadPool',
    component: Layout,
    redirect: '/hippo4j/threadPoolList',
    name: 'threadPool',
    meta: { title: '线程池管理', icon: 'tree' },
    children: [
      {
        path: 'threadPoolList',
        name: 'threadPoolList',
        component: () => import('@/views/hippo4j/threadpool/index'),
        meta: { title: '线程池管理' }
      },
      {
        path: 'instanceList',
        name: 'instanceList',
        component: () => import('@/views/hippo4j/instance/index'),
        meta: { title: '线程池实例' }
      },
      {
        path: 'monitorList',
        name: 'monitorList',
        component: () => import('@/views/hippo4j/monitor/index'),
        meta: { title: '线程池监控' }
      },
      {
        path: 'serverPoolList',
        name: 'serverPoolList',
        component: () => import('@/views/hippo4j/server/index'),
        meta: { title: '容器线程池' }
      },
      {
        path: 'runDataList',
        name: 'runDataList',
        component: () => import('@/views/hippo4j/monitor/hisRunData/index'),
        meta: { title: '线程池历史' }
      }
    ]
  },
  {
    path: '/hippo4j/notify',
    component: Layout,
    redirect: '/hippo4j/notifyList',
    name: 'notify',
    meta: { title: '报警通知', icon: 'work' },
    children: [
      {
        path: 'notifyList',
        name: 'notifyList',
        component: () => import('@/views/hippo4j/notify/index'),
        meta: { title: '报警通知', icon: 'password' }
      }
    ]
  },
  {
    path: '/hippo4j/user',
    component: Layout,
    redirect: '/hippo4j/userList',
    name: 'user',
    meta: { title: '用户权限', icon: 'work', roles: ['ROLE_ADMIN'] },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/hippo4j/user/index'),
        meta: { title: '用户权限', icon: 'table' }
      }
    ]
  },
  {
    path: '/hippo4j/log',
    component: Layout,
    redirect: '/hippo4j/logList',
    name: 'log',
    meta: { title: '日志管理', icon: 'work' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/hippo4j/log/index'),
        meta: { title: '日志管理', icon: 'bug' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://hippox.cn',
        meta: { title: '官网外链', icon: 'link' }
      }
    ]
  },

  toolRouter,
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
