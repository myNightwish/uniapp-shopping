<template>
	<view class="radar-container">
		<view class="charts-box">
			<qiun-data-charts type="radar" :opts="radarOptions" :chartData="radarData" />
		</view>
		<view class="friend-select">
			<view class="head">
				<view class="text">请选择好友(最多两位)</view>
				<view class="action">
					<button
						class="see-btn"
						@click="see"
					>
						查看
					</button>
				</view>
			</view>
			<view class="friend-list-container">
				<checkbox-group @change="checkboxChange">
					<label class="friend-list" v-for="friend in friendList" :key="friend.friendId">
						<view class="info">
							<image
								style="height: 80%; border-radius: 50%"
								mode="heightFix"
								:src="friend.avatarUrl || userDefaultData.avatarUrl"
							></image>
							<view class="nick-name">{{ friend.nickName }}</view>
						</view>
						<view>
							<checkbox :value="friend.friendId" :disabled="friend.disabled" />
						</view>
					</label>
				</checkbox-group>
			</view>
			<view v-if="!friendList.length" class="no-data">
				<empty info="暂无好友为你填写该问卷"></empty>
			</view>
		</view>
		<view class="analysis-box">
			<TypeWriter 
				:text="analysisResult.content" 
				class="type-writer-wrapper"
			/>
		</view>
	</view>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import qiunDataCharts from "@/components/thirdUse/qiun-data-charts/qiun-data-charts.vue";
import empty from "@/components/common/empty.vue";
import { userDefaultData } from "@/const";
import { omitLongString } from "@/utils/tools";
import {questionnaireApi} from "@/api/questionnaire";
import TypeWriter from '@/components/common/TypeWriter.vue';
import { useFriendStore } from "@/stores/friendStore";
import {radarOptions} from './radarConfig.js'
const props = defineProps({
	questionnaireId: {
		type: String,
		default: ''
	}
});
const radarData = ref({});
const analyzeId = ref(0);
const analysisResult = ref("");
const friendList = ref([]);
const curSelect = ref([]); // 当前选择的好友 ID
const friendStore = useFriendStore();

// 规范化一下可视化结果
watch(
	() => friendStore.friendsQuestionnaire,
	(newVal) => {
	friendList.value = newVal.map((item) => {
		const radarArr = item.questionnaireScores?.[0]?.scores.map(d => d.score);
			return {
				...item,
				radarArr,
				disabled: false,
			};
	});
});
watch(() => props.questionnaireId, 
	async (newQuestionnaireId, oldQuestionnaireId) => {
    // 如果 questionnaireId 发生变化，执行网络请求
		if (newQuestionnaireId === oldQuestionnaireId
			|| !newQuestionnaireId) {
			return;
		}
		questionnaireApi.analyzeQuestionnaire({
			questionnaireId: newQuestionnaireId
		}).then(res => {
			radarData.value = res.analysis.radarChart;
			analyzeId.value = +res.analysis.gptAnalysisId;
			questionnaireApi.getQuestionnaireAnalysis({
				analyzeId: +res.gptAnalysisId + 1,
				questionnaireId: newQuestionnaireId
			}).then(res => {
				analysisResult.value = res;
			})
		}).catch(() => {
			console.log('err');
		})
})

onMounted(() => {
	friendStore.fetchFriendsQuestionnaire();
});

function see() {
  // 遍历 curSelect，找到对应好友并构造 radar 数据
  curSelect.value.forEach((id, index) => {
    const friend = friendList.value.find((item) => item.friendId === +id);
    const nickName = omitLongString(friend?.nickName || "", 8);
    const friendObj = {
      name: nickName || "未选择",
      data: friend?.radarArr || [0, 0, 0, 0],
    };
    // 将结果推入 radarData.series 中
    radarData.value.series.push(friendObj);
  });
}

function checkboxChange(e) {
	if(!friendList.value.length) return;
	const select = e.detail.value || [];
	curSelect.value = select;
	// 实现最多复选两位好友
	if (select.length >= 2) {
		for (let i = 0; i < friendList.value.length; i++) {
			if (!select.includes(friendList.value[i].friendId)) {
				friendList.value[i].disabled = true;
			}
		}
	} else {
		for (let i = 0; i < friendList.value.length; i++) {
			friendList.value[i].disabled = false;
		}
	}
}
</script>

<style lang="scss" scoped>
.charts-box {
	background-color: #ffffff;
	width: 100vw;
	height: 300px;
}
.radar-container {
	.friend-select {
		.head {
			height: 40px;
			width: calc(100vw - 40px);
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 20px;
			background-color: #ffffff;
			border-top: 1px solid $theme-color-gray-lighter-1;
		}
		.text {
			height: 40px;
			line-height: 40px;
			font-size: 18px;
		}
	}

	.friend-list-container {
		width: calc(100vw - 40px);
		padding: 0 20px;
		background-color: #ffffff;
		.friend-list {
			height: 60px;
			background-color: #ffffff;
			border-top: 1px solid $theme-color-gray-lighter-1;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.info {
				height: 60px;
				width: 50vw;
				display: flex;
				align-items: center;

				.nick-name {
					margin-left: 10px;
				}
			}
		}
	}

	.no-data {
		padding-top: 60px;
	}
}
.see-btn {
	width: 80px;
	height: 40px;
	line-height: 34px;
	margin-left: 10px;
	background-color: #ffffff;
	border: 3px solid #0256ff;
	color: #0256ff;
}
</style>
