<template>
  <view class="typewriter">
    <rich-text :nodes="parsedText"></rich-text>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue';
import MarkdownIt from 'markdown-it';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  speed: {
    type: Number,
    default: 50
  }
});

const emit = defineEmits(['complete']);
const displayText = ref('');
const parsedText = ref([]);
const markdown = new MarkdownIt();

const parseMarkdown = (text) => {
  const html = markdown.render(text);
  // 将 HTML 转换为适合 rich-text 的格式
  return html;
};

const typeText = async () => {
  displayText.value = '';
  const chars = props.text.split('');

  for (let char of chars) {
    displayText.value += char;
    parsedText.value = parseMarkdown(displayText.value); // 更新 Markdown 渲染
    await new Promise((resolve) => setTimeout(resolve, props.speed));
  }

  emit('complete');
};

watch(
  () => props.text,
  () => {
    typeText();
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.typewriter {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
