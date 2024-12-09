<template>
	<view class="radar-container">
		<view class="charts-box">
			<qiun-data-charts type="radar" :opts="opts" :chartData="chartData" />
		</view>
		<view class="friend-select">
			<view class="head">
				<view class="text">请选择好友(最多两位)</view>
				<view class="action">
					<button
						style="
							width: 80px;
							height: 40px;
							line-height: 34px;
							margin-left: 10px;
							background-color: #ffffff;
							border: 3px solid #0256ff;
							color: #0256ff;
						"
						@click="submit"
					>
						查看
					</button>
				</view>
			</view>
			<view class="friend-list-container">
				<checkbox-group @change="checkboxChange">
					<label class="friend-list" v-for="friend in friendList" :key="friend.id">
						<view class="info">
							<image
								style="height: 80%; border-radius: 50%"
								mode="heightFix"
								:src="friend.avatarUrl || userDefaultData.avatarUrl"
							></image>
							<view class="nick-name">{{ friend.nickName }}</view>
						</view>
						<view>
							<checkbox :value="friend.id" :disabled="friend.disabled" />
						</view>
					</label>
				</checkbox-group>
			</view>
			<view v-if="!friendList.length" class="no-data">
				<empty info="暂无好友为你填写该问卷"></empty>
			</view>
		</view>
	</view>
</template>

<script setup>
import { reactive, ref } from "vue";
import qiunDataCharts from "@/components/thirdUse/qiun-data-charts/qiun-data-charts.vue";
import { watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { onBeforeMount } from "vue";
import empty from "@/components/common/empty.vue";
import { userDefaultData } from "@/const";
import { omitLongString } from "@/utils/tools";

const props = defineProps();

const meStore = useAuthStore();

const chartData = reactive({
	categories: ["神经质", "外向型", "开放性", "宜人性", "尽责性"],
	series: [
		{
			name: "自己",
			data: [0, 0, 0, 0, 0],
		},
		{
			name: "未选择",
			data: [0, 0, 0, 0, 0],
		},
		{
			name: "未选择",
			data: [0, 0, 0, 0, 0],
		},
	],
});
const opts = {
	color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
	padding: [5, 5, 5, 5],
	dataLabel: false,
	enableScroll: false,
	legend: {
		show: true,
		position: "right",
		lineHeight: 25,
	},
	extra: {
		radar: {
			gridType: "radar",
			gridColor: "#CCCCCC",
			gridCount: 3,
			opacity: 0.2,
			max: 130,
			labelShow: true,
			border: true,
		},
	},
};

const sourceData = ref([]);
const friendList = ref([]);
const curSelect = ref([]); // friendId Array

// 区分朋友和自己，顺便规范化一下可视化结果
watch(sourceData, (newVal) => {
	newVal.forEach((item) => {
		if (item.friend.id !== meStore.user?.id) {
			friendList.value.push({
				...item.friend,
				visualization: Object.values(JSON.parse(item.visualization)),
				disabled: false,
			});
		} else {
			chartData.series[0].data = Object.values(JSON.parse(item.visualization));
			console.log("chartData: ", chartData);
		}
	});
});

onBeforeMount(() => {
	// 使用 mock 数据代替数据获取请求
	mockGetFriendListAsOwner();
});

// Mock 数据替代 API 请求
function mockGetFriendListAsOwner() {
	// todo：请求数据
	const mockData = [
		{
			friend: {
				id: "1",
				avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoNunyip9cyunWDmNIZyvdDz38ocdgHgC_pXNe31lArql_ORp4MXv7RcA&s",
				nickName: "EE",
			},
			visualization: '{"neuroticism": 60, "extraversion": 80, "openness": 75, "agreeableness": 70, "conscientiousness": 85}',
		},
		{
			friend: {
				id: "3",
				avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGWkIiW7S7wP_VamhtXl5qAshTxAuNtD4N8G3zYBMWMa2QHdClHugs9w&s",
				nickName: "萌萌",
			},
			visualization: '{"neuroticism": 50, "extraversion": 65, "openness": 60, "agreeableness": 55, "conscientiousness": 70}',
		},
	];
	sourceData.value = mockData;
	console.log("sourceData.value: ", sourceData.value);
}

function submit() {
	const friend1 = friendList.value.find((item) => item.id === curSelect.value[0]);
	chartData.series[1].data = friend1?.visualization || [0, 0, 0, 0, 0];
	const nickName1 = omitLongString(friend1?.nickName || "", 8);
	chartData.series[1].name = nickName1 || "未选择";
	const friend2 = friendList.value.find((item) => item.id === curSelect.value[1]);
	chartData.series[2].data = friend2?.visualization || [0, 0, 0, 0, 0];
	const nickName2 = omitLongString(friend2?.nickName || "", 8);
	chartData.series[2].name = nickName2 || "未选择";
	console.log("chartData.series: ", chartData.series);
}

function checkboxChange(e) {
	console.log("checkboxChange: ", e.detail.value);
	const select = e.detail.value;
	curSelect.value = select;
	// 实现最多复选两位好友
	if (select.length >= 2) {
		for (let i = 0; i < friendList.value.length; i++) {
			if (!select.includes(friendList.value[i].id)) {
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
</style>
