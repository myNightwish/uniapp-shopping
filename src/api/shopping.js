import request from '@/api/index.js';

export const shoppingApi = {
  // 获取所有购物清单
  async getAllLists() {
    // const response = await request({
    //   url: '/api/lists/all',
    //   method: 'GET',
    // });
    return [
      {
          "familyId": 34,
          "familyName": "测试-买菜",
          "familyStatus": "active",
          "items": [
              {
                  "id": 17,
                  "shoppingListId": 10,
                  "name": "牛奶🥛",
                  "quantity": 1,
                  "description": "热的",
                  "image": "",
                  "addedById": null,
                  "purchased": false,
                  "purchasedById": null,
                  "purchasedAt": null,
                  "createdAt": "2024-12-02T03:27:37.000Z"
              },
              {
                  "id": 18,
                  "shoppingListId": 10,
                  "name": "橘子🍊",
                  "quantity": 2,
                  "description": "2斤",
                  "image": "",
                  "addedById": null,
                  "purchased": false,
                  "purchasedById": null,
                  "purchasedAt": null,
                  "createdAt": "2024-12-02T03:34:18.000Z"
              },
              {
                  "id": 19,
                  "shoppingListId": 10,
                  "name": "🍌香蕉",
                  "quantity": 1,
                  "description": "黄色",
                  "image": "",
                  "addedById": null,
                  "purchased": false,
                  "purchasedById": null,
                  "purchasedAt": null,
                  "createdAt": "2024-12-02T03:34:36.000Z"
              },
              {
                  "id": 20,
                  "shoppingListId": 10,
                  "name": "☕️咖啡",
                  "quantity": 1,
                  "description": "加糖",
                  "image": "",
                  "addedById": null,
                  "purchased": false,
                  "purchasedById": null,
                  "purchasedAt": null,
                  "createdAt": "2024-12-02T03:36:08.000Z"
              }
          ]
      }
  ]
    // return response;
  },

  // 添加新物品
  async addItem(item) {
    const response = await request({
      url: '/api/lists/create',
      method: 'POST',
      data: { item },
    });
    return response;
  },

  // 标记物品为已购买
  async markItemsAsPurchased(familyId, itemIds) {
    const response = await request({
      url: '/api/lists/markpurchased',
      method: 'POST',
      data: { familyId, itemIds },
    });
    return response;
  },
};
