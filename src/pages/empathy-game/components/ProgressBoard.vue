<template>
  <view class="progress-board">
    <view class="level-section">
      <text class="level">Level {{progress.level}}</text>
      <view class="exp-bar">
        <view 
          class="exp-progress"
          :style="{ width: `${expPercentage}%` }"
        />
      </view>
      <text class="exp-text">{{progress.experience}}/{{nextLevelExp}} EXP</text>
    </view>

    <view class="stats-section">
      <view class="stat-card">
        <text class="value">{{progress.completedTasks}}</text>
        <text class="label">已完成任务</text>
      </view>
      <view class="stat-card">
        <text class="value">{{progress.level}}</text>
        <text class="label">当前等级</text>
      </view>
      <view class="stat-card">
        <text class="value">{{totalExp}}</text>
        <text class="label">累计经验</text>
      </view>
    </view>

    <view class="recent-tasks">
      <text class="section-title">最近完成</text>
      <view 
        v-for="task in progress.recentTasks"
        :key="task.id"
        class="task-item"
      >
        <view class="task-info">
          <text class="title">{{task.task.title}}</text>
          <text class="time">{{formatTime(task.completed_at)}}</text>
        </view>
        <text class="exp">+{{task.task.exp_reward}} EXP</text>
      </view>
    </view>
  </view>
</template>

<script>
import dayjs from 'dayjs';
import {getEmpathyProgress} from '@/api/empathy.js'
export default {
  data() {
    return {
      progress: {
        level: 1,
        experience: 0,
        completedTasks: 0,
        recentTasks: []
      }
    };
  },
  computed: {
    nextLevelExp() {
      return Math.pow(this.progress.level * 100, 1.1);
    },
    expPercentage() {
      return (this.progress.experience / this.nextLevelExp) * 100;
    },
    totalExp() {
      return this.progress.experience + 
        Array.from({ length: this.progress.level - 1 })
          .reduce((sum, _, i) => sum + Math.pow((i + 1) * 100, 1.1), 0);
    }
  },
  methods: {
    async loadProgress() {
      try {
        // const result = await this.$http.get('/api/empathy/progress');
        const result = await getEmpathyProgress()
        if (result.data.success) {
          this.progress = result.data.data;
        }
      } catch (error) {
        console.error('加载进度失败:', error);
      }
    },
    formatTime(time) {
      return dayjs(time).format('MM-DD HH:mm');
    }
  },
  mounted() {
    this.loadProgress();
  }
};
</script>

<style lang="scss">
.progress-board {
  padding: 20rpx;

  .level-section {
    text-align: center;
    margin-bottom: 40rpx;

    .level {
      font-size: 48rpx;
      font-weight: bold;
      color: #91CB74;
      margin-bottom: 20rpx;
      display: block;
    }

    .exp-bar {
      width: 100%;
      height: 20rpx;
      background: #f0f0f0;
      border-radius: 10rpx;
      overflow: hidden;
      margin-bottom: 10rpx;

      .exp-progress {
        height: 100%;
        background: #91CB74;
        border-radius: 10rpx;
        transition: width 0.3s ease;
      }
    }

    .exp-text {
      font-size: 24rpx;
      color: #666;
    }
  }

  .stats-section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
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
        color: #333;
        display: block;
      }

      .label {
        font-size: 24rpx;
        color: #666;
        margin-top: 10rpx;
      }
    }
  }

  .recent-tasks {
    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }

    .task-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      border-radius: 12rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;

      .task-info {
        flex: 1;

        .title {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 10rpx;
          display: block;
        }

        .time {
          font-size: 24rpx;
          color: #999;
        }
      }

      .exp {
        font-size: 28rpx;
        color: #91CB74;
        font-weight: bold;
      }
    }
  }
}
</style>