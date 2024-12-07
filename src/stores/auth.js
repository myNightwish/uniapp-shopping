import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import { userApi } from '@/api/user.js';  // 引入封装的 API

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    inLogin: false,  // 是否正在登录
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    // 设置认证信息
     async loginAndAutoSignUp(code, userInfo) {
      try {
        this.inLogin = true;
        const data = await userApi.loginAndAutoSignUp({ code, userInfo });
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
    }
  }
});
