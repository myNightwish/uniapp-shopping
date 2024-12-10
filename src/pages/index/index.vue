<template>
	<view class="index-container">
		<view class="banner-container">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
				<swiper-item>
					<image style="width: 100vw" mode="widthFix" :src="bannerUrl1"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="user-container">
			<view class="user-left">
				<view class="avatar">
					<image
						style="height: 60px; width: 60px; border-radius: 30px"
						:src="meStore.user?.avatarUrl || userDefaultData.avatarUrl"
					></image>
				</view>
				<view class="info">
					<view class="nick-name">{{ meStore.user?.nickName || userDefaultData.nickName }}</view>
					<view class="id">{{ meStore.user?.id || userDefaultData.id }}</view>
				</view>
			</view>
			<view class="user-right">
				<view class="questionnaire-container">
					<view class="questionnaire-count">
						{{ dataFriend?.me.countAsFriend ?? "--" }}
					</view>
					<view class="questionnaire-title">已填</view>
				</view>
				<view class="owner-container">
					<view class="owner-count">
						{{ dataOwner?.me.countAsOwner ?? "--" }}
					</view>
					<view class="owner-title">被填</view>
				</view>
			</view>
		</view>

		<view class="common-container">
			<view class="common-item">
				<view class="common-icon" @click="toQuestionnaire">
					<image style="height: 45px; width: 45px" :src="indexIcon1"></image>
				</view>
				<view class="common-title">查看问卷</view>
			</view>
			<view class="common-item">
				<view class="common-icon" @click="toRankListMe">
					<image style="height: 45px; width: 45px" :src="indexIcon2"></image>
				</view>
				<view class="common-title">关于自己</view>
			</view>
			<view class="common-item">
				<view class="common-icon" @click="toRankListOther">
					<image style="height: 45px; width: 45px" :src="indexIcon3"></image>
				</view>
				<view class="common-title">关于他人</view>
			</view>
			<view class="common-item">
				<view class="common-icon" @click="toQA">
					<image style="height: 45px; width: 45px" :src="indexIcon4"></image>
				</view>
				<view class="common-title">心理问答</view>
			</view>
		</view>

		<view class="news-title"> 消息中心 </view>
		<view class="news-container" v-for="item in news" :key="item.id">
			<one-row-card>
				<template #left>
					{{ item.content }}
				</template>
				<template #rightIcon>
					<uni-icons type="forward" size="30" color="#D3D3D3" @click="clickNewsCard(item)"></uni-icons>
				</template>
			</one-row-card>
		</view>
		<view v-if="!news.length" class="no-news">
			<empty></empty>
		</view>
		<uni-popup ref="newsPopup" type="dialog">
			<uni-popup-dialog
				type="info"
				title="消息详情"
				confirmText="已读"
				cancelText="关闭"
				:content="curNewsContent"
				:duration="2000"
				@close="closeNews"
				@confirm="confirmNews"
			></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref, watch} from "vue";
import { userDefaultData, bannerUrl1 } from "@/const";
import oneRowCard from "@/components/common/oneRowCard.vue";
import empty from "@/components/common/empty.vue";
import { onPullDownRefresh, onShow, onUnload } from "@dcloudio/uni-app";
import { indexIcon1, indexIcon2, indexIcon3, indexIcon4 } from "@/const";
import { getNews, setNews } from "@/utils/news";
import UniIcons from '@/common/uni-icons/uni-icons.vue';

const meStore = {
	user: {
		avatarUrl: "https://mock-avatar-url.com/avatar.png",
		nickName: "Mock User",
		id: "12345678",
	},
}; // Mock 用户数据

// Mock 数据
const dataFriend = {
	me: {
		countAsFriend: 10,
	},
};
const dataOwner = ref({
	me: {
		countAsOwner: 5,
	}
});
const mockNewsData = [
	{
		id: "1",
		content: "Mock 消息 1",
	},
	{
		id: "2",
		content: "Mock 消息 2",
	},
];

