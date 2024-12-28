<template>
  <view class="empty-container">
    <image :src="emptyUrl" mode="widthFix"></image>
    <view class="info">{{ props.info }}</view>
  </view>
</template>
<script setup>
import { emptyUrl } from "@/const";
const props = defineProps({
  info: {
    type: String,
    default: "哇，这里还没有内容哦~"
  }
});
</script>
<style lang="scss" scoped>
.empty-container {
  margin: auto;
  width: 120px;
  image {
    width: 100%;
  }
 .info {
    text-align: center;
    color: #dbdbdb;
  }
}
</style>