<template>
  <view class="chat-container">
    <scroll-view 
      scroll-y="true" 
      :scroll-into-view="scrollToMessage" 
      :scroll-with-animation="true" 
      class="msg-container" 
      @scroll="onScroll"
    >
      <view 
        class="msg-list" 
        v-for="msg in chatMessages" 
        :key="msg.id" 
        :id="'msg-' + msg.id"
      >
        <MessageItem 
					:message="msg" 
				/>
      </view>
    </scroll-view>
    <view class="bottom-input">
      <view class="textarea-container">
        <textarea 
          v-model="inputMessage" 
          auto-height 
          confirm-type="send" 
          @focus="onInputFocus" 
          @blur="onInputBlur" 
          @confirm="sendMessage" 
        />
      </view>
      <button
        class="send-btn"
        :disabled="!canSend"
        @click="sendMessage"
      >
        发送
      </button>
    </view>
		<view v-if="showScrollBottom" @click="scrollToBottom" class="scroll-to-bottom">
			返回顶部
		</view>
    <uni-popup ref="tipPopup" type="dialog">
      <uni-popup-dialog
        type="info"
        title="提示"
        content="响应失败，请稍后重试！"
        confirmText="确定"
        @confirm="tipPopupClose"
      />
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { chatApi } from '@/api/chat';
import MessageItem from './components/MessageItem.vue';
import { debounce } from '@/utils/tools';

const inputMessage = ref('');
const chatMessages = ref([]);
const scrollToMessage = ref('');
const isWaitingResponse = ref(false);
const isLoadingHistory = ref(false);
const hasMore = ref(true);
const page = ref(1);
const tipPopup = ref(null);
const showScrollBottom = ref(false); // 控制是否显示“返回底部”按钮
const canSend = computed(() => inputMessage.value.trim() && !isWaitingResponse.value);

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
  await scrollToBottom();

  try {
    const { data } = await chatApi.startChat(question);
    aiMessage.conversationId = data.conversationId;
    await queryResult(aiMessage);
  } catch (error) {
    tipPopup.value.open();
		updateMessage(aiMessage.id, {
      status: 'failed',
      error: error.message || '发送失败'
    });
  } finally {
    isWaitingResponse.value = false;
  }
};

const queryResult = async (message) => {
  const maxRetries = 30;
  let retryCount = 0;

  const query = async () => {
    try {
      const { data } = await chatApi.queryResult(message.conversationId);
      if (data.status === 'completed') {
				updateMessage(message.id, {
          status: 'completed',
          content: data.answer
        });
        return;
				
      } else if (data.status === 'failed') {
				updateMessage(message.id, {
          status: 'failed',
          error: data.error || '生成失败'
        });
        return true;
      }

      if (retryCount < maxRetries) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 2000));
        return query();
      } else {
				updateMessage(message.id, {
          status: 'failed',
          error: '响应超时'
        });
      }
    } catch (error) {

			updateMessage(message.id, {
        status: 'failed',
        error: error.message || '查询失败'
      });
    }
  };

  await query();
};

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
      timestamp: new Date(item.timestamp)
    }));
    
    chatMessages.value.unshift(...formattedMessages);
    page.value++;
  } catch (error) {
    uni.showToast({ title: '加载历史消息失败', icon: 'none' });
  } finally {
    isLoadingHistory.value = false;
  }
};

const scrollToBottom = async () => {
  await nextTick();
  const lastMessage = chatMessages.value[chatMessages.value.length - 1];
  if (lastMessage) {
    scrollToMessage.value = 'msg-' + lastMessage.id;
  }
};

const onScroll = debounce((e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.detail;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    showScrollBottom.value = false;
  } else {
    showScrollBottom.value = true;
  }
}, 100);

const onInputFocus = () => scrollToBottom();
const onInputBlur = () => {};

// 加载历史记录
onMounted(() => loadHistory());

// 监听消息变化
watch(chatMessages, () => scrollToBottom(), { deep: true });

const updateMessage = (messageId, updates) => {
  const index = chatMessages.value.findIndex(msg => msg.id === messageId);
  if (index !== -1) {
    // 用 `Vue.set` 的形式触发响应式更新
    chatMessages.value[index] = { ...chatMessages.value[index], ...updates };
  }
};
</script>

<style lang="scss" scoped>
.chat-container {
	.msg-container {
		padding: 20px 5px 100px 5px;
		height: calc(100vh - 120px);
		scroll-view {
			height: 100%;
		}
	}
	.bottom-input {
		display: flex;
		align-items: flex-end;
		position: fixed;
		bottom: 0px;
		background-color: #fbfbfb;
		padding: 20px;
		box-shadow: 0px -10px 30px #eeeeee;
		.textarea-container {
			background-color: #ffffff;
			padding: 10px;
			textarea {
				width: calc(100vw - 146px);
				background-color: #ffffff;
			}
		}
	}
	.scroll-to-bottom {
		position: fixed;
    bottom: 60px;
		left: 0;
		bottom: 120px;
		width: 20px;
		height: 20px;
		font-size: 10px;
		background-color: #007bff;
		color: white;
		padding: 10px;
		border-radius: 50%;
		text-align: center;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	}
}
</style>
