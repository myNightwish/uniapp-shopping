<template>
  <view class="analysis-section">
    <view class="score-card">
      <view class="main-score">
        <text class="value">{{analysis.totalScore}}</text>
        <text class="label">总积分</text>
      </view>
      <view class="sub-scores">
        <view class="score-item">
          <text class="value">{{analysis.positiveRate}}%</text>
          <text class="label">正向率</text>
        </view>
      </view>
    </view>

    <!-- 类别分析 -->
    <view class="category-analysis">
      <text class="section-title">行为类别分析</text>
      <view 
        v-for="cat in analysis.categoryAnalysis"
        :key="cat.category"
        class="category-item"
      >
        <view class="header">
          <text class="name">{{getCategoryName(cat.category)}}</text>
          <text class="points">{{cat.totalPoints}}分</text>
        </view>
        <view class="stats">
          <view class="stat positive">
            <text class="count">{{cat.positiveCount}}</text>
            <text class="label">表扬</text>
          </view>
          <view class="stat negative">
            <text class="count">{{cat.negativeCount}}</text>
            <text class="label">改进</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 趋势图表 -->
    <view class="trend-chart">
      <text class="section-title">积分趋势</text>
      <qiun-data-charts 
        type="line"
        :opts="chartOpts"
        :chartData="trendData"
      />
    </view>
  </view>
</template>

<script>
import dayjs from 'dayjs';

export default {
  props: {
    analysis: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartOpts: {
        color: ['#91CB74'],
        padding: [15, 10, 0, 15],
        enableScroll: true,
        legend: { show: false },
        xAxis: { 
          scrollShow: true,
          itemCount: 7,
        },
        yAxis: { 
          splitNumber: 4,
        },
      }
    };
  },
  computed: {
    trendData() {
      if (!this.analysis.recentTrend) return null;
      
      const categories = this.analysis.recentTrend.map(item => 
        dayjs(item.date).format('MM-DD')
      );
      
      return {
        categories,
        series: [{
          name: '积分',
          data: this.analysis.recentTrend.map(item => item.points)
        }]
      };
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
    }
  }
};
</script>

<style lang="scss">
.analysis-section {
  padding: 20rpx;

  .score-card {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 40rpx;
    text-align: center;

    .main-score {
      margin-bottom: 30rpx;

      .value {
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

    .sub-scores {
      display: flex;
      justify-content: center;

      .score-item {
        .value {
          font-size: 36rpx;
          font-weight: bold;
          color: #333;
          display: block;
        }

        .label {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }

  .category-analysis {
    margin-bottom: 40rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }

    .category-item {
      background: #fff;
      border-radius: 12rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15rpx;

        .name {
          font-size: 28rpx;
          font-weight: bold;
        }

        .points {
          font-size: 28rpx;
          color: #91CB74;
        }
      }

      .stats {
        display: flex;
        gap: 30rpx;

        .stat {
          text-align: center;

          .count {
            font-size: 32rpx;
            font-weight: bold;
            display: block;
          }

          .label {
            font-size: 24rpx;
            color: #666;
          }

          &.positive .count {
            color: #91CB74;
          }

          &.negative .count {
            color: #ee6666;
          }
        }
      }
    }
  }

  .trend-chart {
    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }

    height: 500rpx;
  }
}
</style>