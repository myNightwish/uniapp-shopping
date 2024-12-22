<template>
	<view class="show-container">
		<view class="questionnaire-select">
			<uni-data-select v-model="curQuestionnaireId" :localdata="range" @change="chooseQuestionnaire"></uni-data-select>
		</view>
		<view class="top-placeholder"></view>
		<view class="chart-container">
			<view v-if="showType" :questionnaire-id="curQuestionnaireId"></view>
			<view v-else class="no-data">
				<empty info="请先选择问卷"></empty>
			</view>
			<view v-if="curQuestionnaireId && !rankData[curQuestionnaireId]?.length" class="no-data">
				<empty info="暂无排行，请先分享或帮助好友填写问卷"></empty>
			</view>
			<view class="rank-list" v-for="(item, index) in rankData[curQuestionnaireId]" :key="item.id">
				<view class="rank-item">
					<view class="info">
						<view class="order">
							<view v-if="index === 0">
								<image :src="firstRank"></image>
							</view>
							<view v-else-if="index === 1">
								<image :src="secondRank"></image>
							</view>
							<view v-else-if="index === 2">
								<image :src="thirdRank"></image>
							</view>
							<view class="number" v-else> {{ index + 1 }} </view>
						</view>
						<view class="avatar">
							<image
								style="height: 50px; width: 50px; border-radius: 25px"
								:src="item.avatarUrl || userDefaultData.avatarUrl"
							></image>
						</view>
						<view class="nick-name">{{ item.nickName }}</view>
					</view>
					<view class="similarity">{{ item.totalScore }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, watch} from "vue";
import empty from "@/components/common/empty.vue";
import { userDefaultData, firstRank, secondRank, thirdRank } from "@/const";

import {questionnaireApi} from "@/api/questionnaire";
import { useFriendStore } from "@/stores/friendStore";

const friendStore = useFriendStore();
const questionnaires = ref([]);
const range = ref([]);
const curQuestionnaireId = ref(-1);
const showType = ref(-1);
const rankData = ref([]);

watch(questionnaires, () => {
	showType.value = questionnaires.value.length ? 1 : -1;
	range.value = questionnaires.value.map((item) => ({
		value: item.template.id,
		text: item.template.title
	}))
});

watch(curQuestionnaireId, () => {
	friendStore.calculateRankData(curQuestionnaireId.value);
	rankData.value = friendStore.rankData;
});
onMounted(async () => {
	questionnaireApi.getQuestionnaireList().then((res) => {
		questionnaires.value = res;
	});
	await friendStore.fetchFriendsQuestionnaire();
});
function chooseQuestionnaire(e) {
	const res = questionnaires.value.find((item) => +item.id === +e)?.status ?? -1;
	showType.value = res;
}
</script>

<style lang="scss" scoped>
.show-container {
	.no-data {
		padding-top: 80px;
	}
}

.questionnaire-select {
	position: fixed;
	top: -1px;
	width: 100vw;
	background-color: #ffffff;
	z-index: 1000;
}

.top-placeholder {
	height: 50px;
	width: 100vw;
}
.rank-list {
		.rank-item {
			height: 60px;
			width: calc(100vw - 40px);
			background-color: #ffffff;
			padding: 15px 20px;
			border-bottom: 1px solid $theme-color-gray-lighter-1;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.info {
				width: 220px;
				display: flex;
				justify-content: space-around;
				align-items: center;

				.order {
					height: 50px;
					width: 50px;
					.number {
						font-size: 24px;
						font-weight: 900;
						text-align: center;
						line-height: 50px;
					}
					image {
						height: 50px;
						width: 50px;
					}
				}
				.avatar {
					margin: 0 10px;
				}
				.nick-name {
					width: 100px;
					font-size: 16px;
					color: $theme-color-dark;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.similarity {
				font-size: 25px;
				font-weight: 900;
				color: $theme-color-light;
			}
		}
	}
</style>
