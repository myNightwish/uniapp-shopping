import { ref } from 'vue';
import { shoppingApi } from '@/api/shopping';

export function useShoppingItems() {
  const groupedItems = ref([]);
  const selectedItems = ref({});

  // 获取购物清单
  const fetchItems = async () => {
    try {
      const data = await shoppingApi.getAllLists();
      groupedItems.value = (data || []).map(family => ({
        familyId: family.familyId,
        familyName: family.familyName,
        items: [
          ...family.items.filter(item => !item.purchased),
          ...family.items.filter(item => item.purchased),
        ],
      }));
    } catch (error) {
      throw error;
    }
  };

  // 标记物品为已购买
  const markItemsAsPurchased = async (familyId, itemIds) => {
    try {
      await shoppingApi.markItemsAsPurchased(familyId, itemIds);
      const family = groupedItems.value.find(f => f.familyId === familyId);
      itemIds.forEach(itemId => {
        const item = family.items.find(i => i.id === itemId);
        if (item) item.purchased = true;
      });
    } catch (error) {
      console.error('Failed to mark items as purchased:', error);
      throw error;
    }
  };

  // 添加新物品
  const addNewItem = async (item) => {
    try {
      await shoppingApi.addItem(item);
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  };

  return {
    groupedItems,
    selectedItems,
    fetchItems,
    markItemsAsPurchased,
    addNewItem,
  };
}
