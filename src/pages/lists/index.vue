<template>
  <view class="shopping-container">
    <view v-if="groupedItems.length === 0" class="text-center text-gray-500">
      You have no shoppingLists.
    </view>
    <view v-for="family in groupedItems" :key="family.familyId" class="space-y-4">
      <FamilyGroup
        :family="family"
        :selected-items="selectedItems[family.familyId] || []"
        @select-all="handleSelectAll"
        @confirm-batch="handleBatchPurchase"
        @toggle-select="handleToggleSelect"
        @add-item="handleAddBtn"
      />
    </view>
    
    <AddItemModal
      v-if="showAddItemModal"
      @close="showAddItemModal = false"
      @add-item="handleAddItem"
      :families="groupedItems"
      :curFamilyId="addBtnId"
    />

    <ConfirmationModal
      v-if="showConfirmModal"
      :message="confirmationMessage"
      @confirm="handleConfirmPurchase"
      @cancel="showConfirmModal = false"
    />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useShoppingItems } from '@/composables/useShoppingItems';
import FamilyGroup from '@/components/shopping/FamilyGroup.vue';
import AddItemModal from '@/components/shopping/AddItemModal.vue';
import ConfirmationModal from '@/components/shopping/ConfirmationModal.vue';
import { onShow } from "@dcloudio/uni-app";

const showAddItemModal = ref(false);
const showConfirmModal = ref(false);
const confirmationMessage = ref('');
const pendingAction = ref(null);
const addBtnId = ref(0);

const {
  groupedItems,
  selectedItems,
  fetchItems,
  markItemsAsPurchased,
  addNewItem
} = useShoppingItems();

// 选择全部
const handleSelectAll = (familyId) => {
  const family = groupedItems.value.find(f => f.familyId === familyId);
  if (!selectedItems.value[familyId]) {
    selectedItems.value[familyId] = [];
  }
  selectedItems.value[familyId] = (family.items || [])
    .filter(item => !item.purchased)
    .map(item => item.id);
};

// 点击添加按钮
const handleAddBtn = (id) => {
  showAddItemModal.value = true;
  addBtnId.value = id;
};

// 切换选择状态
const handleToggleSelect = ({ familyId, itemId }) => {
  if (!selectedItems.value[familyId]) {
    selectedItems.value[familyId] = [];
  }
  const index = selectedItems.value[familyId].indexOf(itemId);
  if (index === -1) {
    selectedItems.value[familyId].push(itemId);
  } else {
    selectedItems.value[familyId].splice(index, 1);
  }
};

// 批量购买
const handleBatchPurchase = (familyId) => {
  const itemCount = selectedItems.value[familyId]?.length || 0;
  confirmationMessage.value = `是否确认将选中的 ${itemCount} 个物品标记为已购买？`;
  pendingAction.value = { type: 'batch', familyId };
  showConfirmModal.value = true;
};

// 确认批量购买
const handleConfirmPurchase = async () => {
  try {
    if (pendingAction.value.type === 'batch') {
      const { familyId } = pendingAction.value;
      await markItemsAsPurchased(familyId, selectedItems.value[familyId]);
      selectedItems.value[familyId] = [];
      success('物品已成功更新');
    }
  } catch (err) {
    error('更新失败，请重试');
  } finally {
    showConfirmModal.value = false;
    pendingAction.value = null;
  }
};

// 添加物品
const handleAddItem = async (newItem) => {
  try {
    await addNewItem(newItem);
    showAddItemModal.value = false;
    success('物品添加成功');
    await fetchItems();
  } catch (_) {
    error('添加失败，请重试');
  }
};

// 页面初始化
onMounted(fetchItems);

// 页面显示时执行
onShow(() => {
  fetchItems();
});
</script>

<style scoped>
.shopping-container {
  padding: 20rpx;
}

.text-center {
  text-align: center;
}

.text-gray-500 {
  color: #6B7280;
}

.space-y-4 {
  margin-bottom: 4rpx;
}
</style>
