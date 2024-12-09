<template>
  <view :class="['message-item', message.type]" :id="'msg-' + message.id">
    <view class="avatar">
      <image :src="avatarSrc" mode="aspectFill" />
      <view :class="['status-dot', message.type === 'ai' && message.status === 'pending' ? 'thinking' : '']" />
    </view>
    <view class="message-content">
      <view class="name">{{ message.type === 'user' ? '你' : 'AI助手' }}</view>
      <view class="bubble">
        <template v-if="message.type === 'ai'">
          <view v-if="message.status === 'pending'" class="thinking-animation" >
              <view class="fox-mascot" :class="{ 'fox-thinking': isWaitingResponse }">
                <image src="/static/image/avatar/fox.webp" mode="aspectFit" />
                <view class="fox-eyes">
                  <view class="eye left" :class="{ 'blink': isBlinking }"></view>
                  <view class="eye right" :class="{ 'blink': isBlinking }"></view>
                </view>
              </view>
            <image src="/static/image/avatar/fox.webp" mode="aspectFit" />
              <view class="fox-eyes">
                <view class="eye left" :class="{ 'blink': isBlinking }"></view>
                <view class="eye right" :class="{ 'blink': isBlinking }"></view>
            </view>
          </view>
          <view v-else-if="message.status === 'failed'" class="error">
            {{ message.error || '回答生成失败' }}
          </view>
          <template v-else>
            <text v-if="message.isHistorical">{{ message.content }}</text>
            <TypeWriter 
              v-else 
              :text="message.content" 
              :key="message.id"
              class="type-writer-wrapper"
              @complete="$emit('typeComplete')"
            />
          </template>
        </template>
        <text v-else>{{ message.content }}</text>
      </view>
      <view class="time">{{ formatTime(message.timestamp) }}</view>
    </view>
  </view>
</template>

<script setup>
import { computed, watch } from 'vue';
import TypeWriter from './TypeWriter.vue';
import { formatTime } from '@/utils/time';

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
});
watch(() => props.message, (newVal) => {
  console.log('Message updated:', newVal);
}, { deep: true });

const avatarSrc = computed(() => {
  return props.message.type === 'user' 
    ? '/static/image/avatar/user-avatar.jpg'
    : '/static/image/avatar/ai-avatar.jpg';
});
</script>

<style lang="scss" scoped>
.message-item {
  display: flex;
  margin-bottom: 30rpx;
  padding: 0 20rpx;
  
  &.ai {
    flex-direction: row;
  }
  
  &.user {
    flex-direction: row-reverse;
    
    .message-content {
      align-items: flex-end;
      
      .bubble {
        background: linear-gradient(135deg, #007AFF, #00B4DB);
        color: #fff;
        border-radius: 20rpx 20rpx 0 20rpx;
      }
      
      .name {
        text-align: right;
      }
    }
  }
}

.avatar {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  margin: 0 20rpx;
  
  image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2rpx solid #fff;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  }
  
  .status-dot {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background: #52c41a;
    border: 2rpx solid #fff;
    
    &.thinking {
      background: #faad14;
      animation: pulse 1.5s infinite;
    }
  }
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 70%;
  
  .name {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 8rpx;
  }
  
  .bubble {
    padding: 20rpx;
    background: #fff;
    border-radius: 20rpx 20rpx 20rpx 0;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
    font-size: 28rpx;
    line-height: 1.5;
    
    .error {
      color: #ff4d4f;
    }
  }
  
  .time {
    font-size: 20rpx;
    color: #bbb;
    margin-top: 8rpx;
  }
}

.thinking-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  
  .dot {
    width: 8rpx;
    height: 8rpx;
    margin: 0 6rpx;
    background: #999;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
  .fox-mascot {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 120rpx;
  height: 120rpx;
  
  image {
    width: 100%;
    height: 100%;
  }
  
  .fox-eyes {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: space-between;
    width: 60%;
    
    .eye {
      width: 12rpx;
      height: 12rpx;
      background-color: #000;
      border-radius: 50%;
      transition: all 0.2s;
      
      &.blink {
        transform: scaleY(0.1);
      }
    }
  }
  
  &.fox-thinking {
    animation: bounce 0.6s infinite alternate;
  }
}
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

</style>