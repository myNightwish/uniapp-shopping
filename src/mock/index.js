// 统一导出所有 mock 数据
export * from './emotion';
export * from './memory-puzzle';
export * from './conflict';
export * from './empathy';
export * from './growth';

// Mock API 响应
export const mockApiResponse = (data) => {
  return {
    data: {
      success: true,
      data
    }
  };
};