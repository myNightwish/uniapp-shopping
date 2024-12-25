import { request } from '@/utils/request';

export const getGrowthArchive = () => {
  return request({
    url: '/api/growth/archive',
    method: 'GET'
  });
}

// 获取成长里程碑
// todo： 缺失
export const getGrowthMilestones = () => {
  return request({
    url: '/api/growth/milestones',
    method: 'GET'
  });
}