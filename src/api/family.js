import request from '@/api/index.js';

// 创建群组
export const createFamily = async (name) => {
  const response = await request({
    url: '/api/families/create',
    method: 'POST',
    data: { name },
  });
  return response;
};

// 解散群组
export const deleteFamily = async (familyId) => {
  const response = await request({
    url: `/api/families/${familyId}`,
    method: 'DELETE',
  });
  return response;
};

// 邀请加入群组
export const inviteFamily = async (familyId, email) => {
  const response = await request({
    url: `/api/families/${familyId}/invite`,
    method: 'POST',
    data: { email },
  });
  return response;
};

// 获取群组列表
export const getFamilies = async () => {
  const response = await request({
    url: '/api/families',
    method: 'GET',
  });
  return response;
};
