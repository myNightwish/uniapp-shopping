<template>
  <view class="analysis-section">
    <view class="section-title">
      <text class="title">冲突分析</text>
      <text class="subtitle">了解你们的冲突模式</text>
    </view>

    <!-- 冲突频率统计 -->
    <view class="stat-cards">
      <view class="stat-card" v-for="(count, type) in analysis.patterns.tagFrequency" :key="type">
        <text class="value">{{count}}次</text>
        <text class="label">{{type}}</text>
      </view>
    </view>

    <!-- 冲突模式分析 -->
    <view class="pattern-analysis">
      <text class="section-label">触发模式分析</text>
      <view class="patterns">
        <view 
          v-for="(count, trigger) in analysis.patterns.triggerPatterns" 
          :key="trigger"
          class="pattern-item"
        >
          <text class="trigger">{{trigger}}</text>
          <view class="frequency-bar">
            <view 
              class="bar" 
              :style="{ width: `${(count / maxTriggerCount) * 100}%` }"
            />
            <text class="count">{{count}}次</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 改进建议 -->
    <view class="improvements">
      <text class="section-label">改进建议</text>
      <view 
        v-for="item in analysis.improvements"
        :key="item.area"
        class="improvement-card"
      >
        <view class="card-header">
          <text class="area">{{item.area}}</text>
          <text class="frequency">出现{{item.frequency}}次</text>
        </view>
        <text class="suggestion">{{item.suggestion}}</text>
      </view>
    </view>
  </view>
</template>

<script>
import {getConflictAnalysis} from '@/api/conflict.js'
export default {
  data() {
    return {
      analysis: null,
    };
  },
  computed: {
    maxTriggerCount() {
      if (!this.analysis?.patterns?.triggerPatterns) return 0;
      return Math.max(...Object.values(this.analysis.patterns.triggerPatterns));
    }
  },
  methods: {
    async loadAnalysis() {
      try {
        const result = await getConflictAnalysis();
        if (result.data.success) {
          this.analysis = result.data.data;
        }
      } catch (error) {
        console.error('加载冲突分析失败:', error);
      }
    }
  },
  mounted() {
    this.loadAnalysis();
  }
};
</script>

<style lang="scss">
.analysis-section {
  padding: 20rpx;

  .section-title {
    text-align: center;
    margin-bottom: 40rpx;

    .title {
      font-size: 36rpx;
      font-weight: bold;
      display: block;
    }

    .subtitle {
      font-size: 28rpx;
      color: #666;
      margin-top: 10rpx;
    }
  }

  .stat-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    margin-bottom: 40rpx;

    .stat-card {
      background: #fff;
      border-radius: 12rpx;
      padding: 20rpx;
      text-align: center;

      .value {
        font-size: 36rpx;
        font-weight: bold;
        color: #91CB74;
        display: block;
      }

      .label {
        font-size: 24rpx;
        color: #666;
        margin-top: 10rpx;
      }
    }
  }

  .pattern-analysis {
    margin-bottom: 40rpx;

    .section-label {
      font-size: 28rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }

    .pattern-item {
      margin-bottom: 20rpx;

      .trigger {
        font-size: 26rpx;
        color: #333;
        margin-bottom: 10rpx;
        display: block;
      }

      .frequency-bar {
        height: 30rpx;
        background: #f5f5f5;
        border-radius: 15rpx;
        position: relative;
        overflow: hidden;

        .bar {
          height: 100%;
          background: #91CB74;
          border-radius: 15rpx;
          transition: width 0.3s ease;
        }

        .count {
          position: absolute;
          right: 10rpx;
          top: 50%;
          transform: translateY(-50%);
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }

  .improvements {
    .improvement-card {
      background: #fff;
      border-radius: 12rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15rpx;

        .area {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
        }

        .frequency {
          font-size: 24rpx;
          color: #999;
        }
      }

      .suggestion {
        font-size: 26rpx;
        color: #666;
        line-height: 1.6;
      }
    }
  }
}
</style>