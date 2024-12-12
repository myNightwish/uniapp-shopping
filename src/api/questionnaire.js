import request from '@/api/index.js';

export const questionnaireApi = {
  // 初始化
  async initQuestionnaire() {
    const response = await request({
      url: '/api/questionnaire/initialize',
      method: 'GET',
    });
    return response;
  },

  // 用户获取
  async getQuestionnaireList() {
    const response = await request({
      url: '/api/questionnaire/list',
      method: 'GET',
    });
    return response.data;
  },

  // 用户获取
  async queryQuestionnaire(params = {}) {
    // 构建查询字符串
    const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
    
    const url = `/api/questionnaire/detail${queryString ? `?${queryString}` : ''}`;
    const response = await request({
      url,
      method: 'GET'
    });
    return response.data;
  },

  // 用户提交
  async submitQuestionnaire({ questionnaireId, answers }) {
    const response = await request({
      url: '/api/questionnaire/submit',
      method: 'POST',
      data: { questionnaireId, answers },
    });
    return response;
  },
};
