import { getToken, setToken, removeToken } from '@/utils/auth'; // 自定义 Token 管理工具
import {refreshAccessToken} from '@/api/user';
let isRefreshing = false; // 是否正在刷新 Token
let refreshQueue = []; // 等待刷新 Token 的请求队列
// 服务器基础地址
const BASE_URL = 'http://localhost:7001'; // 替换为你的实际API地址
// const BASE_URL = 'http://192.168.31.253:7001'; // 替换为你的实际API地址
// const BASE_URL = 'http://127.0.0.1:7001'; // 替换为你的实际API地址
// 创建请求实例
export const request = (options) => {
  return new Promise((resolve, reject) => {
    // 请求前拦截器
    options = beforeRequest(options);

    // 发起请求
    uni.request({
      ...options,
      url: BASE_URL + options.url, // 拼接完整接口地址
      success: (res) => {
        handleResponse(res, resolve, reject);
      },
      fail: (err) => {
        reject(err);
        uni.showToast({ title: '网络请求失败', icon: 'error' });
      },
    });
  });
};

// 请求前拦截器
const beforeRequest = (options) => {
  const accessToken = getToken('accessToken');
  const refreshToken = getToken('refreshToken');
  const isTokenValid = checkTokenValid(accessToken);

  if (accessToken && isTokenValid) {
    // 如果 accessToken 有效，设置 Authorization 头
    options.header = {
      ...options.header,
      Authorization: `Bearer ${accessToken}`,
    };
  } else if (refreshToken) {
    // 如果 accessToken 无效但 refreshToken 存在，挂起请求并尝试刷新
    if (!isRefreshing) {
      isRefreshing = true;
      refreshAccessToken(refreshToken)
        .then((newTokens) => {
          setToken('accessToken', newTokens.accessToken);
          setToken('refreshToken', newTokens.refreshToken);

          refreshQueue.forEach((callback) => callback.resolve(newTokens.accessToken));
          refreshQueue = [];
        })
        .catch(() => {
          removeToken();
          redirectToLogin('登录已过期，请重新登录');
          refreshQueue.forEach((callback) => callback.reject(new Error('Token失效')));
          refreshQueue = [];
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    // 将当前请求挂起，等待刷新完成后再发起
    return new Promise((resolve, reject) => {
      refreshQueue.push({
        resolve: (newAccessToken) => {
          options.header = {
            ...options.header,
            Authorization: `Bearer ${newAccessToken}`,
          };
          resolve(options);
        },
        reject: () => reject(new Error('Token刷新失败')),
      });
    });
  } else {
    redirectToLogin();
  }

  return options;
};

// 处理响应结果
const handleResponse = (res, resolve, reject) => {
  const { statusCode, data } = res;
  if (statusCode === 200) {
    resolve(data);
  } else if (statusCode === 401) {
    // 处理未授权（401）错误，通常表示 Token 无效或过期
    redirectToLogin('登录已过期，请重新登录');
    // reject(new Error(data.message || '未授权'));
  } else {
    reject(new Error(data.message || '请求失败'));
  }
};


// 检查 Token 是否有效
const checkTokenValid = (token) => {
  if (!token) return false;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp > Math.floor(Date.now() / 1000); // 检查是否过期
};

// 跳转到登录页面
const redirectToLogin = (message) => {
  removeToken();
  uni.reLaunch({
    url: '/pages/index/index',
    success: () => {
      uni.showToast({ title: message, duration: 2000 });
    },
  });
};

export default request;