const news = ref(getNews() || mockNewsData); // 消息数据
const newsPopup = ref();
const curNewsId = ref("");
const curNewsContent = ref("");

// onShow 替换为模拟数据获取
onShow(() => {
	if (!meStore.user) {
		console.log("Mock: 获取用户数据");
	}
	console.log("Mock: 获取问卷数据");
	news.value = mockNewsData;
});

// 保存消息到本地
onUnload(() => {
	setNews(news.value);
});

// 下拉刷新替换
onPullDownRefresh(() => {
	console.log("Mock: 刷新数据");
	uni.stopPullDownRefresh();
});

// 点击消息卡片
function clickNewsCard(item) {
	curNewsId.value = item.id;
	curNewsContent.value = item.content;
	newsPopup.value.open();
}

function closeNews() {
	newsPopup.value.close();
}

function confirmNews() {
	const deleteItem = news.value.findIndex((item) => item.id === curNewsId.value);
	news.value.splice(deleteItem, 1);
	newsPopup.value.close();
}

// 页面跳转
function toQuestionnaire() {
	setTimeout(() => uni.switchTab({ url: "/pages/questionnaire/index" }), 500);
}
function toRankListMe() {
	setTimeout(() => uni.navigateTo({ url: "/pages/my/rankList?option=me" }), 500);
}
function toRankListOther() {
	setTimeout(() => uni.navigateTo({ url: "/pages/my/rankList?option=other" }), 500);
}
function toQA() {
	setTimeout(() => uni.navigateTo({ url: "/pages/index/chatGPT" }), 500);
}
</script>

<style lang="scss" scoped>
.banner-container {
	.swiper {
		width: 100vw;
		height: 254.246px;
	}
}
.user-container {
	height: 80px;
	width: calc(100vw - 20px);
	display: flex;
	padding: 10px;
	justify-content: space-between;
	align-items: center;
	.user-left {
		display: flex;
		justify-content: space-around;
		align-items: center;

		width: calc(100% - 120px);
		.info {
			margin-left: 10px;
			width: calc(100% - 70px);
			.nick-name {
				font-weight: 900;
				font-size: 18px;
				color: $theme-color-dark;
			}

			.id {
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-top: 5px;
				font-size: 12px;
				color: $theme-color-gray;
			}
		}
	}

	.user-right {
		width: 120px;
		font-size: 15px;
		display: flex;
		justify-content: space-around;
		align-items: baseline;
		.questionnaire-container {
			margin-right: 10px;
			.questionnaire-count {
				text-align: center;
			}
			.questionnaire-title {
				margin-top: 15px;
				text-align: center;
			}
		}
		.owner-container {
			width: 60px;
			height: 55px;
			border-left: 1px solid $theme-color-gray-lighter;
			.owner-count {
				text-align: center;
			}
			.owner-title {
				margin-top: 15px;
				text-align: center;
			}
		}
	}
}

.common-container {
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin-top: 10px;
	background-color: #ffffff;
	height: 120px;
	width: 90vw;
	border-radius: 25px;
	margin: auto;
	padding: 0 3vw;
	.common-icon {
		height: 45px;
		width: 45px;
		padding: 10px;
		background-color: $theme-color-background;
		border-radius: 15px;
		box-shadow: 5px 5px 20px #dddddd;
		transition: 0.3s;
	}
	.common-icon:active {
		height: 35px;
		width: 35px;
		padding: 15px;
		box-shadow: 5px 5px 20px #ffffff;
	}
	.common-title {
		margin-top: 5px;
		text-align: center;
		font-size: 14px;
		color: $theme-color-gray;
	}
}

.news-title {
	text-align: left;
	font-size: 18px;
	font-weight: 900;
	color: $theme-color-dark;
	width: 92vw;
	height: 16px;
	line-height: 16px;
	margin: auto;
	padding: 20px 0;
}

.no-news {
	padding: 50px 0;
}
</style>
