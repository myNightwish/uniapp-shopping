<template>
	<view class="questionnaire-container">
		<nav-tabs :tabs="tabs" v-model="activeTab"></nav-tabs>
			<button class="share-btn" open-type="share">
				添加好友
				<view class="service-icon">
					<uni-icons type="paperplane" size="35" color="#030a27"></uni-icons>
				</view>
			</button>
		<view v-if="activeTab === tabs[0]" class="completed-container">
			<view class="questionnaire-ul" v-for="questionnaire in completed" :key="questionnaire.id">
				<view class="questionnaire-li">
					<!-- todo： 分享按钮 -->
					<common-card
					  first-btn-text="分享啦"
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
				<view class="questionnaire-li">222
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
import { onShareAppMessage } from "@dcloudio/uni-app";
const meStore = useAuthStore();
const activeTab = ref("已填");
const tabs = ["已填", "未填"];

const completed = ref([]);
const noCompleted = ref([]);

onMounted(() => {
	questionnaireApi.getQuestionnaireList().then((res) => {
		// 已完成问卷:status === 1
		res.forEach((item) => {
			console.log('res--', item)
			if (item.status === 1) {
				completed.value.push(item.template);
			} else {
				noCompleted.value.push(item.template);
			}
		});
	});
});

function write(questionnaireId) {
	const userId = meStore.user?.id;
	console.log('userId---', meStore.user)
	uni.navigateTo({
		url: `/pages/questionnaire/write?questionnaireId=${questionnaireId}&ownerId=${userId}&shareId=${userId}`,
	});
}

function look(questionnaireId) {
	console.log('sj--')
	const userId = meStore.user?.id;
	console.log('userId---', meStore.user, `/pages/questionnaire/look?questionnaireId=${questionnaireId}&ownerId=${userId}&shareId=${userId}`)
	
	uni.navigateTo({
		url: `/pages/questionnaire/look?questionnaireId=${questionnaireId}&ownerId=${userId}&shareId=${userId}`,
	});
}

onShareAppMessage((res) => {
		const userId = meStore.user?.id;
		console.log('func---', userId, res)
		return {
      title: '分享给朋友吧',
      path: `/pages/me/index?shareId=${userId}`,
    };
});
</script>

<style lang="scss" scoped>
.no-data {
	padding-top: 60px;
}
</style>
