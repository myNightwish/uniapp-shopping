import { atob } from "@/utils/base64";
import { useAuthStore } from "@/stores/auth";
import {refreshAccessToken} from '@/api/user';

// 在auth.js中定义设置和获取token的方法
export function getToken(accessOrRefreshKey) {
  return uni.getStorageSync(accessOrRefreshKey);
}

export function setToken(accessOrRefreshKey, value) {
  return uni.setStorageSync(accessOrRefreshKey, value);
}

// 清除双token
export function removeToken() {
  uni.removeStorageSync("accessToken");
  uni.removeStorageSync("refreshToken");
}

// 获取过期时间，token需要符合JWT格式且有exp属性
export function getExpireInPayload(token) {
  if (!token) return -1; // 所有时间戳都会大于-1，即没有token也算过期，做相应的过期处理，如跳转登录
  const parts = token.split(".");
  const payload = JSON.parse(atob(parts[1]));
  return Number(payload.exp);
}

// 全局用户身份校验方法
export const checkUserAuth = async () => {
  const accessToken = getToken('accessToken');
  const refreshToken = getToken('refreshToken');
  const authStore = useAuthStore();

  if (!accessToken && !refreshToken) {
    // 无 Token，直接显示登录弹窗
    authStore.showLoginPopup();
    return;
  }

  try {
    // 优先使用 accessToken 获取用户信息
    authStore.getUserInfo();
    authStore.getUserInfo();
  } catch (error) {
    if (error.message.includes('401')) {
      // accessToken 失效，尝试刷新 Token
      if (refreshToken) {
        try {
          const newTokens = await refreshAccessToken(refreshToken);
          // 刷新成功，存储新 Token 并重新获取用户信息
          setToken('accessToken', newTokens.accessToken);
          setToken('refreshToken', newTokens.refreshToken);
          authStore.getUserInfo();
        } catch (refreshError) {
          // 刷新失败，清除 Token 并显示登录弹窗
          removeToken();
          authStore.showLoginPopup();
        }
      } else {
        // 无 refreshToken，直接显示登录弹窗
        removeToken();
        authStore.showLoginPopup();
      }
    } else {
      console.error('获取用户信息失败:', error);
    }
  }
};
