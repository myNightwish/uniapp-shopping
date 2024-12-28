<template>
  <view class="behavior-form">
    <view class="form-header">
      <text class="title">记录伴侣行为</text>
      <text class="subtitle">记录值得表扬或需要改进的行为</text>
    </view>

    <!-- 行为类型选择 -->
    <view class="type-selector">
      <view 
        class="type-btn"
        :class="{ active: type === 'positive' }"
        @tap="selectType('positive')"
      >
        <text class="icon">👍</text>
        <text>表扬</text>
      </view>
      <view 
        class="type-btn"
        :class="{ active: type === 'negative' }"
        @tap="selectType('negative')"
      >
        <text class="icon">👎</text>
        <text>改进</text>
      </view>
    </view>
    <!-- 行为类别选择 -->
    <view class="category-selector">
      <text class="label">行为类别</text>
      <scroll-view scroll-x class="category-scroll">
        <view 
          v-for="cat in categories"
          :key="cat.id"
          class="category-item"
          :class="{ active: category === cat.id }"
          @tap="selectCategory(cat.id)"
        >
          <text>{{cat.name}}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 积分设置 -->
    <view class="points-setter">
      <text class="label">积分变化</text>
      <view class="points-btns">
        <button 
          v-for="p in pointsOptions"
          :key="p"
          class="point-btn"
          :class="{ active: points === p }"
          @tap="setPoints(p)"
        >
          {{p > 0 ? '+' : ''}}{{p}}
        </button>
      </view>
    </view>

    <!-- 行为描述 -->
    <view class="description-input">
      <text class="label">具体描述</text>
      <textarea
        v-model="description"
        placeholder="描述具体行为和感受..."
        :maxlength="200"
      />
      <text class="word-count">{{description.length}}/200</text>
    </view>

    <button 
      class="submit-btn"
      :disabled="!isValid"
      @tap="submitBehavior"
    >
      提交记录
    </button>
  </view>
</template>

<script>
import {postRecordBehavior, getBehaviorCategories} from '@/api/behavior.js'
export default {
  data() {
    return {
      type: '',
      category: '',
      points: 0,
      description: '',
      categories: [],
      pointsOptions: [1, 2, 5, 10, -1, -2, -5, -10]
    };
  },
  computed: {
    isValid() {
      return this.type && 
        this.category && 
        this.points !== 0 && 
        this.description.length > 0;
    }
  },
  methods: {
    selectType(type) {
      this.type = type;
      // 重置积分
      this.points = 0;
    },
    selectCategory(categoryId) {
      this.category = categoryId;
    },
    setPoints(points) {
      this.points = points;
    },
    async submitBehavior() {
      if (!this.isValid) return;
      
      try {
        const result = await postRecordBehavior({
          type: this.type,
          category: this.category,
          points: this.points,
          description: this.description
        });

        if (result.success) {
          this.$emit('submit-success', result.data);
          this.resetForm();
          uni.showToast({
            title: '记录成功',
            icon: 'success'
          });
        }
      } catch (error) {
        uni.showToast({
          title: '记录失败',
          icon: 'error'
        });
      }
    },
    resetForm() {
      this.type = '';
      this.category = '';
      this.points = 0;
      this.description = '';
    },
    async loadCategories() {
      try {
        this.categories = await getBehaviorCategories();
      } catch (error) {
        console.error('加载行为类别失败:', error);
      }
    }
  },
  mounted() {
    this.loadCategories();
  }
};
</script>

<style lang="scss">
.behavior-form {
  padding: 20rpx;

  .form-header {
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

  .type-selector {
    display: flex;
    justify-content: space-around;
    margin-bottom: 40rpx;

    .type-btn {
      flex: 1;
      margin: 0 20rpx;
      height: 120rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f8f8f8;
      border-radius: 12rpx;

      &.active {
        background: #e1f3d8;
        border: 2rpx solid #91CB74;
      }

      .icon {
        font-size: 40rpx;
        margin-bottom: 10rpx;
      }
    }
  }

  .category-selector {
    margin-bottom: 40rpx;

    .label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }

    .category-scroll {
      white-space: nowrap;

      .category-item {
        display: inline-block;
        padding: 20rpx 30rpx;
        margin-right: 20rpx;
        background: #f8f8f8;
        border-radius: 30rpx;

        &.active {
          background: #91CB74;
          color: #fff;
        }
      }
    }
  }

  .points-setter {
    margin-bottom: 40rpx;

    .label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }

    .points-btns {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;

      .point-btn {
        width: calc(25% - 15rpx);
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        background: #f8f8f8;
        border-radius: 8rpx;

        &.active {
          background: #91CB74;
          color: #fff;
        }
      }
    }
  }

  .description-input {
    position: relative;
    margin-bottom: 40rpx;

    .label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }

    textarea {
      width: 100%;
      height: 200rpx;
      padding: 20rpx;
      background: #f8f8f8;
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

  .submit-btn {
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
</style>