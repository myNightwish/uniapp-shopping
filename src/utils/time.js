export const formatTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const diff = now - new Date(date);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前';
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前';
  } else if (diff < 2 * day) {
    return '昨天';
  } else {
    const d = new Date(date);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }
};