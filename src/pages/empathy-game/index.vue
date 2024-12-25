<template>
  <view class="game-page">
    <view class="game-header">
      <text class="title">今日共情任务</text>
      <text class="subtitle">完成任务可获得共情种子，培养你们的理解力</text>
    </view>
    <!-- 任务卡片 -->
    <view class="task-card" v-if="currentTask">
      <view class="task-content">
        <text class="task-title">{{currentTask.title}}</text>
        <text class="task-desc">{{currentTask.description}}</text>
      </view>
      
      <view class="task-actions">
        <button 
          class="action-btn"
          :disabled="!canSubmit"
          @tap="completeTask"
        >
          完成任务
        </button>
      </view>
    </view>

    <!-- 共情种子展示 -->
    <view class="seed-section">
      <view class="seed-container">
        <image 
          :src="seedImage" 
          mode="aspectFit"
          :class="{
            'seed-growing': isGrowing,
            'seed-floating': !isGrowing,
            'seed-glowing': isGrowing
          }"
        />
        <text class="seed-level">Level {{seedLevel}}</text>
      </view>
      <view class="seed-stats">
        <text>完成任务: {{completedTasks}}/{{totalTasks}}</text>
        <text>当前经验: {{experience}}/{{nextLevelExp}}</text>
      </view>
    </view>

    <!-- 任务历史 -->
    <view class="task-history">
      <text class="section-title">历史任务</text>
      <view 
        v-for="task in completedTaskList" 
        :key="task.id"
        class="history-item"
      >
        <text class="date">{{task.completedAt}}</text>
        <text class="task">{{task.title}}</text>
      </view>
    </view>
      <!-- 进度面板 -->
      <progress-board />
  </view>
</template>

<script>
import { currentTask } from './empathy.js'
import {completeEmpathyTask, getEmpathyTasks} from '@/api/empathy.js'
import ProgressBoard from './components/ProgressBoard.vue';
export default {
  components: {
    ProgressBoard
  },
  data() {
    return {
      currentTask: currentTask,
      seedLevel: 1,
      experience: 0,
      nextLevelExp: 100,
      completedTasks: 0,
      totalTasks: 7,
      isGrowing: false,
      completedTaskList: [],
      isExpIncreasing: false,
      isLevelUp: false,
      lastExpGained: 0,
    };
  },
  computed: {
    seedImage() {
      return `/static/seeds/level-${this.seedLevel}.svg`;
    },
    canSubmit() {
      return this.currentTask && !this.currentTask.completed;
    }
  },
  methods: {
    async completeTask() {
      try {
        const result = await completeEmpathyTask({ taskId: this.currentTask.id});

        if (result.data.success) {
          this.experience += result.data.data.expGained;
          this.completedTasks++;
          this.checkLevelUp();
          this.showSuccess('任务完成');
          this.updateTaskHistory();
        }
      } catch (error) {
        this.showError('提交失败');
      }
    },
    checkLevelUp() {
      if (this.experience >= this.nextLevelExp) {
        this.levelUp();
      }
    },
    levelUp() {
      this.isGrowing = true;
      this.seedLevel++;
      this.experience -= this.nextLevelExp;
      this.nextLevelExp *= 1.5;
      
      setTimeout(() => {
        this.isGrowing = false;
      }, 2000);
    },
    async updateTaskHistory() {
      try {
        // const result = await this.$http.get('/api/empathy/task-history');
        // this.completedTaskList = result.data.data;
        this.completedTaskList = taskHistory;
      } catch (error) {
        console.error('获取任务历史失败:', error);
      }
    },
    showSuccess(message) {
      uni.showToast({
        title: message,
        icon: 'success'
      });
    },
    showError(message) {
      uni.showToast({
        title: message,
        icon: 'error'
      });
    }
  },
  async onShow() {
    try {
      // const result = await this.$http.get('/api/empathy/current-task');
      const result = await getEmpathyTasks();
      // this.currentTask = result.data.data;
      this.updateTaskHistory();
    } catch (error) {
      console.error('获取任务失败:', error);
    }
  },
  async completeTask() {
      try {
        const result = await completeEmpathyTask({ taskId: this.currentTask.id});

        if (result.data.success) {
          const expGained = result.data.data.expGained;
          this.lastExpGained = expGained;
          this.showExpAnimation(expGained);
          await this.updateExperience(expGained);
          this.showSuccess('任务完成');
          this.updateTaskHistory();
        }
      } catch (error) {
        this.showError('提交失败');
      }
    },
    
    async showExpAnimation(expGained) {
      this.isExpIncreasing = true;
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isExpIncreasing = false;
    },

    async updateExperience(expGained) {
      // 分步增加经验值，创造动画效果
      const steps = 10;
      const expPerStep = expGained / steps;
      
      for (let i = 0; i < steps; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        this.experience += expPerStep;
        
        if (this.experience >= this.nextLevelExp) {
          await this.levelUp();
        }
      }
    },

    async levelUp() {
      this.isGrowing = true;
      this.isLevelUp = true;
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.seedLevel++;
      this.experience -= this.nextLevelExp;
      this.nextLevelExp *= 1.5;
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.isGrowing = false;
      this.isLevelUp = false;
    }
};
</script>

