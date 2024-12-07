<template>
  <view class="container">
    <!-- Header Section -->
    <view class="header">
      <text class="title">群名：{{ family.familyName }}</text>
      <view class="buttons">
        <button
          @click="toggleSelectionMode"
          :class="[
            'action-button',
            hasUnpurchasedItems
              ? isSelectionMode
                ? 'active'
                : 'default'
              : 'disabled'
          ]"
          :disabled="!hasUnpurchasedItems"
        >
          {{ isSelectionMode ? '标记为已购' : '批量勾选' }}
        </button>
        <button
          v-if="isSelectionMode && selectedItems.length > 0"
          @click="confirmBatchOperation"
          class="action-button confirm"
        >
          确认批量操作
        </button>
        <button
          @click="addItem"
          class="action-button add"
        >
          添加物品
        </button>
      </view>
    </view>

    <!-- Items Grid Section -->
    <view class="item-grid">
      <ShoppingItem
        v-for="item in family.items"
        :key="item.id"
        :item="item"
        :show-checkbox="isSelectionMode"
        :is-selected="selectedItems.includes(item.id)"
        @toggle-select="(itemId) => toggleItemSelection(itemId)"
      />
    </view>
  </view>
</template>

<script>
import { ref, computed } from 'vue';
import ShoppingItem from './ShoppingItem.vue';

export default {
  components: {
    ShoppingItem
  },
  props: {
    family: {
      type: Object,
      required: true
    },
    selectedItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isSelectionMode: false
    };
  },
  computed: {
    hasUnpurchasedItems() {
      return this.family.items.some(item => !item.purchased);
    }
  },
  methods: {
    toggleSelectionMode() {
      if (this.isSelectionMode) {
        // Exit selection mode
        this.isSelectionMode = false;
        this.$emit('select-all', this.family.familyId);
      } else {
        // Enter selection mode
        this.isSelectionMode = true;
      }
    },
    confirmBatchOperation() {
      this.$emit('confirm-batch', this.family.familyId);
    },
    addItem() {
      this.$emit('add-item', this.family.familyId);
    },
    toggleItemSelection(itemId) {
      this.$emit('toggle-select', {
        familyId: this.family.familyId,
        itemId
      });
    }
  }
};
</script>

<style scoped>
.container {
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.buttons {
  display: flex;
  gap: 10px;
}

.action-button {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.action-button.default {
  background-color: #007bff;
  color: white;
}

.action-button.active {
  background-color: #28a745;
  color: white;
}

.action-button.disabled {
  background-color: #6c757d;
  color: #e0e0e0;
}

.action-button.confirm {
  background-color: #dc3545;
  color: white;
}

.action-button.add {
  background-color: #6610f2;
  color: white;
}

.item-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
