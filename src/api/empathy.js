import { request } from '@/utils/request';

// 获取共情游戏任务
// todo: 缺失
export const getEmpathyTasks = () => {
  return request({
    url: '/api/empathy/tasks',
    method: 'GET'
  });
}
// 完成共情游戏任务
export const completeEmpathyTask = (data) => {
  return request({
    url: '/api/empathy/complete-task',
    method: 'POST',
    data
  });
}

// 获取共情游戏进度
// todo: 缺失
export const getEmpathyProgress = () => {
  return request({
    url: '/api/empathy/progress',
    method: 'GET'
  });
}