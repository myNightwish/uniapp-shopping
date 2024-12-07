import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import * as Pinia from 'pinia';
import UniIcons from '@/common/uni-icons/uni-icons.vue';
import { useAuthStore } from "@/stores/auth.js";
import {getExpireInPayload, getToken, setToken} from "@/utils/auth.js";

export function createApp() {
	const app = createSSRApp(App);
	app.use(Pinia.createPinia());
	app.use('uni-icons', UniIcons) // 全局注册
	return {
		app,
		Pinia, // 此处必须将 Pinia 返回
	};
}
let inRefresh = false; // 防止重复刷新token

uni.addInterceptor("request", {
  async invoke(request) {
    uni.showLoading({ title: "正在请求中..." });
		const authStore = useAuthStore();

    if (authStore.inLogin || inRefresh) return request; // 如果正在登录或者正在刷新token，则直接返回

    const timestamp = Math.ceil(+new Date().getTime() / 1000); // 获取当前时间戳

    // 1. 处理 accessToken
    const accessToken = getToken("accessToken"); // 获取accessToken
    const expInAccessToken = getExpireInPayload(accessToken); // 获取accessToken的过期时间
    if (timestamp < expInAccessToken) {
      request.header.Authorization = `Bearer ${accessToken}`; // 如果未过期，直接在请求头中携带accessToken
      return request;
    }

    // 2. 处理 refreshToken
    const refreshToken = getToken("refreshToken"); // 获取refreshToken
    const expInRefreshToken = getExpireInPayload(refreshToken); // 获取refreshToken的过期时间
    if (timestamp < expInRefreshToken) {
      // 如果refreshToken未过期，进行刷新操作
      inRefresh = true; // 设置刷新标志，避免递归调用
      try {
        const response = await refreshAccessToken(refreshToken); // 调用后端刷新Token的API
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        
        // 更新 token
        setToken("accessToken", newAccessToken);
        setToken("refreshToken", newRefreshToken);
        request.header.Authorization = `Bearer ${newAccessToken}`; // 使用新的 accessToken
      } catch (e) {
        console.error('Token refresh failed: ', e);
        redirectToLogin(); // 如果刷新失败，跳转到登录页
      } finally {
        inRefresh = false; // 刷新完毕，解除标志
      }
    } else {
      // refreshToken也过期了，需要重新登录
      redirectToLogin();
    }

    return request;
  },

  fail(err) {
    uni.showToast({
      title: `网络请求错误`,
      icon: "error",
      duration: 2000,
    });
  },

  complete() {
    uni.hideLoading(); // 请求完成后隐藏loading
  },
});

// 调用后端的刷新Token接口
async function refreshAccessToken(refreshToken) {
  const response = await uni.request({
    url: '/api/refresh-token',  // 后端刷新Token的API
    method: 'POST',
    data: { refreshToken },
  });
  return response[1]; // 返回response data
}

// 跳转到登录页面
function redirectToLogin() {
  uni.reLaunch({
    url: "/pages/me/index",  // 跳转到登录页面
    success: () => {
      uni.showToast({
        title: "登录凭证无效啦",
        icon: "error",
        duration: 2000,
      });
    },
  });
}
