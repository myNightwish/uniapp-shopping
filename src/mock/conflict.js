// 冲突记录模块的 mock 数据
export const conflictTags = [
  '沟通方式',
  '价值观差异',
  '期望不一致',
  '情绪管理',
  '生活习惯',
  '时间分配',
  '金钱观念'
];

export const conflictAnalysis = {
  patterns: {
    tagFrequency: {
      '沟通方式': 3,
      '情绪管理': 2,
      '期望不一致': 1
    },
    triggerPatterns: {
      '工作压力': 2,
      '生活琐事': 3,
      '未来规划': 1
    }
  },
  improvements: [
    {
      area: '沟通方式',
      frequency: 3,
      suggestion: '建议采用"我感受"陈述，避免指责性语言'
    },
    {
      area: '情绪管理',
      frequency: 2,
      suggestion: '学习情绪觉察，在情绪激动时暂停对话'
    }
  ]
};