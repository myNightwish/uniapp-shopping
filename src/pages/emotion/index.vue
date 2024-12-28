<template>
  <view class="emotion-page">
    <!-- 情绪卡片选择区 -->
    <view class="emotion-cards">
      <view 
        v-for="emotion in emotions" 
        :key="emotion.type"
        class="emotion-card"
        :class="{ active: selectedEmotion === emotion.type }"
        @tap="selectEmotion(emotion)"
      >
        <image :src="emotion.icon" mode="aspectFit" />
        <text>{{ emotion.label }}</text>
      </view>
    </view>

    <!-- 情绪强度滑块 -->
    <view class="intensity-slider">
      <text>情绪强度</text>
      <slider 
        :value="intensity" 
        :min="1" 
        :max="5" 
        :step="1"
        @change="onIntensityChange"
      />
      <text>{{ intensity }}</text>
    </view>

    <!-- 触发原因输入 -->
    <view class="trigger-input">
      <textarea 
        v-model="trigger"
        placeholder="是什么让你有这样的感受呢？"
        maxlength="200"
      />
    </view>

    <!-- 提交按钮 -->
    <button 
      class="submit-btn"
      :disabled="!canSubmit"
      @tap="submitEmotion"
    >
      记录今日心情
    </button>

    <!-- 情绪趋势图表 -->
    <view class="trend-chart" v-if="trendData">
      <qiun-data-charts 
        type="line"
        :opts="chartOpts"
        :chartData="trendData"
      />
    </view>

    <!-- AI建议卡片 -->
    <view class="ai-suggestion" v-if="suggestion">
      <view class="card">
        <view class="card-header">
          <image src="/static/ai-avatar.png" mode="aspectFit" />
          <text>AI小助手</text>
        </view>
        <view class="card-content">
          {{ suggestion }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {postEmotionRecord, getEmotionTrend} from '@/api/emotion.js';
import {emotions} from './emotion.js'
export default {
  data() {
    return {
      emotions,
      selectedEmotion: '',
      intensity: 3,
      trigger: '',
      trendData: null,
      suggestion: '',
      chartOpts: {
        color: ['#91CB74', '#FAC858', '#EE6666'],
        padding: [15, 10, 0, 15],
        enableScroll: true,
        legend: { show: true },
        xAxis: { 
          scrollShow: true,
          itemCount: 7,
        },
        yAxis: { 
          min: 1,
          max: 5,
        },
      },
    };
  },
  computed: {
    canSubmit() {
      console.log('9999-->', this.selectedEmotion)
      return this.selectedEmotion && this.trigger;
    },
  },
  methods: {
    selectEmotion(emotion) {
      this.selectedEmotion = emotion.type;
    },
    onIntensityChange(e) {
      this.intensity = e.detail.value;
    },
    async submitEmotion() {
      try {
        postEmotionRecord({
          type: this.selectedEmotion,
          intensity: this.intensity,
          trigger: this.trigger,
        }).then(result => {
          if (result.data.success) {
            this.trendData = this.formatTrendData(result.data.data.trend);
            this.suggestion = result.data.data.suggestion;
            this.showSuccess('记录成功');
            this.resetForm();
          }
        })
      } catch (error) {
        this.showError('记录失败');
      }
    },
    formatTrendData(trend) {
      const categories = trend.trend.map(item => 
        this.$dayjs(item.date).format('MM-DD')
      );
      
      const series = [{
        name: '情绪强度',
        data: trend.trend.map(item => item.intensity),
      }];

      return {
        categories,
        series,
      };
    },
    resetForm() {
      this.selectedEmotion = '';
      this.intensity = 3;
      this.trigger = '';
    },
    showSuccess(message) {
      uni.showToast({
        title: message,
        icon: 'success',
      });
    },
    showError(message) {
      uni.showToast({
        title: message,
        icon: 'error',
      });
    },
  },
  async onShow() {
    try {
      getEmotionTrend().then(result => {
          if (result.data.success) {
            this.trendData = this.formatTrendData(result.data.data);
          }
      })
    } catch (error) {
      console.error('获取趋势数据失败:', error);
    }
  },
};
</script>

<style lang="scss">
.emotion-page {
  padding: 20rpx;
  
  .emotion-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 30rpx;
    
    .emotion-card {
      width: 150rpx;
      height: 150rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f8f8f8;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      
      &.active {
        background: #e1f3d8;
        border: 2rpx solid #91CB74;
      }
      
      image {
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 10rpx;
      }
    }
  }
  
  .intensity-slider {
    margin: 30rpx 0;
    padding: 0 20rpx;
  }
  
  .trigger-input {
    margin-bottom: 30rpx;
    
    textarea {
      width: 100%;
      height: 200rpx;
      padding: 20rpx;
      background: #f8f8f8;
      border-radius: 12rpx;
    }
  }
  
  .submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #91CB74;
    color: #fff;
    border-radius: 44rpx;
    margin-bottom: 30rpx;
    
    &:disabled {
      background: #ccc;
    }
  }
  
  .trend-chart {
    margin-top: 30rpx;
    height: 500rpx;
  }
  
  .ai-suggestion {
    margin-top: 30rpx;
    
    .card {
      background: #fff;
      border-radius: 12rpx;
      padding: 20rpx;
      box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.1);
      
      .card-header {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        
        image {
          width: 60rpx;
          height: 60rpx;
          margin-right: 20rpx;
          border-radius: 30rpx;
        }
      }
      
      .card-content {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
      }
    }
  }
}
</style>