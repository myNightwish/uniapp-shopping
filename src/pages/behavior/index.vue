<template>
  <view class="behavior-page">
    <!-- 行为记录表单 -->
    <behavior-form @submit-success="onBehaviorSubmit" />
    
    <!-- 行为分析 -->
    <behavior-analysis 
      v-if="analysis"
      :analysis="analysis"
    />
  </view>
</template>

<script>
import BehaviorForm from './components/BehaviorForm.vue';
import BehaviorAnalysis from './components/BehaviorAnalysis.vue';
import {getBehaviorCategories} from '@/api/behavior.js'
export default {
  components: {
    BehaviorForm,
    BehaviorAnalysis
  },
  data() {
    return {
      analysis: null
    };
  },
  methods: {
    onBehaviorSubmit(data) {
      this.analysis = data.analysis;
    },
    async loadAnalysis() {
      try {
        this.analysis = await getBehaviorCategories();
      } catch (error) {
        console.error('加载行为分析失败:', error);
      }
    }
  },
  onShow() {
    this.loadAnalysis();
  }
};
</script>

<style lang="scss">
.behavior-page {
  min-height: 100vh;
  background: #f8f8f8;
  padding-bottom: 40rpx;
}
</style>