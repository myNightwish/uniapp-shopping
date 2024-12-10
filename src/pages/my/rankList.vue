<template>
	<view class="rank-list-container">
		<view class="questionnaire-select">
			<uni-data-select v-model="curValue" :localdata="range" @change="chooseQuestionnaire"></uni-data-select>
		</view>
		<view class="top-placeholder"></view>
		<view v-show="!curQuestionnaireId" class="no-data">
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
				<view class="similarity">{{ (item.similarity / 100).toFixed(2) }}</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref, watch } from "vue";
// import { useQuery } from "villus";
// import { meGQL } from "@/graphql/questionnaire.graphql";
// import { listAsOwnerGQL, listAsFriendGQL } from "@/graphql/me.graphql";
import { userDefaultData, firstRank, secondRank, thirdRank } from "@/const";
import empty from "@/components/common/empty.vue";

const meOrOther = ref("me");

// Mock 数据
const mockQuestionnaires = {
  me: {
    questionnairesAsOwnerAsFriend: [
      { questionnaire: { id: "1", title: "问卷1" } },
      { questionnaire: { id: "2", title: "问卷2" } },
    ]
  }
};

const questionnaires = ref(mockQuestionnaires.me); // 直接使用 mock 数据
const range = ref([]);

// 模拟数据更新
watch(questionnaires, (newVal) => {
  range.value = newVal?.questionnairesAsOwnerAsFriend.map((item) => ({
    value: item.questionnaire.id,
    text: item.questionnaire.title,
  }));
});

// 处理错误的 mock 数据
const questionnairesError = ref(null);

watch(questionnairesError, (newVal) => {
  if (newVal) {
    uni.showToast({
      title: "获取问卷失败",
      icon: "error",
      duration: 2000,
    });
    throw new Error(`获取问卷失败: ${newVal}`);
  }
});

const curValue = ref("");
const curQuestionnaireId = ref("");

onLoad((option) => {
  meOrOther.value = option?.option;
});

const rankData = ref({});

// Mock 数据：排行榜
const mockRankData = {
  "1": [
    { id: "1", nickName: "用户A", avatarUrl: "urlA", similarity: 95 },
    { id: "2", nickName: "用户B", avatarUrl: "urlB", similarity: 90 },
  ],
  "2": [
    { id: "3", nickName: "用户C", avatarUrl: "urlC", similarity: 85 },
    { id: "4", nickName: "用户D", avatarUrl: "urlD", similarity: 80 },
  ]
};

// 选择问卷
async function chooseQuestionnaire(e) {
  curQuestionnaireId.value = e;
  if (meOrOther.value === "me") {
    await getListAsOwner(e);
  } else {
    await getListAsFriend(e);
  }
}

// 模拟获取数据
async function getListAsOwner(questionnaireId) {
  rankData.value[questionnaireId] = mockRankData[questionnaireId] || [];
}

async function getListAsFriend(questionnaireId) {
  rankData.value[questionnaireId] = mockRankData[questionnaireId] || [];
}
</script>

<style lang="scss" scoped>
.rank-list-container {
	.no-data {
		padding-top: 80px;
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
</style>
