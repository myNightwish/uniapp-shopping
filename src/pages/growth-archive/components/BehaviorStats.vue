<template>
  <view class="behavior-stats">
    <view class="section-title">
      <text class="title">行为积分</text>
      <text class="subtitle">记录伴侣的点点进步</text>
    </view>

    <view class="stats-grid">
      <view class="stat-card total">
        <text class="value">{{stats.totalScore}}</text>
        <text class="label">总积分</text>
      </view>
      <view class="stat-card positive">
        <text class="value">{{stats.positiveCount}}</text>
        <text class="label">表扬次数</text>
      </view>
      <view class="stat-card rate">
        <text class="value">{{stats.positiveRate}}%</text>
        <text class="label">正向率</text>
      </view>
    </view>

    <!-- 最近行为记录 -->
    <view class="recent-records">
      <text class="section-label">最近记录</text>
      <view 
        v-for="record in recentRecords"
        :key="record.id"
        class="record-item"
        :class="record.type"
      >
        <view class="record-content">
          <text class="category">{{getCategoryName(record.category)}}</text>
          <text class="description">{{record.description}}</text>
          <text class="time">{{formatTime(record.created_at)}}</text>
        </view>
        <text class="points" :class="record.type">
          {{record.type === 'positive' ? '+' : ''}}{{record.points}}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import dayjs from 'dayjs';

export default {
  props: {
    stats: {
      type: Object,
      required: true
    },
    recentRecords: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getCategoryName(categoryId) {
      const categories = {
        care: '关心照顾',
        responsibility: '责任担当',
        communication: '沟通交流',
        growth: '共同成长',
        respect: '尊重理解'
      };
      return categories[categoryId] || categoryId;
    },
    formatTime(time) {
      return dayjs(time).format('MM-DD HH:mm');
    }
  }
};
</script>

<style lang="scss">
.behavior-stats {
  padding: 20rpx;

  .section-title {
    text-align: center;
    margin-bottom: 30rpx;

    .title {
      font-size: 32rpx;
      font-weight: bold;
      display: block;
    }

    .subtitle {
      font-size: 24rpx;
      color: #666;
      margin-top: 8rpx;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    margin-bottom: 30rpx;

    .stat-card {
      background: #fff;
      border-radius: 12rpx;
      padding: 20rpx;
      text-align: center;

      .value {
        font-size: 36rpx;
        font-weight: bold;
        display: block;
      }

      .label {
        font-size: 24rpx;
        color: #666;
        margin-top: 8rpx;
      }

      &.total .value {
        color: #91CB74;
      }

      &.positive .value {
        color: #FAC858;
      }

      &.rate .value {
        color: #EE6666;
      }
    }
  }

  .recent-records {
    .section-label {
      font-size: 28rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }

    .record-item {
      background: #fff;
      border-radius: 12rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &.positive {
        border-left: 6rpx solid #91CB74;
      }

      &.negative {
        border-left: 6rpx solid #EE6666;
      }

      .record-content {
        flex: 1;

        .category {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 8rpx;
          display: block;
        }

        .description {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 8rpx;
          display: block;
        }

        .time {
          font-size: 24rpx;
          color: #999;
        }
      }

      .points {
        font-size: 32rpx;
        font-weight: bold;

        &.positive {
          color: #91CB74;
        }

        &.negative {
          color: #EE6666;
        }
      }
    }
  }
}
</style>