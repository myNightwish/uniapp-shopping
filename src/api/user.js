import { request } from '@/utils/request';

export const userApi = {
  // 获取当前用户信息
  async getCurUserInfo() {
    const response = await request({
      url: '/api/user/info',
      method: 'GET',
    });
    return response;
  },

  // 用户登录
  async userLogin({ username, password }) {
    const response = await request({
      url: '/api/login',
      method: 'POST',
      data: { username, password },
    });
    return response;
  },

  // 用户注册
  async userRegister({ username, password }) {
    const response = await request({
      url: '/api/register',
      method: 'POST',
      data: { username, password },
    });
    return response;
  },

  async loginAndAutoSignUp({ code }) {
    const response = await request({
      url: '/api/loginAndAutoSignUp',
      method: 'POST',
      data: { code },
    });
    return response;
  }
};
export const updateUserInfo = async (data = {}) => {
  const response = await request({
    url: '/api/wxUser/update',
    method: 'POST',
    data: { ...data },
  });
  return response;
}
