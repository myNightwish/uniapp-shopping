<template>
		<view class="me-container">
			<view class="top-card">
				<view class="user-info">
					<view class="info">
						<image
							class="avatar"
							style="height: 60px; width: 60px; border-radius: 50%"
							:src="userDefaultData.avatarUrl"
						></image>
						<view class="text-info">
							<view class="nick-name">{{ meStore.user?.nickname || userDefaultData.nickName }}</view>
						</view>
					</view>
					<view class="icon" @click="toUpdateUser">
						<uni-icons type="forward" size="30" color="#D3D3D3"></uni-icons>
					</view>
				</view>
				<view class="quick-entry">
					<view @click="toRankList('me')">
						<quick-entry-card>
							<template #title>关于自己</template>
							<template #icon>
								<uni-icons type="auth" size="40" color="#FFFFFF"></uni-icons>
							</template>
						</quick-entry-card>
					</view>
					<!-- <view @click="toRankList('other')">
						<quick-entry-card>
							<template #title>关于他人</template>
							<template #icon>
								<uni-icons type="staff" size="40" color="#FFFFFF"></uni-icons>
							</template>
						</quick-entry-card>
					</view> -->
				</view>
			</view>
			<view class="service-card">
				<view class="title">相关服务</view>
				<view class="service-ul">
					<view class="service-li">
						<view class="service-icon" @click="helpService">
							<uni-icons type="help" size="35" color="#030a27"></uni-icons>
						</view>
						<view class="service-title">帮助中心</view>
					</view>
					<view class="service-li">
						<view class="service-icon" @click="feedbackService">
							<uni-icons type="chat" size="35" color="#030a27"></uni-icons>
						</view>
						<view class="service-title">意见反馈</view>
					</view>
					<view class="service-li">
						<button class="share-btn" open-type="share">
							<view class="service-icon">
								<uni-icons type="paperplane" size="35" color="#030a27"></uni-icons>
							</view>
						</button>
						<view class="service-title">分享小程序</view>
					</view>
					<view class="service-li">
						<view class="service-icon" @click="customerChatService">
							<uni-icons type="headphones" size="35" color="#030a27"></uni-icons>
						</view>
						<view class="service-title">智能客服</view>
					</view>
				</view>
				<view class="service-ul">
					<view class="service-li">
						<view class="service-icon" @click="supportService">
							<uni-icons type="hand-up" size="35" color="#030a27"></uni-icons>
						</view>
						<view class="service-title">支持我们</view>
					</view>
					<view class="service-li">
						<view class="service-icon" @click="codeService">
							<uni-icons type="flag" size="35" color="#030a27"></uni-icons>
						</view>
						<view class="service-title">代码开源</view>
					</view>
					<view class="service-li">
						<view class="service-icon" @click="aboutService">
							<uni-icons type="info" size="35" color="#030a27"></uni-icons>
						</view>
						<view class="service-title">关于笑友</view>
					</view>
					<view class="service-li">
						<view class="service-icon" @click="moreService">
							<uni-icons type="more" size="35" color="#030a27"></uni-icons>
						</view>
						<view class="service-title">更多</view>
					</view>
				</view>
			</view>
			<uni-popup ref="infoPopup" type="dialog">
				<uni-popup-dialog
					type="info"
					content="链接已经复制到剪贴板，请打开浏览器进行下一步操作"
					:duration="3000"
					@close="closeInfo"
					@confirm="confirmInfo"
				></uni-popup-dialog>
			</uni-popup>
		</view>
		<loginBtn :isOpen="isOpen && !isLogin" @login="login" @cancel="cancelLogin"></loginBtn>
</template>

