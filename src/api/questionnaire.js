import request from '@/api/index.js';

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
  // 获取朋友列表
  async getFriendsList() {
    const response = await request({
      url: '/api/questionnaire/friends',
      method: 'GET',
    });
    return response.data;
  },
  async analyzeQuestionnaire(data = {}) {
    const response = await request({
      url: '/api/questionnaire/analyze',
      method: 'POST',
      data: { ...data },
    });
    return response.data;
  },
  async addFriends(data = {}) {
    const response = await request({
      url: '/api/questionnaire/addfriends',
      method: 'POST',
      data: { ...data },
    });
    return response;
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
