<template>
	<view class="show-container">
		<view class="questionnaire-select">
			<uni-data-select v-model="curValue" :localdata="range" @change="chooseQuestionnaire"></uni-data-select>
		</view>
		<view class="top-placeholder"></view>
		<view class="chart-container">
			<radar v-if="showType" :questionnaire-id="curValue"></radar>
			<view v-else class="no-data">
				<empty info="请先选择问卷"></empty>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, watch} from "vue";
import radar from "./components/radar.vue";
import empty from "@/components/common/empty.vue";
import { onShow } from "@dcloudio/uni-app";
import {questionnaireApi} from "@/api/questionnaire";

// 模拟的数据
const mockQuestionnaires = [
	{ id: "1", title: "问卷一", type: 0 },
	{ id: "2", title: "问卷二", type: 1 },
	{ id: "3", title: "问卷三", type: 0 }
];
const questionnaires = ref([]);
const range = ref([]);
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

watch(questionnaires, (newVal) => {
	showType.value = questionnaires.value.length ? 1 : -1;
});

onMounted(() => {
	// questionnaireApi.getFriendsList().then((res) => {
	// 	console.log('res---', res);
	// });
	questionnaireApi.getQuestionnaireList().then((res) => {
		questionnaires.value = res;
			range.value = res.map((item) => ({
				value: item.template.id,
				text: item.template.title
			})
		);
	});
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
</style>
