import { request } from '@/utils/request';

export const getBehaviorCategories = async() =>  {
  const response = await request({
    url: '/api/behavior/categories',
    method: 'GET',
  });
  return response.data;
}

export const postRecordBehavior = (data) => {
  return request({
    url: '/api/behavior/record',
    method: 'POST',
    data
  });
}