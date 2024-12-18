import { createSSRApp } from "vue";
import App from "./App.vue";
import * as Pinia from 'pinia';
import { useAuthStore } from "@/stores/auth.js";
import { getExpireInPayload, getToken, setToken } from "@/utils/auth.js";

export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  return {
    app,
    Pinia, // 返回 Pinia
  };
}
let isRefreshing = false; // 是否正在刷新Token
let refreshQueue = []; // 存放待刷新期间的请求队列

uni.addInterceptor("request", {
  async invoke(request) {
    uni.showLoading({ title: "正在请求中..." });
    const authStore = useAuthStore();

    if (authStore.inLogin) return request; // 正在登录中，直接返回请求

    const timestamp = Math.ceil(Date.now() / 1000);

    // 获取Tokens
    const accessToken = getToken("accessToken");
    const refreshToken = getToken("refreshToken");

    // 判断AccessToken是否过期
    const expInAccessToken = getExpireInPayload(accessToken);
    if (accessToken && timestamp < expInAccessToken) {
      request.header.Authorization = `Bearer ${accessToken}`;
      return request;
    }

    // 判断RefreshToken是否过期
    const expInRefreshToken = getExpireInPayload(refreshToken);
    if (refreshToken && timestamp < expInRefreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);
          // 更新 Token
          setToken("accessToken", newAccessToken);
          setToken("refreshToken", newRefreshToken);

          // 处理队列中所有等待的请求
          refreshQueue.forEach(({ resolve }) => resolve(newAccessToken));
          refreshQueue = [];
          request.header.Authorization = `Bearer ${newAccessToken}`;
        } catch (e) {
          refreshQueue.forEach(({ reject }) => reject(e));
          refreshQueue = [];
          redirectToLogin();
        } finally {
          isRefreshing = false;
        }
      }

      // 如果当前正在刷新，则将请求挂起等待
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            request.header.Authorization = `Bearer ${token}`;
            resolve(request);
          },
          reject: (error) => reject(error),
        });
      });
    }

    // 如果RefreshToken也过期，跳转到登录页
    redirectToLogin();
    throw new Error("Token过期，需要重新登录");
  },

  fail(err) {
    uni.showToast({
      title: `网络请求错误`,
      duration: 2000,
    });
  },

  complete() {
    uni.hideLoading(); // 请求完成后隐藏loading
  },
});

// 刷新AccessToken函数
async function refreshAccessToken(refreshToken) {
  const response = await uni.request({
    url: "/api/refresh-token", // 后端刷新Token的API
    method: "POST",
    data: { refreshToken },
  });

  if (response[1].statusCode === 200) {
    return response[1].data;
  } else {
    throw new Error("Token刷新失败");
  }
}

// 跳转到登录页面
function redirectToLogin() {
  uni.reLaunch({
    url: "/pages/me/index", // 跳转到登录页面
    success: () => {
      uni.showToast({
        title: "登录凭证无效啦",
        duration: 2000,
      });
    },
  });
}
