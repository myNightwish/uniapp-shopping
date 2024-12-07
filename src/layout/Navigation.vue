<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <!-- 主页链接 -->
        <navigator url="/" class="logo">
          <image class="logo-icon" src="/static/shopping-bag.svg" />
          <span class="logo-text">FamilyList</span>
        </navigator>
        <nav class="nav">
          <navigator
            v-for="item in navItems"
            :key="item.path"
            :url="item.path"
            class="nav-item"
          >
            {{ item.name }}
          </navigator>
        </nav>
        <UserProfile @logout="quitLogin" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import UserProfile from '@/components/user/UserProfile.vue';

const auth = useAuthStore();

// 路由导航项
const navItems = [
  { name: 'Shopping Lists', path: '/pages/lists/index' },
  { name: 'Family Groups', path: '/pages/groups/index' },
  { name: 'Invitations', path: '/pages/invitations/index' }
];

// 用户退出登录
const quitLogin = () => {
  auth.logout();
  uni.navigateTo({
    url: '/pages/login/index'
  });
};
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* 淡白背景 */
  backdrop-filter: blur(10px); /* 背景模糊 */
  border-bottom: 1px solid #ddd;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
}

.nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-item {
  font-size: 14px;
  font-weight: 500;
  color: #4a4a4a;
  text-decoration: none;
}

.nav-item:hover {
  color: #2563eb;
}
</style>
