import { request } from '@/utils/request';

export const getOosConfig = async () => {
  // 发起对话
  const res = await request({
    url: '/api/oss/upload-params',
    method: 'GET'
  });
  return res.data;
};