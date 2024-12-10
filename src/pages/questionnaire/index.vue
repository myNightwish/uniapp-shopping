<template>
	<view class="questionnaire-container">
		<nav-tabs :tabs="tabs" v-model="activeTab"></nav-tabs>
		<view v-if="activeTab === tabs[0]" class="completed-container">
			<view class="questionnaire-ul" v-for="questionnaire in completed" :key="questionnaire.id">
				<view class="questionnaire-li">
					<common-card
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
import { ref, watchEffect, onMounted } from "vue";
import navTabs from "@/components/common/navTabs.vue";
import CommonCard from "@/components/common/commonCard.vue";
import empty from "@/components/common/empty.vue";

const activeTab = ref("已填");
const tabs = ["已填", "未填"];

const questionnaires = ref([]);
const completed = ref([]);
const noCompleted = ref([]);

// Mock 数据
const mockCompleted = [
	{ id: 1, title: "已完成问卷1", description: "这是已完成问卷1的描述" },
	{ id: 2, title: "已完成问卷2", description: "这是已完成问卷2的描述" },
];
const mockAllQuestionnaires = [
	{ id: 1, title: "问卷1", description: "这是问卷1的描述" },
	{ id: 2, title: "问卷2", description: "这是问卷2的描述" },
	{ id: 3, title: "问卷3", description: "这是问卷3的描述" },
];

onMounted(() => {
	// 使用 Mock 数据
	completed.value = mockCompleted;
	questionnaires.value = mockAllQuestionnaires;

	// 计算未完成问卷
	const idSet = new Set(mockCompleted.map((item) => item.id));
	noCompleted.value = mockAllQuestionnaires.filter((item) => !idSet.has(item.id));
});

function write(questionnaireId) {
	console.log(`填写问卷 ID: ${questionnaireId}`);
}

function look(questionnaireId) {
	console.log(`查看问卷 ID: ${questionnaireId}`);
}
</script>

<style lang="scss" scoped>
.no-data {
	padding-top: 60px;
}
</style>
