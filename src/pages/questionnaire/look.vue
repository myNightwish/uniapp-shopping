<template>
	<view class="look-container">
		<view class="top-card">
			<uni-collapse-item :title="questionnaire.title">
				<view class="content">
					<text class="text">{{ questionnaire.description }}</text>
				</view>
			</uni-collapse-item>
		</view>
		<view class="top-card-placeholder"></view>
		<view class="questions-container" v-for="(question, qIndex) in questions" :key="question.id">
			<view class="question-item">
				<view class="description">{{ `${qIndex + 1}. ${question.description}` }}</view>
				<view class="options">
					<radio-group>
						<label class="radio" v-for="(option, oIndex) in question.options" :key="option">
							<view>
								<radio
									color="#0256FF"
									:disabled="true"
									:value="`${qIndex + 1}#${oIndex + 1}`"
									:checked="oIndex + 1 == result[qIndex + 1]"
								/>
							</view>
							<view>{{ option }}</view>
						</label>
					</radio-group>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive, ref} from "vue";

// 页面参数
const params = reactive({
	questionnaireId: "",
	ownerId: "",
	friendId: "",
});

// 问题列表和问卷信息
const questions = ref([]);
const questionnaire = reactive({
	title: "",
	description: "",
});

// 回答结果
const result = ref({});

// Mock 数据
const mockQuestionnaire = {
	title: "用户满意度调查",
	description: "请填写以下问题，以帮助我们更好地改进服务。",
	questions: [
		{
			id: "q1",
			description: "您对我们的服务满意吗？",
			options: ["非常满意", "满意", "一般", "不满意"],
		},
		{
			id: "q2",
			description: "您会向朋友推荐我们的服务吗？",
			options: ["会", "可能会", "不会"],
		},
	],
};

const mockResult = {
	1: 1, // 表示第一题选择第一个选项
	2: 3, // 表示第二题选择第三个选项
};

onLoad((option) => {
	if (!option?.questionnaireId || !option?.ownerId || !option?.friendId) {
		uni.showToast({
			title: `页面参数有误`,
			icon: "error",
			duration: 3000,
		});
		throw new Error(
			`页面参数有误，无法正常加载: questionnaireId: ${option?.questionnaireId}; ownerId: ${option?.ownerId}; friendId: ${option?.friendId}`
		);
	}

	params.questionnaireId = option?.questionnaireId;
	params.ownerId = option?.ownerId;
	params.friendId = option?.friendId;

	// 使用 Mock 数据加载页面
	getMockData();
});

function getMockData() {
	// 模拟获取问卷和问题数据
	questionnaire.title = mockQuestionnaire.title;
	questionnaire.description = mockQuestionnaire.description;
	questions.value = mockQuestionnaire.questions.map((item) => ({
		...item,
		options: item.options,
	}));

	// 模拟获取用户回答数据
	result.value = mockResult;
	console.log("Mock questions: ", questions.value);
	console.log("Mock result: ", result.value);
}
</script>

<style lang="scss" scoped>
.top-card {
	background-color: #ffffff;
	width: 100vw;
	position: fixed;
	top: -1px;
	z-index: 1000;
	box-shadow: 0px 2px 15px #dcdcdc;
	overflow: hidden;
	.content {
		padding: 15px;
	}
	.text {
		font-size: 16px;
		color: #666;
		line-height: 20px;
	}
}
.top-card-placeholder {
	height: 70px;
}
.questions-container {
	width: calc(100% - 40px);
	padding: 0 20px;
	margin-top: 15px;
	background-color: #ffffff;
	overflow: hidden;

	.description {
		font-size: 17px;
		font-weight: 900;
		color: $theme-color-light;
		margin: 20px 0;
	}
	.radio {
		color: $theme-color-dark;
		display: flex;
		height: 50px;
		line-height: 50px;
		border-top: 1px solid $theme-color-gray-lighter-1;
	}
}
.submit-container {
	overflow: hidden;
	height: 150px;
	width: 100vw;
	.submit-btn {
		margin: 50px 20vw;
		color: #ffffff;
		background-color: $theme-color-lighter-2;
		height: 60px;
		width: 60vw;
		line-height: 60px;
		text-align: center;
		border-radius: 30px;
	}
}
</style>
