<template>
  <view class="conflict-page">
    <!-- 冲突记录表单 -->
    <view class="form-section">
      <view class="section-title">
        <text class="title">冲突地图</text>
        <text class="subtitle">记录并分析你们的分歧，找到更好的解决方式</text>
      </view>

      <!-- 触发原因 -->
      <view class="form-item">
        <text class="label">是什么引发了这次分歧？</text>
        <textarea
          v-model="formData.trigger"
          placeholder="描述导致冲突的具体情况..."
          :maxlength="200"
        />
      </view>

      <!-- 情绪状态 -->
      <view class="form-item">
        <text class="label">当时的情绪状态是？</text>
        <view class="emotion-tags">
          <view
            v-for="emotion in emotions"
            :key="emotion"
            class="tag"
            :class="{ active: formData.emotionState === emotion }"
            @tap="selectEmotion(emotion)"
          >
            {{ emotion }}
          </view>
        </view>
      </view>

      <!-- 解决方式 -->
      <view class="form-item">
        <text class="label">最终是如何解决的？</text>
        <textarea
          v-model="formData.resolution"
          placeholder="描述你们是如何处理这个分歧的..."
          :maxlength="200"
        />
      </view>

      <!-- 反思总结 -->
      <view class="form-item">
        <text class="label">有什么感悟或反思吗？</text>
        <textarea
          v-model="formData.reflection"
          placeholder="分享你对这次冲突的思考..."
          :maxlength="200"
        />
      </view>

      <!-- 冲突标签 -->
      <view class="form-item">
        <text class="label">选择相关的标签</text>
        <view class="conflict-tags">
          <view
            v-for="tag in conflictTags"
            :key="tag"
            class="tag"
            :class="{ active: formData.tags.includes(tag) }"
            @tap="toggleTag(tag)"
          >
            {{ tag }}
          </view>
        </view>
      </view>

      <button 
        class="submit-btn"
        :disabled="!isFormValid"
        @tap="submitConflict"
      >
        提交记录
      </button>
    </view>

    <!-- 分析结果 -->
    <view class="analysis-section" v-if="analysis">
      <view class="card">
        <view class="card-header">
          <image src="/static/ai-avatar.png" mode="aspectFit" />
          <text>冲突分析</text>
        </view>
        
        <!-- 冲突模式分析 -->
        <view class="pattern-analysis">
          <text class="section-label">常见模式</text>
          <view class="patterns">
            <view 
              v-for="(frequency, tag) in analysis.patterns.tagFrequency"
              :key="tag"
              class="pattern-item"
            >
              <text class="tag">{{tag}}</text>
              <text class="frequency">出现{{frequency}}次</text>
            </view>
          </view>
        </view>

        <!-- 改进建议 -->
        <view class="improvements">
          <text class="section-label">改进建议</text>
          <view 
            v-for="item in analysis.improvements"
            :key="item.area"
            class="improvement-item"
          >
            <text class="area">{{item.area}}</text>
            <text class="suggestion">{{item.suggestion}}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 冲突分析组件 -->
    <conflict-analysis v-if="analysis" />
  </view>
</template>

<script>
import {postConflictRecord} from '@/api/conflict.js';
import ConflictAnalysis from './components/ConflictAnalysis.vue'
export default {
  components: {
    ConflictAnalysis,
  },
  data() {
    return {
      formData: {
        trigger: '',
        emotionState: '',
        resolution: '',
        reflection: '',
        tags: [],
      },
      emotions: ['愤怒', '委屈', '失望', '焦虑', '困惑'],
      conflictTags: [
        '沟通方式',
        '价值观差异',
        '期望不一致',
        '情绪管理',
        '生活习惯',
        '时间分配',
        '金钱观念',
      ],
      analysis: null,
    };
  },
  computed: {
    isFormValid() {
      const { trigger, emotionState, resolution, reflection, tags } = this.formData;
      return (
        trigger.length > 0 &&
        emotionState &&
        resolution.length > 0 &&
        reflection.length > 0 &&
        tags.length > 0
      );
    },
  },
  methods: {
    selectEmotion(emotion) {
      this.formData.emotionState = emotion;
    },
    toggleTag(tag) {
      const index = this.formData.tags.indexOf(tag);
      if (index > -1) {
        this.formData.tags.splice(index, 1);
      } else {
        this.formData.tags.push(tag);
      }
    },
    async submitConflict() {
      try {
        const result = await postConflictRecord({
          ...this.formData,
          partnerId: this.partnerId,
        })

        if (result.data.success) {
          this.analysis = result.data.data.analysis;
          this.showSuccess('记录成功');
          this.resetForm();
        }
      } catch (error) {
        this.showError('提交失败，请重试');
      }
    },
    resetForm() {
      this.formData = {
        trigger: '',
        emotionState: '',
        resolution: '',
        reflection: '',
        tags: [],
      };
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
};
</script>

<style lang="scss">
.conflict-page {
  min-height: 100vh;
  background: #f8f8f8;
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

  .form-item {
    margin-bottom: 30rpx;

    .label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 15rpx;
      display: block;
    }

    textarea {
      width: 100%;
      height: 160rpx;
      padding: 20rpx;
      background: #fff;
      border-radius: 12rpx;
      font-size: 28rpx;
    }
  }

  .emotion-tags, .conflict-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;

    .tag {
      padding: 10rpx 20rpx;
      background: #f1f1f1;
      border-radius: 30rpx;
      font-size: 24rpx;
      color: #666;

      &.active {
        background: #91CB74;
        color: #fff;
      }
    }
  }

  .submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #91CB74;
    color: #fff;
    border-radius: 44rpx;
    margin: 40rpx 0;
    font-size: 32rpx;

    &:disabled {
      background: #ccc;
    }
  }

  .analysis-section {
    margin-top: 40rpx;

    .card {
      background: #fff;
      border-radius: 12rpx;
      padding: 20rpx;

      .card-header {
        display: flex;
        align-items: center;
        margin-bottom: 30rpx;

        image {
          width: 60rpx;
          height: 60rpx;
          margin-right: 20rpx;
          border-radius: 30rpx;
        }
      }

      .section-label {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
        display: block;
      }

      .pattern-analysis {
        margin-bottom: 30rpx;

        .pattern-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15rpx 0;
          border-bottom: 1rpx solid #f1f1f1;

          .tag {
            font-size: 26rpx;
            color: #333;
          }

          .frequency {
            font-size: 24rpx;
            color: #999;
          }
        }
      }

      .improvements {
        .improvement-item {
          margin-bottom: 20rpx;

          .area {
            font-size: 26rpx;
            color: #333;
            margin-bottom: 10rpx;
            display: block;
          }

          .suggestion {
            font-size: 24rpx;
            color: #666;
            line-height: 1.6;
          }
        }
      }
    }
  }
}
</style>