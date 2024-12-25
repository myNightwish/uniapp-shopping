import { request } from '@/utils/request';

export const createMemoryPuzzle = (data) => {
  return request({
    url: '/api/memory-puzzle/create',
    method: 'POST',
    data
  });
}

export const getMemoryPuzzleResult = (puzzleId) => {
  return request({
    url: `/api/memory-puzzle/${puzzleId}`,
    method: 'GET'
  });
}