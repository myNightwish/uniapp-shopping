<template>
	<view class="questionnaire-container">
		<nav-tabs :tabs="tabs" v-model="activeTab"></nav-tabs>
		<view v-if="activeTab === tabs[0]" class="completed-container">
			<view class="questionnaire-ul" v-for="questionnaire in completed" :key="questionnaire.id">
				<view class="questionnaire-li">
					<common-card
					  first-btn-text="查看"
						second-btn-type="share"
						:second-btn-data="questionnaire.id"
						:title="questionnaire.title"
						:description="questionnaire.description"
						@first-btn-click="look(questionnaire.id)"
					></common-card>
				</view>
			</view>
			<view v-if="!completed.length" class="no-data">
				<empty info="暂无问卷"></empty>
			</view>
		</view>
		<view v-if="activeTab === tabs[1]" class="no-completed-container">
			<view class="questionnaire-ul" v-for="questionnaire in noCompleted" :key="questionnaire.id">
				<view class="questionnaire-li">
					<common-card
						first-btn-text="填写"
						:title="questionnaire.title"
						:description="questionnaire.description"
						:second-btn="false"
						@first-btn-click="write(questionnaire.id)"
					>
					</common-card>
				</view>
			</view>
			<view v-if="!noCompleted.length" class="no-data">
				<empty info="暂无问卷"></empty>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import NavTabs from "@/components/common/navTabs.vue";
import CommonCard from "@/components/common/commonCard.vue";
import empty from "@/components/common/empty.vue";
import { useAuthStore } from "@/stores/auth.js";
import {questionnaireApi} from "@/api/questionnaire";
const meStore = useAuthStore();
const activeTab = ref("已填");
const tabs = ["已填", "未填"];

const totalQuestionnaire = ref([]);

onMounted(() => {
	getQuestionnaire().then(_ => {
		if(totalQuestionnaire.value.length === 0) {
			uni.showToast({
      title: '正在为您初始化数据....',
      icon: "none",
      duration: 2000,
    });
			initQuestionnaireList()
		}
	});
});
function initQuestionnaireList() {
	return questionnaireApi.initQuestionnaire()
	.then(_ => {
		getQuestionnaire();
	})
}
function getQuestionnaire() {
	return questionnaireApi.getQuestionnaireList().then((res) => {
		totalQuestionnaire.value = res;
	});
}
// 计算 completed 和 noCompleted
const completed = computed(() => {
	return totalQuestionnaire.value.filter(item => item.status === 1).map(item => item.template);
});

const noCompleted = computed(() => {
	return totalQuestionnaire.value.filter(item => item.status === 0).map(item => item.template);
});
function write(questionnaireId) {
	const userId = meStore.user?.id;
	console.log('userId---', meStore.user)
	uni.navigateTo({
		url: `/pages/questionnaire/write?questionnaireId=${questionnaireId}&ownerId=${userId}&shareId=${userId}`,
	});
}

function look(questionnaireId) {
	const userId = meStore.user?.id;
	uni.navigateTo({
		url: `/pages/questionnaire/look?questionnaireId=${questionnaireId}&ownerId=${userId}&shareId=${userId}`,
	});
}

</script>

<style lang="scss" scoped>
.no-data {
	padding-top: 60px;
}
</style>
