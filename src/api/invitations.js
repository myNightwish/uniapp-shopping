import request from '@/api/index.js';

export const invitationsApi = {
  // 获取邀请列表
  async getInvitations() {
    const response = await request({
      url: '/api/invitations',
      method: 'GET',
    });
    return response;
  },

  // 修改邀请状态
  async changeInvitationsAction({ invitationId, action }) {
    await request({
      url: `/api/invitations/${invitationId}/${action}`,
      method: 'POST',
    });
  },
};
