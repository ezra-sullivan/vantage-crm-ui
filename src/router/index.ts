import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layout/AdminLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AdminLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: '仪表盘' },
      },
      {
        path: 'user',
        name: 'User',
        redirect: '/user/list',
        children: [
          {
            path: 'list',
            name: 'UserList',
            component: () => import('@/views/user/UserListView.vue'),
            meta: { title: '用户列表' },
          },
          {
            path: 'role',
            name: 'UserRole',
            component: () => import('@/views/user/UserRoleView.vue'),
            meta: { title: '角色管理' },
          },
        ],
      },
      {
        path: 'customer',
        name: 'Customer',
        redirect: '/customer/list',
        children: [
          {
            path: 'list',
            name: 'CustomerList',
            component: () => import('@/views/customer/CustomerListView.vue'),
            meta: { title: '客户列表' },
          },
          {
            path: 'follow',
            name: 'CustomerFollow',
            component: () => import('@/views/customer/CustomerFollowView.vue'),
            meta: { title: '跟进记录' },
          },
        ],
      },
      {
        path: 'order',
        name: 'Order',
        redirect: '/order/list',
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: () => import('@/views/order/OrderListView.vue'),
            meta: { title: '订单列表' },
          },
          {
            path: 'statistics',
            name: 'OrderStatistics',
            component: () => import('@/views/order/OrderStatisticsView.vue'),
            meta: { title: '订单统计' },
          },
        ],
      },
      {
        path: 'report',
        name: 'Report',
        redirect: '/report/sales',
        children: [
          {
            path: 'sales',
            name: 'SalesReport',
            component: () => import('@/views/report/SalesReportView.vue'),
            meta: { title: '销售报表' },
          },
          {
            path: 'performance',
            name: 'PerformanceReport',
            component: () => import('@/views/report/PerformanceReportView.vue'),
            meta: { title: '业绩报表' },
          },
        ],
      },
      {
        path: 'system',
        name: 'System',
        redirect: '/system/config',
        children: [
          {
            path: 'config',
            name: 'SystemConfig',
            component: () => import('@/views/system/SystemConfigView.vue'),
            meta: { title: '系统配置' },
          },
          {
            path: 'log',
            name: 'SystemLog',
            component: () => import('@/views/system/SystemLogView.vue'),
            meta: { title: '系统日志' },
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
