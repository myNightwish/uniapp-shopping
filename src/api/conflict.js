import { request } from '@/utils/request';

// 发起对话
export const postConflictRecord = (data) => {
  return request({
    url: '/api/conflict/record',
    method: 'POST',
    data
  });
}
// todo：缺失
export const getConflictAnalysis = () => {
  return request({
    url: '/api/conflict/analysis',
    method: 'GET'
  });
}

