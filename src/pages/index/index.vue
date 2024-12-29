<template>
	<view class="index-container">
		<!-- 首页banner -->
		<view class="banner-container">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
				<swiper-item v-for="(banner, index) in banners" :key="index">
					<image style="width: 100vw" mode="widthFix" :src="banner"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 首页身份信息 -->
		<view class="user-container">
			<view class="user-left">
				<view class="avatar">
					<image
						style="height: 50px; width: 50px; border-radius: 50%"
						:src="meStore.user.avatarUrl || userDefaultData.avatarUrl"
					></image>
				</view>
				<view class="info">
					<view class="nick-name">{{ meStore.user?.nickName || userDefaultData.nickName }}</view>
				</view>
			</view>
			<view class="user-right">
				<template v-if="hasBindedPartner">
					<text>已绑定Ta:</text>
					<view class="avatar">
						<image
							style="height: 50px; width: 50px; border-radius: 50%"
							:src="partnerInfos.avatarUrl || userDefaultData.avatarUrl"
						></image>
					</view>
					<view class="info">
						<view class="nick-name">{{ partnerInfos.nickName || userDefaultData.nickName }}</view>
					</view>
				</template>
				<button
					v-else
					class="share-btn"
					open-type="share"
				>去绑定Ta
				</button>
			</view>
		</view>
		<!-- 首页金刚位 -->
		<view class="common-container">
			<view v-for="(item, index) in homeIconsList" :key="index" class="common-item">
				<view class="common-icon" @click="toJump(item.path, item.isTab)">
					<image style="height: 45px; width: 45px" :src="item.icon"></image>
				</view>
				<view class="common-title">{{ item.name }}</view>
			</view>
		</view>
		<!-- 弹窗 -->
    <view v-if="isPopupVisible" class="popup">
      <text>您即将与用户 {{ partnerId }} 绑定为伴侣，是否确认？</text>
      <view class="popup-actions">
        <button @click="handleBindingConfirm">确认</button>
        <button @click="handleBindingCancel">取消</button>
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
		<loginBtn></loginBtn>
	</view>
</template>

<script setup>
import { ref, computed, onMounted} from "vue";
import { userDefaultData, banners, homeIconsList } from "@/const";
import OneRowCard from "@/components/common/oneRowCard.vue";
import empty from "@/components/common/empty.vue";
import { onPullDownRefresh, onShow, onUnload, onLoad, onShareAppMessage } from "@dcloudio/uni-app";
import { getNews, setNews } from "@/utils/news";
import UniIcons from '@/common/uni-icons/uni-icons.vue';
import { useAuthStore } from "@/stores/auth.js";
import loginBtn from "./loginBtn.vue";
import { bindRelationship } from "@/api/relationship";

const meStore = useAuthStore();
const mockNewsData = [
	{
		id: "1",
		content: "消息 1",
	},
	{
		id: "2",
		content: "消息 2",
	},
];
onShareAppMessage(() => {
	const user = meStore.user?.openid;
	return {
		title: "一起被绑定吧",
		path: `/pages/index/index?partnerId=${user}`,
	};
});
const news = ref(getNews() || mockNewsData); // 消息数据
const newsPopup = ref();
const curNewsId = ref("");
const curNewsContent = ref("");
// 数据与状态
const partnerId = ref(null); // 保存 URL 中的 partnerId
const isPopupVisible = ref(false); // 控制弹窗显示
const partnerInfos = computed(() => {
	return meStore.user.partnerInfo || {}
})
// 标记是否已绑定伴侣
const hasBindedPartner = computed(() => {
	return !!meStore.user.partnerInfo?.openid;
});
onShow(() => {
	// todo： 消息订阅：拉取消息接口
	news.value = mockNewsData;
});

// 保存消息到本地
onUnload(() => {
	setNews(news.value);
});
// 页面加载时处理 URL 参数
onLoad((options) => {
  if (options.partnerId && !hasBindedPartner) {
    partnerId.value = options.partnerId; // 保存 partnerId
    showBindingPopup(); // 弹出绑定提示
  }
});

// 弹窗交互
const showBindingPopup = () => {
  isPopupVisible.value = true;
};

const handleBindingConfirm = async () => {
  try {
		const res = await bindRelationship({
			partnerId: partnerId.value,
		})

    if (res.success) {
      uni.showToast({ title: '绑定成功！', icon: 'success' });
    } else {
      uni.showToast({ title: res.message, icon: 'none' });
    }
		meStore.getUserInfo();
  } catch (error) {
    console.error('绑定失败:', error);
    uni.showToast({ title: '绑定失败，请重试', icon: 'none' });
  } finally {
    isPopupVisible.value = false;
  }
};

const handleBindingCancel = () => {
  isPopupVisible.value = false;
  uni.showToast({ title: '您取消了绑定操作', icon: 'none' });
};
// 下拉刷新替换
onPullDownRefresh(() => {
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
	// todo： 消息删除后，需要进行更新
	news.value.splice(deleteItem, 1);
	newsPopup.value.close();
}

// 页面跳转
function toJump(url, isTab) {
	setTimeout(() => {
		if(isTab) {
			uni.switchTab({ url})
		} else {
			uni.navigateTo({ url })
		}
	}, 500);
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: 18px;
		width: 120px;
		font-size: 15px;
		.share-btn {
			padding-left: 0;
			padding-right: 0;
			height: 56px;
			line-height: 56px;
			width: 100px;
			background-color: #fff;
			border: 2px solid #0256ff;
			color: #0256ff;
			font-weight: 600;
		}

		.share-btn::after {
			border: none;
		}

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
	justify-content: space-between;
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
.popup {
  position: fixed;
  top: 30%;
  left: 10%;
  width: 80%;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.popup-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.share-btn {
  background-color: #007aff; /* 激活态背景色 */
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
.partner-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
