<template>
	<view class="show-container">
		<view class="questionnaire-select">
			{{ curValue }}
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

const questionnaires = ref([]);
const range = ref([]);
const curValue = ref("");
const showType = ref(-1);

watch(questionnaires, (newVal) => {
	showType.value = questionnaires.value.length ? 1 : -1;
	range.value = questionnaires.value.map((item) => ({
		value: item.template.id,
		text: item.template.title
	}))
});

onMounted(() => {
	questionnaireApi.getFriendsList().then((res) => {
		console.log('res---', res);
	});

	questionnaireApi.getQuestionnaireList().then((res) => {
		questionnaires.value = res;
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
