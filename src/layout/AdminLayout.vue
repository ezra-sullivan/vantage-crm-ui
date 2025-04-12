<template>
  <div class="admin-layout">
    <el-container class="layout-container">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
        <div class="logo-container">
          <img src="../assets/logo.svg" alt="Logo" class="logo" />
          <h1 class="title" v-show="!isCollapse">Vantage CRM</h1>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          :collapse="isCollapse"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          router
        >
          <!-- 仪表盘菜单项 -->
          <el-menu-item index="/dashboard">
            <el-icon><Odometer /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>

          <!-- 用户管理 -->
          <el-sub-menu index="1">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/user/list">用户列表</el-menu-item>
            <el-menu-item index="/user/role">角色管理</el-menu-item>
          </el-sub-menu>

          <!-- 客户管理 -->
          <el-sub-menu index="2">
            <template #title>
              <el-icon><Avatar /></el-icon>
              <span>客户管理</span>
            </template>
            <el-menu-item index="/customer/list">客户列表</el-menu-item>
            <el-menu-item index="/customer/follow">跟进记录</el-menu-item>
          </el-sub-menu>

          <!-- 订单管理 -->
          <el-sub-menu index="3">
            <template #title>
              <el-icon><ShoppingCart /></el-icon>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/order/list">订单列表</el-menu-item>
            <el-menu-item index="/order/statistics">订单统计</el-menu-item>
          </el-sub-menu>

          <!-- 报表管理 -->
          <el-sub-menu index="4">
            <template #title>
              <el-icon><PieChart /></el-icon>
              <span>报表管理</span>
            </template>
            <el-menu-item index="/report/sales">销售报表</el-menu-item>
            <el-menu-item index="/report/performance">业绩报表</el-menu-item>
          </el-sub-menu>

          <!-- 系统管理 -->
          <el-sub-menu index="5">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/system/config">系统配置</el-menu-item>
            <el-menu-item index="/system/log">系统日志</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container class="main-container">
        <!-- 顶部导航栏 -->
        <el-header class="header">
          <div class="header-left">
            <el-icon class="collapse-btn" @click="toggleSidebar">
              <fold v-if="!isCollapse" />
              <expand v-else />
            </el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentRoute }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown trigger="click">
              <span class="user-info">
                <img src="../assets/avatar.svg" class="avatar" />
                <span>管理员</span>
                <el-icon><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>修改密码</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 内容区域 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  UserFilled,
  ShoppingCart,
  Setting,
  Fold,
  Expand,
  ArrowDown,
  Odometer,
  Avatar,
  PieChart,
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const activeMenu = computed(() => {
  return route.path
})

const currentRoute = computed(() => {
  return route.meta.title || '仪表盘'
})

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      ElMessage.success('已退出登录')
      router.push('/login')
    })
    .catch(() => {})
}
</script>

<style scoped>
.admin-layout {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.layout-container {
  height: 100%;
  width: 100%;
}

.aside {
  height: 100%;
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
  overflow-y: auto;
}

.main-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background-color: #2b3649;
  overflow: hidden;
}

.logo {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.title {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
}

.el-menu-vertical {
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
}

.header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f0f2f5;
  padding: 20px;
  height: calc(100% - 60px); /* 减去header高度 */
}
</style>
