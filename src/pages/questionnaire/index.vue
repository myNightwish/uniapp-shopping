<template>
	<view class="questionnaire-container">
		<nav-tabs :tabs="tabs" v-model="activeTab"></nav-tabs>
		<view v-if="activeTab === tabs[0]" class="completed-container">
			<view class="questionnaire-ul" v-for="questionnaire in completed" :key="questionnaire.id">
				<view class="questionnaire-li">
					<!-- todo： 分享按钮 -->
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
import { ref, onMounted } from "vue";
import NavTabs from "@/components/common/navTabs.vue";
import CommonCard from "@/components/common/commonCard.vue";
import empty from "@/components/common/empty.vue";
import { useAuthStore } from "@/stores/auth.js";
import {questionnaireApi} from "@/api/questionnaire";
const meStore = useAuthStore();
const activeTab = ref("已填");
const tabs = ["已填", "未填"];

const completed = ref([]);
const noCompleted = ref([]);

onMounted(() => {
	questionnaireApi.getQuestionnaireList().then((res) => {
		// 已完成问卷:status === 1
		res.forEach((item) => {
			if (item.status === 1) {
				completed.value.push(item.questionnaire_template);
			} else {
				noCompleted.value.push(item.questionnaire_template);
			}
		});
	});
});

function write(questionnaireId) {
	const userId = meStore.user?.id;
	uni.navigateTo({
		url: `/pages/questionnaire/write?questionnaireId=${questionnaireId}&ownerId=${userId}&friendId=${userId}`,
	});
}

function look(questionnaireId) {
	console.log(`查看问卷 ID: ${questionnaireId}`);
	const userId = meStore.user?.id;
	// TODO 目前仅支持查看自己的，所以固定了friendId为自己，后续支持查看为朋友填写的
	uni.navigateTo({
		url: `/pages/questionnaire/look?questionnaireId=${questionnaireId}&ownerId=${userId}&friendId=${userId}`,
	});
}
</script>

<style lang="scss" scoped>
.no-data {
	padding-top: 60px;
}
</style>
