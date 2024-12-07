<template>
  <view class="fixed-overlay">
    <view class="dialog">
      <text class="dialog-title">确认操作</text>
      <text class="dialog-message">{{ message }}</text>
      <view class="button-group">
        <button class="cancel-button" @click="handleCancel">取消</button>
        <button class="confirm-button" @click="handleConfirm">确认</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm');
    },
    handleCancel() {
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>
.fixed-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 320px;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.dialog-message {
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.cancel-button,
.confirm-button {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.cancel-button {
  background-color: #e0e0e0;
  color: #333;
}

.confirm-button {
  background-color: #f44336;
  color: white;
}

.confirm-button:hover {
  background-color: #d32f2f;
}
</style>
