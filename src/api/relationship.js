import { request } from '@/utils/request';

// 绑定关系
export const bindRelationship = (data) => {
  return request({
    url: '/api/relationship/bind',
    method: 'POST',
    data
  });
}

/**
 * 查询当前用户是否绑定伴侣
 * @param {string} openid 用户 openid
 * @returns {Promise<object>} 接口返回结果
 */
export const getPartner = (openid) => {
  console.log('openid: ', openid)
  return request({
    url: '/api/relationship/partner',
    method: 'GET',
    params: { openid },
  });
};