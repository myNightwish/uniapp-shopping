<template>
  <view class="chat-container">
    <!-- 顶部状态栏 -->
    <image class="background-image" src="/static/image/avatar/bg.webp" mode="aspectFill" />
    <!-- Chat Content -->
    <view class="chat-content">

    <!-- 聊天消息列表 -->
    <scroll-view 
      class="chat-list" 
      scroll-y="true" 
      :scroll-top="scrollTop"
      :scroll-into-view="scrollToMessage"
      :scroll-with-animation="true"
      @scrolltoupper="onLoadMore"
    >
      <view class="messages-wrapper">
        <view class="loading" v-if="isLoadingHistory">
          <view class="spinner" />
          加载历史消息...
        </view>
        <MessageItem
          v-for="(message, index) in chatMessages"
          :id="'msg-' + message.id"
          :key="message.id + '-' + message.status"
          :message="message"
          @type-complete="onTypeComplete"
        />
        <view class="scroll-bottom" v-show="showScrollBottom" @tap="scrollToBottom">
          <text class="iconfont icon-arrow-down" />
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area" :class="{ 'input-focus': isInputFocused }">
      <view class="input-wrapper">
        <textarea
          v-model="inputMessage"
          class="input-box"
          :disabled="isWaitingResponse"
          :focus="isInputFocused"
          placeholder="输入你的问题..."
          :maxlength="1000"
          :cursor-spacing="20"
          @focus="onInputFocus"
          @blur="onInputBlur"
          @confirm="sendMessage"
          auto-height
        />
          <text class="char-count" :class="{ 'near-limit': inputMessage.length > 900 }">
            {{ inputMessage.length }}/1000
          </text>
      </view>
      
      <button 
        class="send-btn" 
        :disabled="!canSend"
        :class="{ 'sending': isWaitingResponse }"
        @tap="sendMessage"
      >
        <text class="iconfont" :class="isWaitingResponse ? 'icon-loading' : 'icon-send'" />
      </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { chatApi } from '@/api/chat';
import MessageItem from './components/MessageItem.vue';
import { debounce } from '@/utils/tools';

// 状态管理
const inputMessage = ref('');
const chatMessages = ref([]);
const scrollTop = ref(0);
const scrollToMessage = ref('');
const isWaitingResponse = ref(false);
const isInputFocused = ref(false);
const isConnected = ref(true);
const showScrollBottom = ref(false);
const isLoadingHistory = ref(false);
const page = ref(1);
const hasMore = ref(true);

// 计算属性
const canSend = computed(() => {
  return inputMessage.value.trim() && !isWaitingResponse.value;
});

// 消息发送
const sendMessage = async () => {
  if (!canSend.value) return;

  const question = inputMessage.value.trim();
  inputMessage.value = '';
  isWaitingResponse.value = true;

  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: question,
    status: 'completed',
    timestamp: new Date()
  };
  
  const aiMessage = {
    id: Date.now() + 1,
    type: 'ai',
    content: '',
    status: 'pending',
    timestamp: new Date()
  };

  chatMessages.value.push(userMessage, aiMessage);
  scrollToBottom();

  try {
    const { data } = await chatApi.startChat(question);
    aiMessage.conversationId = data.conversationId;
    await queryResult(aiMessage);
  } catch (error) {
    aiMessage.status = 'failed';
    aiMessage.error = error.message || '发送失败';
  } finally {
    isWaitingResponse.value = false;
  }
};

// 查询结果
const queryResult = async (message) => {
  const maxRetries = 30;
  let retryCount = 0;

  const query = async () => {
    try {
      const { data } = await chatApi.queryResult(message.conversationId);
      if (data.status === 'completed') {
        message.status = 'completed';
        message.content = data.answer;
        scrollToBottom();
        return true;
      } else if (data.status === 'failed') {
        message.status = 'failed';
        message.error = data.error || '生成失败';
        return true;
      }
      
      if (retryCount < maxRetries) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 2000));
        return query();
      } else {
        message.status = 'failed';
        message.error = '响应超时';
        return true;
      }
    } catch (error) {
      message.status = 'failed';
      message.error = error.message || '查询失败';
      return true;
    }
  };

  return query();
};

// 加载历史消息
const loadHistory = async () => {
  if (!hasMore.value || isLoadingHistory.value) return;
  
  isLoadingHistory.value = true;
  try {
    const { data } = await chatApi.getHistory(page.value);
    if (data.items.length < 10) {
      hasMore.value = false;
    }
    
    const formattedMessages = data.items.map(item => ({
      id: item.id,
      type: item.type,
      content: item.content,
      status: 'completed',
      timestamp: new Date(item.timestamp),
      isHistorical: item.isHistorical
    }));
    
    chatMessages.value.unshift(...formattedMessages);
    page.value++;
  } catch (error) {
    uni.showToast({
      title: '加载历史消息失败',
      icon: 'none'
    });
  } finally {
    isLoadingHistory.value = false;
  }
};

// 滚动相关
// const scrollToBottom = debounce(() => {
//   nextTick(() => {
//     const lastMessage = chatMessages.value[chatMessages.value.length - 1];
//     console.log('lastMessage: ', lastMessage);
//     if (lastMessage && lastMessage.id) {
//       scrollToMessage.value = 'msg-' + lastMessage.id;
//     }
//   });
// }, 100);
const scrollToBottom = () => {
  nextTick(() => {
    const lastMessage = chatMessages.value[chatMessages.value.length - 1];
    if (lastMessage && lastMessage.id) {
      scrollToMessage.value = 'msg-' + lastMessage.id;
    }
  })
};

const onScroll = debounce((e) => {
  const { scrollTop: top, scrollHeight, height } = e.detail;
  showScrollBottom.value = top < scrollHeight - height - 100;
}, 100);

// 输入框事件
const onInputFocus = () => {
  isInputFocused.value = true;
  scrollToBottom();
};

const onInputBlur = () => {
  isInputFocused.value = false;
};

const onTypeComplete = () => {
  scrollToBottom();
};

// 清空聊天
const clearChat = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清空聊天记录吗？',
    success: (res) => {
      if (res.confirm) {
        chatMessages.value = [];
      }
    }
  });
};

// 生命周期
onMounted(() => {
  loadHistory();
});
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;  /* 使其填充整个视口高度 */
  overflow-y: auto;  /* 允许垂直滚动 */
  margin-bottom: 60rpx;  /* 给底部留些空间 */
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.chat-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}


.chat-list {
  flex: 1;
}

.input-area {
  display: flex;
  padding: 20rpx;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  
  .input-wrapper {
    flex: 1;
    margin-right: 20rpx;
    
    .input-box {
      width: 100%;
      min-height: 72rpx;
      padding: 10rpx 20rpx;
      font-size: 28rpx;
      line-height: 1.5;
      background-color: #fff;
      border-radius: 36rpx;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    }
  }
  
  .send-btn {
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #FF9D6C, #FF5E62);
    border-radius: 50%;
    box-shadow: 0 4rpx 10rpx rgba(255, 94, 98, 0.3);
    transition: all 0.3s;
    
    &:active {
      transform: scale(0.95);
    }
    
    &.sending {
      animation: pulse 1s infinite;
    }
    
    .iconfont {
      color: #fff;
      font-size: 36rpx;
    }
  }
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10rpx); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
</style>