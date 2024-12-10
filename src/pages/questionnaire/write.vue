<template>
	<view class="write-container">
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
					<radio-group @change="radioChange">
						<label class="radio" v-for="(option, oIndex) in question.options" :key="option">
							<view>
								<radio
									color="#0256FF"
									:value="`${qIndex + 1}#${oIndex + 1}`"
									:checked="oIndex + 1 === result[qIndex + 1]"
								/>
							</view>
							<view>{{ option }}</view>
						</label>
					</radio-group>
				</view>
			</view>
		</view>
		<view v-show="questions.length" class="submit-container">
			<button class="submit-btn" @click="submit">提交</button>
		</view>
	</view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";

// Mock 数据
const mockQuestionnaire = {
	title: "模拟问卷标题",
	description: "这是一个模拟问卷描述",
	questions: [
		{
			id: 1,
			description: "你最喜欢的颜色是什么？",
			options: ["红色", "绿色", "蓝色", "黄色"],
		},
		{
			id: 2,
			description: "你通常每天睡几个小时？",
			options: ["少于5小时", "5-7小时", "7-9小时", "多于9小时"],
		},
	],
};

const params = reactive({
	questionnaireId: "",
	ownerId: "",
	friendId: "",
});
const questions = ref([]);
const questionnaire = reactive({
	title: "",
	description: "",
});

const result = ref([]);

onLoad(async (option) => {
	if (!option?.questionnaireId || !option?.ownerId) {
		uni.showToast({
			title: "页面参数有误",
			icon: "error",
			duration: 3000,
		});
		throw new Error(
			`页面参数有误，无法正常加载: questionnaireId: ${option?.questionnaireId}; ownerId: ${option?.ownerId}`
		);
	}
	params.questionnaireId = option?.questionnaireId;
	params.ownerId = option?.ownerId;
	params.friendId = option?.friendId || "mock-friend-id";
	await getMockQuestions();
});

async function getMockQuestions() {
	// 模拟获取问卷数据
	const data = mockQuestionnaire;

	questionnaire.title = data.title;
	questionnaire.description = data.description;
	questions.value = data.questions.map((item) => ({
		...item,
		options: item.options,
	}));
	console.log("Mock questions: ", questions.value);
}

function radioChange(e) {
	const [qIndex, oIndex] = e.detail.value.split("#");
	result.value[qIndex] = oIndex;
}

async function submit() {
	console.log("result: ", result.value);
	const len = questions.value.length;
	const resultObj = {};

	for (let i = 1; i < len + 1; i++) {
		const item = result.value[i];
		if (item === undefined) {
			uni.showToast({
				title: `NO.${i}题目未填写`,
				icon: "error",
				duration: 2000,
			});
			return;
		}
		resultObj[i] = item;
	}

	console.log("Mock submit result: ", JSON.stringify(resultObj));
	uni.showToast({
		title: "提交成功",
		icon: "success",
		duration: 2000,
	});
	uni.navigateBack({
		delta: 1,
	});
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