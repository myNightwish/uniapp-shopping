import { request } from '@/utils/request';

export const chatApi = {
  // 发起对话
  startChat(question) {
    return request({
      url: '/api/chat/start',
      method: 'POST',
      data: { question }
    });
  },

  // 查询对话结果
  queryResult(conversationId) {
    return request({
      url: `/api/chat/query/${conversationId}`,
      method: 'GET'
    });
  },

  // 获取历史记录
  getHistory(page = 1, pageSize = 10) {
    return request({
      url: '/api/chat/history',
      method: 'GET',
      data: { page, pageSize }
    });
  }
};