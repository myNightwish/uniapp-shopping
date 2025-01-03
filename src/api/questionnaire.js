import { request } from '@/utils/request';

export const questionnaireApi = {
  // 初始化
  async initQuestionnaire() {
    const response = await request({
      url: '/api/questionnaire/init',
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

  // 用户查询
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
  async submitQuestionnaire(data = {}) {
    const response = await request({
      url: '/api/questionnaire/submit',
      method: 'POST',
      data: { ...data },
    });
    return response;
  },
  async analyzeQuestionnaire(data = {}) {
    const response = await request({
      url: '/api/questionnaire/analyze',
      method: 'POST',
      data: { ...data },
    });
    return response.data;
  },
  async getQuestionnaireAnalysis(params = {}) {
    // 构建查询字符串
    const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
      
    const paramsStr = `${queryString ? `?${queryString}` : ''}`;
    const response = await request({
      url: '/api/questionnaire/gptanalysis' + paramsStr,
      method: 'GET',
    });
    return response.data;
  },
};
