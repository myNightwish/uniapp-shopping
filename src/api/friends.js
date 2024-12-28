import { request } from '@/utils/request';

// 获取朋友列表
export const getFriendsList = async() =>  {
  const response = await request({
    url: '/api/questionnaire/friends',
    method: 'GET',
  });
  return response.data;
}
