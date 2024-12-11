import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import { userApi } from '@/api/user.js';  // 引入封装的 API

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      avatarUrl: "https://gd-hbimg.huaban.com/03029a471d8657ae8f82cd7770e3a82a4b064c5418b31d-LIlg9R_fw480webp",
      nickName: "Mock User",
      id: "12345678",
    },
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
    },
    setToken(token) {
      this.token = token;
      uni.setStorageSync('token', token);
    },
    setUserInfo(user) {
      this.user = user;
      uni.setStorageSync('user', user);
    },
    logout() {
      this.token = '';
      this.user = null;
      uni.removeStorageSync('token');
      uni.removeStorageSync('user');
    }
  }
});
