<template>
  <view :class="['item-container', { 'purchased': item.purchased }]">
    <view class="item-header">
      <view class="item-info">
        <checkbox
          v-if="!item.purchased && showCheckbox"
          :value="isSelected ? [item.id] : []"
          @change="toggleSelect"
          class="checkbox"
        />
        <view>
          <text class="item-name">{{ item.name }}</text>
          <text class="item-quantity">数量: {{ item.quantity }}</text>
        </view>
      </view>
      <image v-if="item.image" :src="item.image" :alt="item.name" class="item-image" />
    </view>
    <text class="item-description">描述: {{ item.description }}</text>
  </view>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleSelect(e) {
      this.$emit('toggle-select', this.item.id);
    }
  }
};
</script>

<style scoped>
.item-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
}

.item-container.purchased {
  opacity: 0.5;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-info {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.item-name {
  font-weight: 500;
}

.item-quantity {
  font-size: 12px;
  color: #6b7280;
}

.item-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
}

.item-description {
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
}

.checkbox {
  margin-top: 2px;
}
</style>
