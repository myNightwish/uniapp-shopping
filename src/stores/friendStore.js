import { defineStore } from "pinia";
import {getFriendsList} from "@/api/friends";

export const useFriendStore = defineStore("friendStore", {
  state: () => ({
    friendsQuestionnaire: [],
  }),
  actions: {
    // 初始化好友列表
    async fetchFriendList() {
      try {
        const res = await getFriendsList();
        this.friendsQuestionnaire = res;
      } catch (error) {
        console.error("Failed to fetch friend list:", error);
      }
    },
  },
});
