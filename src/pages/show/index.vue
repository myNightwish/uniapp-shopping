<template>
	<view class="show-container">
		<view class="questionnaire-select">
			<uni-data-select v-model="curValue" :localdata="range" @change="chooseQuestionnaire"></uni-data-select>
		</view>
		<view class="top-placeholder"></view>
		<view class="chart-container">
			<view v-if="showType === -1" class="no-data">
				<empty info="请先选择问卷"></empty>
			</view>
			<radar v-if="showType === 0" :questionnaire-id="curValue"></radar>
		</view>
	</view>
</template>

<script setup>
import { ref, watch} from "vue";
import radar from "./components/radar.vue";
import empty from "@/components/common/empty.vue";
import { onShow } from "@dcloudio/uni-app";

// 模拟的数据
const mockQuestionnaires = [
	{ id: "1", title: "问卷一", type: 0 },
	{ id: "2", title: "问卷二", type: 1 },
	{ id: "3", title: "问卷三", type: 0 }
];

const questionnaires = ref(mockQuestionnaires);
const range = ref(
	mockQuestionnaires.map((item) => ({
		value: item.id,
		text: item.title
	}))
);

const curValue = ref("");
const showType = ref(-1);

// 去掉原来的 useQuery 请求，直接使用 mock 数据
// const { data, execute, error } = useQuery({ query: meGQL });
// watch(data, (newVal) => {
//     questionnaires.value = newVal?.me.questionnairesAsOwnerAsFriend.map((item: any) => item.questionnaire) || [];
//     range.value = questionnaires.value.map((item) => ({
//         value: item.id,
//         text: item.title,
//     }));
// });

// watch(error, (newVal) => {
//     uni.showToast({
//         title: `获取已填写问卷失败`,
//         icon: "error",
//         duration: 2000,
//     });
//     // throw new Error(`获取已填写问卷失败: ${newVal}`);
// });

onShow(() => {
	// 直接使用 mock 数据初始化
	showType.value = questionnaires.value.length ? 0 : -1;
});

function chooseQuestionnaire(e) {
	showType.value = questionnaires.value.find((item) => item.id == e)?.type ?? -1;
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
</style>
