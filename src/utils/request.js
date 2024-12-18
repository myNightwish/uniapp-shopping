import { useAuthStore } from '@/stores/auth';

// 服务器基础地址
const BASE_URL = 'http://localhost:7001'; // 替换为你的实际API地址
const token = uni.getStorageSync('accessToken'); // 假设 token 存储在 localStorage
// 请求封装
export const request = (options) => {
  const userAuthStore = useAuthStore();

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        ...options.header,
      },
      timeout: 10000,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
          // if (res.data.success) {
          //   resolve(res.data);
          // } else {
          //   reject(new Error(res.data.error || '请求失败'));
          // }
        } else if (res.statusCode === 401) {
          // token失效，跳转登录
          userAuthStore.logout();
          uni.navigateTo({
            url: '/pages/me/index'
          });
          reject(new Error('请重新登录'));
        } else {
          reject(new Error(res.data.error || '服务器错误'));
        }
      },
      fail: (err) => {
        reject(new Error('网络错误'));
      }
    });
  });
};