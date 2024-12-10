<template>
	<chat :type="chatType.customerChat"></chat>
</template>
<script setup>
import chat from '@/components/chat/chat.vue';
import { chatType } from "@/const";
</script>
<style lang="scss" scoped></style>
