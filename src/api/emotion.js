import { request } from '@/utils/request';

// 记录情绪
export const postEmotionRecord = (question) => {
  return request({
    url: '/api/emotion/record',
    method: 'POST',
    data: { question }
  });
}

export const getEmotionTrend = () => {
  return request({
    url: '/api/emotion/trend',
    method: 'GET'
  });
}