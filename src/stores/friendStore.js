import { defineStore } from "pinia";
import {getFriendsList} from "@/api/friends";

export const useFriendStore = defineStore("friendStore", {
  state: () => ({
    friendsQuestionnaire: [],
    rankData: []
  }),
  actions: {
    // 初始化好友列表
    async fetchFriendsQuestionnaire() {
      try {
        const res = await getFriendsList();
        this.friendsQuestionnaire = res;
      } catch (error) {
        console.error("Failed to fetch friend list:", error);
      }
    },
     // 拉取问卷列表
     async fetchQuestionnaireList() {
      const mockData = [
        { questionnaireId: 1, questionnaireTitle: "问卷1" },
        { questionnaireId: 2, questionnaireTitle: "问卷2" },
      ]; // 假设 API 返回的数据
      this.questionnaireList = mockData.map((item) => ({
        value: item.questionnaireId,
        text: item.questionnaireTitle,
      }));
    },

    // 计算排行榜数据
    calculateRankData(questionnaireId) {
      // 筛选当前问卷的相关数据
      const relevantData = this.friendsQuestionnaire.filter((item) =>
        item.questionnaireScores.some(
          (score) => score.questionnaireId === questionnaireId
        )
      );
      // 计算总分，并生成排行榜数据
      const rankedData = relevantData.map((item) => {
        const questionnaire = item.questionnaireScores.find(
          (score) => score.questionnaireId === +questionnaireId
        );

        const totalScore = questionnaire.scores.reduce(
          (sum, score) => sum + parseFloat(score.score || 0),
          0
        );


        return {
          id: item.friendId,
          nickName: item.nickName,
          avatarUrl: item.avatarUrl,
          totalScore,
        };
      });
      // 按总分降序排列
      this.rankData[questionnaireId] = rankedData.sort(
        (a, b) => b.totalScore - a.totalScore
      );
    },
  },
});
