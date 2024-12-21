import { defineStore } from 'pinia';
import { userApi } from '@/api/user.js';  // 引入封装的 API

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
    isLoginPopupVisible: false,  // 是否显示登录弹窗
  }),
  actions: {
    // 设置认证信息
     async loginAndAutoSignUp(code) {
      try {
        const data = await userApi.loginAndAutoSignUp({ code });
        if (data && data.accessToken) {
          this.user = data.user;
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
    }, 
    // 显示登录弹窗
    showLoginPopup() {
      this.isLoginPopupVisible = true;
    },
    // 隐藏登录弹窗
    hideLoginPopup() {
      this.isLoginPopupVisible = false;
    }
  }
});
