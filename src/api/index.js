import { useAuthStore } from '@/stores/auth';

// 创建一个请求方法封装
const request = (options) => {
  const token = uni.getStorageSync('token'); // 假设 token 存储在 localStorage
  // const baseURL = 'http://localhost:7001'; // 你的 API 基础 URL
  const baseURL = 'http://192.168.31.253:7001'; // 你的 API 基础 URL

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseURL}${options.url}`,
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
        } else if (res.statusCode === 401) {
          // 处理未授权逻辑
          const authStore = useAuthStore();
          authStore.logout();
          if (getCurrentPages().slice(-1)[0]?.route !== 'pages/login/index') {
            uni.navigateTo({ url: '/pages/login/index' });
          }
          reject(res);
        } else if (res.statusCode === 400) {
          // 处理 400 错误
          const msg = res.data?.message || '请求错误，请稍后再试';
          reject(res);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export default request;
