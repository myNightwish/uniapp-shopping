<template>
  <view class="puzzle-page">
    <!-- 顶部进度 -->
    <view class="progress-bar">
      <view 
        class="progress" 
        :style="{ width: `${progress}%` }"
      />
    </view>

    <!-- 记忆描述区域 -->
    <view class="memory-section" v-if="step === 1">
      <view class="section-title">
        <text class="title">记忆拼图</text>
        <text class="subtitle">描述一个你们共同经历的美好回忆</text>
      </view>
      
      <view class="memory-input">
        <textarea
          v-model="description"
          placeholder="例如：第一次见面的场景、印象最深的一次约会..."
          :maxlength="500"
        />
        <text class="word-count">{{description.length}}/500</text>
      </view>

      <button 
        class="next-btn"
        :disabled="!description"
        @tap="submitDescription"
      >
        提交描述
      </button>
    </view>

    <!-- 等待伴侣描述 -->
    <view class="waiting-section" v-if="step === 2">
      <view class="loading-animation">
        <image src="/static/puzzle/waiting.gif" mode="aspectFit" />
      </view>
      <text class="waiting-text">等待伴侣完成描述...</text>
      <text class="tip">提示：可以先去完成其他互动哦</text>
    </view>

    <!-- 匹配结果展示 -->
    <view class="result-section" v-if="step === 3">
      <view class="match-score">
        <text class="score">{{matchScore}}%</text>
        <text class="label">记忆匹配度</text>
      </view>

      <view class="descriptions">
        <view class="description-card">
          <text class="author">你的描述</text>
          <text class="content">{{description}}</text>
        </view>
        <view class="description-card">
          <text class="author">伴侣的描述</text>
          <text class="content">{{partnerDescription}}</text>
        </view>
      </view>

      <view class="ai-analysis" v-if="analysis">
        <view class="card">
          <view class="card-header">
            <image src="/static/ai-avatar.png" mode="aspectFit" />
            <text>记忆解析</text>
          </view>
          <view class="card-content">
            <text>{{analysis}}</text>
          </view>
        </view>
      </view>

      <button class="share-btn" @tap="sharePuzzle">
        分享给伴侣
      </button>
    </view>
  </view>
</template>

<script>
import {createMemoryPuzzle, getMemoryPuzzleResult} from '@/api/memory-puzzle.js'
export default {
  data() {
    return {
      step: 1,
      description: '',
      partnerId: '',
      puzzleId: '',
      matchScore: 0,
      partnerDescription: '',
      analysis: '',
      checkTimer: null,
    };
  },
  computed: {
    progress() {
      return this.step * 33.33;
    },
  },
  methods: {
    async submitDescription() {
      try {
        createMemoryPuzzle({
          partnerId: this.partnerId,
          description: this.description,
        }).then(result => {
          if (result.data.success) {
            this.puzzleId = result.data.data.id;
            this.step = 2;
            this.startCheckingResult();
          }
        })
      } catch (error) {
        this.showError('提交失败，请重试');
      }
    },
    startCheckingResult() {
      this.checkTimer = setInterval(async () => {
        try {
          const result = await getMemoryPuzzleResult(this.puzzleId);
          if (result.data.success && result.data.data.match_score) {
            clearInterval(this.checkTimer);
            this.matchScore = Math.round(result.data.data.match_score);
            this.partnerDescription = result.data.data.partner_description;
            this.analysis = result.data.data.analysis;
            this.step = 3;
          }
        } catch (error) {
          console.error('检查结果失败:', error);
        }
      }, 5000); // 每5秒检查一次
    },
    sharePuzzle() {
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        title: '来看看我们的记忆匹配度',
        summary: `我们的记忆匹配度达到了${this.matchScore}%`,
        imageUrl: '/static/puzzle/share.png',
        success: function (res) {
          console.log('分享成功');
        },
        fail: function (err) {
          console.error('分享失败', err);
        }
      });
    },
    showError(message) {
      uni.showToast({
        title: message,
        icon: 'error',
      });
    },
  },
  onUnload() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
    }
  },
};
</script>

<style lang="scss">
.puzzle-page {
  min-height: 100vh;
  background: #f8f8f8;
  padding: 20rpx;

  .progress-bar {
    height: 6rpx;
    background: #eee;
    border-radius: 3rpx;
    margin-bottom: 40rpx;

    .progress {
      height: 100%;
      background: #91CB74;
      border-radius: 3rpx;
      transition: width 0.3s ease;
    }
  }

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

  .memory-input {
    position: relative;
    margin-bottom: 40rpx;

    textarea {
      width: 100%;
      height: 300rpx;
      padding: 20rpx;
      background: #fff;
      border-radius: 12rpx;
      font-size: 28rpx;
    }

    .word-count {
      position: absolute;
      right: 20rpx;
      bottom: 20rpx;
      font-size: 24rpx;
      color: #999;
    }
  }

  .waiting-section {
    text-align: center;
    padding: 100rpx 0;

    .loading-animation {
      width: 200rpx;
      height: 200rpx;
      margin: 0 auto 40rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .waiting-text {
      font-size: 32rpx;
      color: #333;
      display: block;
    }

    .tip {
      font-size: 24rpx;
      color: #999;
      margin-top: 20rpx;
      display: block;
    }
  }

  .result-section {
    .match-score {
      text-align: center;
      margin-bottom: 60rpx;

      .score {
        font-size: 72rpx;
        font-weight: bold;
        color: #91CB74;
        display: block;
      }

      .label {
        font-size: 28rpx;
        color: #666;
      }
    }

    .descriptions {
      margin-bottom: 40rpx;

      .description-card {
        background: #fff;
        border-radius: 12rpx;
        padding: 20rpx;
        margin-bottom: 20rpx;

        .author {
          font-size: 28rpx;
          color: #666;
          margin-bottom: 10rpx;
          display: block;
        }

        .content {
          font-size: 28rpx;
          color: #333;
          line-height: 1.6;
        }
      }
    }
  }

  .next-btn, .share-btn {
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

  .ai-analysis {
    margin: 40rpx 0;

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

      .card-content {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
      }
    }
  }
}
</style>