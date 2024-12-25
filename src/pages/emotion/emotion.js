// 情绪记录模块的 mock 数据
export const emotions = [
  { type: 'happy', label: '开心', icon: '/static/emotions/happy.svg' },
  { type: 'sad', label: '难过', icon: '/static/emotions/sad.svg' },
  { type: 'angry', label: '生气', icon: '/static/emotions/angry.svg' },
  { type: 'anxious', label: '焦虑', icon: '/static/emotions/anxious.svg' },
  { type: 'neutral', label: '平静', icon: '/static/emotions/neutral.svg' }
];

export const emotionTrend = {
  trend: [
    { date: '2024-01-01', intensity: 4, type: 'happy' },
    { date: '2024-01-02', intensity: 3, type: 'neutral' },
    { date: '2024-01-03', intensity: 2, type: 'anxious' },
    { date: '2024-01-04', intensity: 4, type: 'happy' },
    { date: '2024-01-05', intensity: 5, type: 'happy' },
    { date: '2024-01-06', intensity: 3, type: 'neutral' },
    { date: '2024-01-07', intensity: 2, type: 'sad' }
  ],
  distribution: {
    happy: 3,
    neutral: 2,
    anxious: 1,
    sad: 1
  }
};

export const aiSuggestion = "最近一周你的情绪总体平稳，建议多关注伴侣的情绪变化，增加共同活动的频率。";