<style lang="scss">
.game-page {
  min-height: 100vh;
  background: #f8f8f8;
  padding: 20rpx;

  .game-header {
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

  .task-card {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.1);

    .task-content {
      margin-bottom: 30rpx;

      .task-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 15rpx;
        display: block;
      }

      .task-desc {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
      }
    }

    .action-btn {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      background: #91CB74;
      color: #fff;
      border-radius: 44rpx;
      font-size: 32rpx;

      &:disabled {
        background: #ccc;
      }
    }
  }

  .seed-section {
    text-align: center;
    margin: 40rpx 0;

    .seed-container {
      position: relative;
      width: 200rpx;
      height: 200rpx;
      margin: 0 auto;

      image {
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease;

        &.seed-growing {
          transform: scale(1.2);
        }
      }

      .seed-level {
        position: absolute;
        bottom: -30rpx;
        left: 50%;
        transform: translateX(-50%);
        font-size: 24rpx;
        color: #666;
      }
    }

    .seed-stats {
      margin-top: 40rpx;
      
      text {
        font-size: 24rpx;
        color: #666;
        margin: 0 20rpx;
      }
    }
  }

  .task-history {
    margin-top: 40rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }

    .history-item {
      background: #fff;
      border-radius: 8rpx;
      padding: 20rpx;
      margin-bottom: 15rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .date {
        font-size: 24rpx;
        color: #999;
      }

      .task {
        font-size: 26rpx;
        color: #333;
      }
    }
  }
}
@import '@/static/animation.keyframes.scss';

.seed-section {
  .seed-container {
    position: relative;

    image {
      &.seed-growing {
        animation: seedGrow 2s ease-in-out, seedGlow 1s infinite;
      }
      
      &.seed-floating {
        animation: seedFloat 3s ease-in-out infinite;
      }
      
      &.seed-glowing {
        filter: drop-shadow(0 0 10rpx rgba(145, 203, 116, 0.5));
      }
    }

    .exp-bubble {
      position: absolute;
      top: -40rpx;
      left: 50%;
      transform: translateX(-50%);
      background: #91CB74;
      color: #fff;
      padding: 10rpx 20rpx;
      border-radius: 20rpx;
      font-size: 24rpx;
      opacity: 0;
      transition: opacity 0.3s;

      &.exp-increasing {
        animation: expIncrease 1s ease-out;
        opacity: 1;
      }
    }

    .seed-level {
      &.level-up {
        animation: expIncrease 1s ease-out;
        color: #91CB74;
      }
    }
  }

  .seed-stats {
    .exp-bar {
      width: 300rpx;
      height: 20rpx;
      background: #f0f0f0;
      border-radius: 10rpx;
      margin: 20rpx auto;
      overflow: hidden;

      .exp-progress {
        height: 100%;
        background: #91CB74;
        border-radius: 10rpx;
        transition: width 0.3s ease;
      }
    }
  }
}
</style>
