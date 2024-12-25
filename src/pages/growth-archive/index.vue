<template>
  <view class="archive-page">
    <view class="header">
      <text class="title">成长档案</text>
      <text class="subtitle">记录你们的点点滴滴</text>
    </view>

    <!-- 关系数据概览 -->
    <view class="overview-section">
      <view class="stat-cards">
        <view class="stat-card" v-for="stat in stats" :key="stats.label">
          <text class="value">{{stat.value}}</text>
          <text class="label">{{stat.label}}</text>
        </view>
      </view>
    </view>

    <!-- 成长轨迹 -->
    <view class="timeline-section">
      <text class="section-title">成长轨迹</text>
      <view class="timeline">
        <view 
          v-for="event in timeline" 
          :key="event.id"
          class="timeline-item"
        >
          <view class="time-point" />
          <view class="content">
            <text class="date">{{event.date}}</text>
            <text class="title">{{event.title}}</text>
            <text class="desc">{{event.description}}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- AI成长建议 -->
    <view class="ai-suggestion">
      <view class="card">
        <view class="card-header">
          <image src="/static/ai-avatar.png" mode="aspectFit" />
          <text>成长建议</text>
        </view>
        <view class="suggestion-content">
          <text class="main-point">{{suggestion.mainPoint}}</text>
          <view 
            v-for="(point, index) in suggestion.details"
            :key="index"
            class="detail-point"
          >
            <text class="point-num">{{index + 1}}</text>
            <text class="point-text">{{point}}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 里程碑时间线 -->
    <milestones />
  </view>
</template>

<script>
import {getGrowthArchive} from '@/api/growth.js';
import Milestones from './components/Milestones.vue';

export default {
  components: {
    Milestones
  },
  data() {
    return {
      stats: [],
      timeline: [],
      suggestion: {
        mainPoint: '',
        details: []
      }
    };
  },
  methods: {
    async loadArchiveData() {
      try {
        const result = await getGrowthArchive();
        if (result.data.success) {
          this.timeline = result.data.data.timeline;
          this.suggestion = result.data.data.suggestion;
        }
      } catch (error) {
        console.error('加载档案失败:', error);
      }
    }
  },
  onShow() {
    this.loadArchiveData();
  }
};
</script>

<style lang="scss">
.archive-page {
  min-height: 100vh;
  background: #f8f8f8;
  padding: 20rpx;

  .header {
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

  .overview-section {
    margin-bottom: 40rpx;

    .stat-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;

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
  }

  .timeline-section {
    margin-bottom: 40rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 30rpx;
      display: block;
    }

    .timeline {
      position: relative;
      padding-left: 30rpx;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 2rpx;
        background: #e0e0e0;
      }

      .timeline-item {
        position: relative;
        padding-bottom: 40rpx;

        .time-point {
          position: absolute;
          left: -34rpx;
          top: 0;
          width: 16rpx;
          height: 16rpx;
          background: #91CB74;
          border: 4rpx solid #fff;
          border-radius: 50%;
        }

        .content {
          background: #fff;
          border-radius: 12rpx;
          padding: 20rpx;

          .date {
            font-size: 24rpx;
            color: #999;
            margin-bottom: 10rpx;
            display: block;
          }

          .title {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 10rpx;
            display: block;
          }

          .desc {
            font-size: 26rpx;
            color: #666;
            line-height: 1.6;
          }
        }
      }
    }
  }

  .ai-suggestion {
    .card {
      background: #fff;
      border-radius: 12rpx;
      padding: 20rpx;

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

      .suggestion-content {
        .main-point {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 20rpx;
          display: block;
        }

        .detail-point {
          display: flex;
          margin-bottom: 15rpx;

          .point-num {
            width: 40rpx;
            height: 40rpx;
            background: #f0f9eb;
            color: #91CB74;
            border-radius: 20rpx;
            text-align: center;
            line-height: 40rpx;
            font-size: 24rpx;
            margin-right: 15rpx;
          }

          .point-text {
            flex: 1;
            font-size: 26rpx;
            color: #666;
            line-height: 1.6;
          }
        }
      }
    }
  }
}
</style>