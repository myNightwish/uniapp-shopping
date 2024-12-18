import { defineStore } from 'pinia';
import { userApi } from '@/api/user.js';  // 引入封装的 API

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
    inLogin: false,  // 是否正在登录
  }),
  actions: {
    // 设置认证信息
     async loginAndAutoSignUp(code) {
      try {
        this.inLogin = true;
        const data = await userApi.loginAndAutoSignUp({ code });
        if (data && data.accessToken) {
          this.user = data.user;
          this.inLogin = false;
          uni.setStorageSync('accessToken', data.accessToken);
          uni.setStorageSync('refreshToken', data.refreshToken);
          return data;
        } else {
          uni.showToast({
            title: `登录失败token`,
            icon: "error",
            duration: 2000,
          });
        }
      } catch (error) {
        this.inLogin = false;
        uni.showToast({
          title: `登录失败catch: ${error}`,
          icon: "error",
          duration: 2000,
        });
        throw error;
      }
    },
    getUserInfo() {
      return userApi.getCurUserInfo().then((res) => {
        this.user = res;
      }).catch(_ => {});
    },
    logout() {
      this.user = {};
      uni.removeStorageSync('token');
      uni.removeStorageSync('user');
    }
  }
});
