<template>
		<view v-if="meStore.isLoginPopupVisible" class="login-overlay">
      <view class="login-container">
				<view class="login-button-container">
					<button @click.stop="login" class="login-button">一键登录/注册</button>
				</view>
				<view class="checkbox-container">
          <checkbox @click="toggleAgreement" :checked="isAgreed" class="checkbox"></checkbox>
          <label>已阅读并同意
            <!-- <text class="link">隐私政策</text>、 -->
            <text class="link">服务协议</text>
          </label>
        </view>
      </view>
    </view>
</template>

<script setup>
import { uniLogin } from "@/api/uni.js";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { onLoad } from "@dcloudio/uni-app";
import { checkUserAuth } from '@/utils/auth.js';
import { addFriends } from "@/api/user";

const meStore = useAuthStore();
const isAgreed = ref(false);

onLoad(() => {
	checkUserAuth(); // 检查用户身份并决定是否弹出登录框
});
const cancelLogin = () => {
	meStore.hideLoginPopup();
}
const toggleAgreement = () => {
	isAgreed.value = !isAgreed.value;
}
const login = async () => {
	if (!isAgreed.value) return;
	const { code } = await uniLogin("weixin");
	await meStore.loginAndAutoSignUp(code);
	meStore.hideLoginPopup();
	// todo: 弹窗邀请好友，最好是放在另一个地方
	// 获取存储的邀请信息
	const shareId = uni.getStorageSync('shareId');
	const userId = meStore?.user.id;
	if (shareId && userId) {
		bindFriend(shareId);
	}
}
const bindFriend = (shareId) =>{
	addFriends({ shareId }).then(res => {
		uni.showToast({
      title: res.message,
      icon: "none",
      duration: 2000,
    });
	}).finally(_ => {
		uni.removeStorageSync('shareId');
	})
}
</script>

<style lang="scss" scoped>
.login-button-container {
	padding-bottom: 32px;
	.login-button {
		color: #ffffff;
		background-color: $theme-color-lighter-2;
		height: 60px;
		width: 90vw;
		line-height: 60px;
		text-align: center;
		border-radius: 30px;
	}
}
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.login-container {
  background-color: #fff;
  width: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
  padding: 20px 0;
  border-radius: 18px 18px 0 0;
  text-align: center;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.checkbox {
  margin-right: 10px;
}

.link {
  color: $theme-color-lighter-2;
  text-decoration: underline;
  margin: 0 5px;
}
</style>
