<template>
	<view class="nav-tabs-container">
		<view v-for="(tab, idx) in tabs" :key="idx">
			<view class="tabs-item"
			:class="{ 'tabs-item-active': activeTab === tab }"
			@click="clickTab(tab)">{{ tab }}</view>
		</view>
	</view>
	<view class="nav-placeholder"></view>
</template>
<script setup>
import { ref, defineEmits } from "vue";

const props = defineProps({
	tabs: {
		type: Array,
		default: () => [],
	},
	modelValue: {
		type: String,
		default: "",
	},
});
const emit = defineEmits(["update:modelValue"]);

const tabs = props.tabs;
const activeTab = ref(props.modelValue);

function clickTab(tab) {
	activeTab.value = tab;
	emit("update:modelValue", tab);
}
</script>
<style lang="scss" scoped>
.nav-tabs-container {
	width: 100vw;
	height: 60px;
	background-color: #ffffff;
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: fixed;
	top: -1px;
	z-index: 1000;

	.tabs-item {
		font-size: 18px;
		line-height: 60px;
	}
	.tabs-item-active {
		border-bottom: 4px solid $theme-color-light;
	}
}
.nav-placeholder {
	width: 100vw;
	height: 60px;
}
</style>