<script setup>
import { uniLogin, getUserProfile } from "@/api/uni.js";
import { reactive, ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import quickEntryCard from "@/components/common/quickEntryCard.vue";
import { getToken } from "@/utils/auth";
import { onShow, onLoad, onShareAppMessage } from "@dcloudio/uni-app";
import { logoUrl, feedbackUrl, sourceCodeUrl, userDefaultData } from "@/const";
import UniIcons from '@/common/uni-icons/uni-icons.vue';
import loginBtn from "./component/loginBtn.vue";

const meStore = useAuthStore();
const isLogin = ref(false);
const infoPopup = ref();
const isOpen = ref(true);
watch(
  () => [meStore.user, getToken("refreshToken")],
  ([user, refreshToken]) => {
    isLogin.value = user?.id && refreshToken !== "";
  },
  { immediate: true }  // 设置 immediate 为 true，初始化时也会执行一次
);

async function login() {
	const userInfo = await getUserProfile();
	meStore.$patch({ user: userInfo });
	console.log("get user info: ", userInfo);
	const { code } = await uniLogin("weixin");

	meStore.$patch({ inLogin: true });
	await meStore.loginAndAutoSignUp(code, userInfo);
	meStore.$patch({ inLogin: false });
	isLogin.value = meStore.user?.id && getToken("refreshToken") !== "";
	console.log("is login: ", isLogin.value);
	// todo； 成功后关闭
	isOpen.value = false;

}
const cancelLogin = () => {
	isOpen.value = false;
};

function toUpdateUser() {
	// uni.navigateTo({
	// 	url: "/pages/me/updateUser",
	// });
	console.log('暂时关闭～');
}

function toRankList(option) {
	console.log('暂时关闭～');
	// uni.navigateTo({
	// 	url: `/pages/rankList?type=${option}`,
	// });
}

function helpService() {
	console.log('暂时关闭～');
	// uni.navigateTo({
	// 	url: "/pages/me/help",
	// });
}

function feedbackService() {
	console.log('暂时关闭～');
	// uni.navigateTo({
	// 	url: feedbackUrl,
	// });
}

function customerChatService() {
	console.log('暂时关闭～');
	// uni.navigateTo({
	// 	url: "/pages/me/chat",
	// });
}


function supportService() {
	uni.navigateTo({
		url: "/pages/me/support",
	});
}

function codeService() {
	uni.navigateTo({
		url: sourceCodeUrl,
	});
}

function aboutService() {
	uni.navigateTo({
		url: "/pages/me/about",
	});
}

function moreService() {
	uni.navigateTo({
		url: "/pages/me/more",
	});
}

onShareAppMessage(() => {
	return {
		title: "笑友小程序",
		path: "/pages/lists/index",
	};
});
</script>

<style lang="scss" scoped>
.top-card {
	height: 300px;
	width: 100vw;
	overflow: hidden; 
	background: linear-gradient(to right, $theme-color-lighter-4, $theme-color-lighter-5);
	border-radius: 0 0 20px 20px;
	position: relative;
	top: 0;
	left: 0;
	z-index: 20;

	.user-info {
		height: 90px;
		width: calc(100% - 20px);
		margin-top: 25%;
		padding: 0 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.info {
			height: 100%;
			width: 80%;
			display: flex;
			align-items: center;
			.text-info {
				margin-left: 10px;
				width: calc(100% - 70px);

				.nick-name {
					font-weight: 900;
					font-size: 18px;
				}
				.id {
					margin-top: 5px;
					font-size: 12px;
					color: $theme-color-gray;
				}
			}
		}
		.icon {
			height: 30px;
			width: 30px;
		}
	}

	.quick-entry {
		padding: 0 1vw;
		margin-top: 10px;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
}

.service-card {
	background-color: #ffffff;
	width: calc(100vw - 40px);
	height: 270px;
	position: relative;
	top: -20px;
	z-index: 10; // 不能为负，为负其所有点击事件都不会生效
	padding: 40px 20px 20px 20px;
	.title {
		font-size: 18px;
	}
	.service-ul {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
		.service-li {
			.service-icon {
				height: 35px;
				width: 35px;
				line-height: 35px;
				padding: 15px;
				background-color: $theme-color-background;
				border-radius: 15px;
				z-index: 10;
			}
			.service-title {
				/* width: 70px; */
				margin-top: 5px;
				text-align: center;
				font-size: 14px;
				color: $theme-color-gray;
			}
			.share-btn {
				padding-left: 0;
				padding-right: 0;
				height: 65px;
				width: 65px;
				background-color: transparent;
				border-color: transparent;
			}

			.share-btn::after {
				border: none;
			}
		}
	}
}

.other-cards {
	position: relative;
	top: -20px;
}

.no-login {
	.logo {
		height: 40vh;
		width: 100vw;
		margin-top: 5vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.tips {
		width: 90vw;
		border-top: 1px solid $uni-text-color-disable;
		padding: 50px 20px;

		.tips-title {
			font-size: 24px;
			text-align: left;
			font-weight: 900;
		}
		.tips-content {
			margin-top: 16px;
			text-align: left;
			color: $theme-color-gray;
		}
	}
}
</style>
