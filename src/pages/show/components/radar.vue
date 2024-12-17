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
						@click="submit"
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
				@complete="handleComplete"
			/>
		</view>
	</view>
</template>

<script setup>
import { reactive, ref, watch, onBeforeMount } from "vue";
import qiunDataCharts from "@/components/thirdUse/qiun-data-charts/qiun-data-charts.vue";
import { useAuthStore } from "@/stores/auth";
import empty from "@/components/common/empty.vue";
import { userDefaultData } from "@/const";
import { omitLongString } from "@/utils/tools";
import {questionnaireApi} from "@/api/questionnaire";
import TypeWriter from '@/components/common/TypeWriter.vue';

const props = defineProps({
	questionnaireId: {
		type: String,
		default: ''
	}
});
const radarData = ref({});
const meStore = useAuthStore();
const analyzeId = ref(0);
const analysisResult = ref("");
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

const radarOptions = {
	title: {
		text: '亲密关系雷达图',
		subtext: '伴侣关系对比',
		left: 'center'
	},
	tooltip: {
		trigger: 'axis'
	},
	legend: {
		show: true,
		position: "right",
		lineHeight: 25,
	},
	extra: {
		radar: {
			gridType: "radar",
			gridColor: "#CCCCCC",
			gridCount: 1,
			opacity: 0.2,
			max: 5,
			labelShow: true,
			border: true,
		},
	},
};

const sourceData = ref([]);
const friendList = ref([]);
const curSelect = ref([]); // shareId Array

// 规范化一下可视化结果
watch(sourceData, (newVal) => {
	newVal.forEach((item) => {
		const radarArr = item.questionnaireScores?.[0]?.scores.map(d => d.score);
		friendList.value.push({
				...item,
				radarArr,
				disabled: false,
			});
	});
});

onBeforeMount(() => {
	questionnaireApi.getFriendsList().then((res) => {
		sourceData.value = res;
	});
});

function submit() {
	const friend1 = friendList.value.find((item) => item.friendId === +curSelect.value[0]);
	const nickName1 = omitLongString(friend1?.nickName || "", 8);
	const frinedObj1 = {
		name: nickName1 || "未选择",
		data: friend1?.radarArr || [0, 0, 0, 0],
	};
	radarData.value.series.push(frinedObj1);

	const friend2 = friendList.value.find((item) => item.friendId === curSelect.value[1]);
	const nickName2 = omitLongString(friend2?.nickName || "", 8);
	const frinedObj2 = {
		name: nickName2 || "未选择",
		data: friend2?.radarArr || [0, 0, 0, 0],
	};
	radarData.value.series.push(frinedObj2);
}

function checkboxChange(e) {
	const select = e.detail.value;
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
function handleComplete() {
	console.log('9999--')
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
