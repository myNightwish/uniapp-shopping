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
          <view v-if="message.status === 'pending'" class="thinking-animation">
            <view class="eyes-container">
              <cute-eye :size="80" />
              <view class="kawaii-mouth"> </view>
              <cute-eye :size="80" />
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
import { computed } from 'vue';
import TypeWriter from '@/components/common/TypeWriter.vue';
import { formatTime } from '@/utils/time';
import CuteEye  from './CuteEye.vue';
import { useAuthStore } from "@/stores/auth";

const meStore = useAuthStore();
const props = defineProps({
  message: {
    type: Object,
    required: true
  }
});

const avatarSrc = computed(() => {
  return props.message.type === 'user' 
    ? meStore.user.avatarUrl || '/static/image/avatar/user-avatar.jpg'
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
    width: 65vw;
    padding: 20rpx;
    background: #fff;
    border-radius: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
    font-size: 28rpx;
    line-height: 1.5;
    
    .error {
      color: #ff4d4f;
    }
    .thinking-animation {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20rpx;
      animation: blink 1.4s infinite ease-in-out;
    }
    .eyes-container {
      display: flex;
    }
  }
  
  .time {
    font-size: 20rpx;
    color: #bbb;
    margin-top: 8rpx;
  }
}

@keyframes blink {
  0%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.4); }
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