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
				<view class="description">{{ `${qIndex + 1}. ${question.text}` }}</view>
				<view class="options">
					<radio-group v-if="Array.isArray(question.options)" @change="radioChange">
						<label class="radio" v-for="(option, oIndex) in question.options" :key="option">
							<view>
								<radio
									color="#0256FF"
									:value="`${qIndex + 1}#${oIndex + 1}`"
									:checked="oIndex === answers[qIndex]"
								/>
							</view>
							<view>{{ option }}</view>
						</label>
					</radio-group>
					<!-- 否则显示文本输入框 -->
					<input 
						v-else 
						type="text" 
						@input="(e) => textInputChange(e, qIndex)"
						placeholder="请输入内容"
						class="text-input"
					/>
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
import { questionnaireApi } from "@/api/questionnaire";

const params = reactive({
	questionnaireId: "",
	ownerId: "",
	shareId: "",
});
const questions = ref([]);
const questionnaire = reactive({
	title: "",
	description: "",
});

const answers = ref([]);

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
	params.shareId = option?.shareId;
	await getQueryQuestions(params);
});

async function getQueryQuestions(params= {}) {
	questionnaireApi.queryQuestionnaire(params).then((data) => {
		questionnaire.title = data.title;
		questionnaire.description = data.description;
		questions.value = data.questions;
 });
}

function radioChange(e) {
	const [qIndex, oIndex] = e.detail.value.split("#");
	const answer = questions.value[qIndex - 1].options[oIndex - 1];
	answers.value[qIndex -1] = {
		questionId: questions.value[qIndex - 1].id,
		answer,
	};
}
function textInputChange(e, qIdx) {
	answers.value[qIdx] = {
		questionId: qIdx,
		answer: e.detail.value || ''
	};
}
async function submit() {
	console.log("result: ", answers.value);
	const len = questions.value.length;

	for (let i = 0; i < len; i++) {
		if (answers.value[i] === undefined) {
			uni.showToast({
				title: `NO.${i}题目未填写`,
				icon: "error",
				duration: 2000,
			});
			return;
		}
	}

	questionnaireApi.submitQuestionnaire({
		questionnaireId: +params.questionnaireId,
		answers: answers.value,
		shareId: +params.shareId || "",
	}).then(data => {
		uni.showToast({
			title: "提交成功",
			icon: "success",
			duration: 2000,
		});
		uni.navigateBack({
			delta: 1,
		});
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
.text-input {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 8px 10px;
	height: 56px;
	line-height: 56px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box; /* 确保 padding 不影响宽度 */
  transition: border-color 0.3s ease;
}

.text-input:focus {
  border-color: $theme-color-lighter-5; /* 聚焦时边框颜色 */
  outline: none;        /* 去除默认高亮 */
}
</style>