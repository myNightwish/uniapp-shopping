<template>
  <view class="milestones-section">
    <view class="section-title">
      <text class="title">成长里程碑</text>
      <text class="subtitle">记录你们的重要时刻</text>
    </view>

    <view class="milestone-timeline">
      <view 
        v-for="milestone in milestones"
        :key="milestone.id"
        class="milestone-item"
      >
        <view class="time-point" />
        <view class="content">
          <view class="header">
            <text class="date">{{formatDate(milestone.date)}}</text>
            <text class="type">{{milestone.type}}</text>
          </view>
          <text class="title">{{milestone.title}}</text>
          <text class="description">{{milestone.description}}</text>
          
          <!-- 成就徽章 -->
          <view class="achievement" v-if="milestone.achievement">
            <image :src="milestone.achievement.icon" mode="aspectFit" />
            <view class="achievement-info">
              <text class="name">{{milestone.achievement.name}}</text>
              <text class="desc">{{milestone.achievement.description}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import dayjs from 'dayjs';
import {getGrowthMilestones} from '@/api/growth.js'
export default {
  data() {
    return {
      milestones: []
    };
  },
  methods: {
    async loadMilestones() {
      try {
        const result = await getGrowthMilestones();
        if (result.data.success) {
          this.milestones = result.data.data;
        }
      } catch (error) {
        console.error('加载里程碑失败:', error);
      }
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD');
    }
  },
  mounted() {
    this.loadMilestones();
  }
};
</script>

<style lang="scss">
.milestones-section {
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

  .milestone-timeline {
    position: relative;
    padding-left: 40rpx;

    &::before {
      content: '';
      position: absolute;
      left: 10rpx;
      top: 0;
      bottom: 0;
      width: 2rpx;
      background: #e0e0e0;
    }

    .milestone-item {
      position: relative;
      margin-bottom: 60rpx;

      .time-point {
        position: absolute;
        left: -40rpx;
        top: 0;
        width: 20rpx;
        height: 20rpx;
        background: #91CB74;
        border: 4rpx solid #fff;
        border-radius: 50%;
      }

      .content {
        background: #fff;
        border-radius: 12rpx;
        padding: 20rpx;
        box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.1);

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15rpx;

          .date {
            font-size: 24rpx;
            color: #999;
          }

          .type {
            font-size: 24rpx;
            color: #91CB74;
            background: #f0f9eb;
            padding: 4rpx 12rpx;
            border-radius: 20rpx;
          }
        }

        .title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 10rpx;
          display: block;
        }

        .description {
          font-size: 28rpx;
          color: #666;
          line-height: 1.6;
          margin-bottom: 20rpx;
        }

        .achievement {
          display: flex;
          align-items: center;
          background: #f8f8f8;
          border-radius: 12rpx;
          padding: 15rpx;

          image {
            width: 80rpx;
            height: 80rpx;
            margin-right: 20rpx;
          }

          .achievement-info {
            flex: 1;

            .name {
              font-size: 28rpx;
              font-weight: bold;
              color: #333;
              display: block;
            }

            .desc {
              font-size: 24rpx;
              color: #666;
              margin-top: 5rpx;
            }
          }
        }
      }
    }
  }
}
</style>