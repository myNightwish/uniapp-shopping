<template>
  <view class="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <view class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <text class="text-lg font-medium mb-4">添加新物品</text>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <view>
          <text class="block text-sm font-medium mb-1">物品名称</text>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-3 py-2 border rounded-lg"
            required
          />
        </view>
        <view>
          <text class="block text-sm font-medium mb-1">数量</text>
          <input
            v-model.number="form.quantity"
            type="number"
            min="1"
            class="w-full px-3 py-2 border rounded-lg"
            required
          />
        </view>
        <view>
          <text class="block text-sm font-medium mb-1">描述</text>
          <textarea
            v-model="form.description"
            class="w-full px-3 py-2 border rounded-lg"
            rows="3"
          ></textarea>
        </view>
        <view>
          <text class="block text-sm font-medium mb-1">图片链接</text>
          <input
            v-model="form.image"
            type="url"
            class="w-full px-3 py-2 border rounded-lg"
          />
        </view>
        <view class="flex justify-end space-x-4">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            添加
          </button>
        </view>
      </form>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    families: {
      type: Array,
      required: true
    },
    curFamilyId: {
      type: Number,  // 如果确实是数字类型，可以去掉注释
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        familyId: 0,
        quantity: 1,
        description: '',
        image: ''
      }
    };
  },
  watch: {
    curFamilyId(newFamilyId) {
      this.form.familyId = newFamilyId;
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleSubmit() {
      this.$emit('add-item', { ...this.form });
    }
  }
};
</script>

<style scoped>
.fixed {
  position: fixed;
}

.z-50 {
  z-index: 50;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.bg-black {
  background-color: rgba(0, 0, 0, 0.5);
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.bg-white {
  background-color: #ffffff;
}

.dark:bg-gray-800 {
  background-color: #2d2d2d;
}

.rounded-lg {
  border-radius: 8px;
}

.p-6 {
  padding: 16px;
}

.w-full {
  width: 100%;
}

.max-w-md {
  max-width: 500px;
}

.text-lg {
  font-size: 1.125rem;
}

.font-medium {
  font-weight: 500;
}

.mb-4 {
  margin-bottom: 1rem;
}

.space-y-4 {
  margin-bottom: 1rem;
}

.block {
  display: block;
}

.text-sm {
  font-size: 0.875rem;
}

.font-medium {
  font-weight: 500;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.px-3 {
  padding-left: 12px;
  padding-right: 12px;
}

.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}

.border {
  border: 1px solid #ddd;
}

.rounded-lg {
  border-radius: 8px;
}

.rows-3 {
  height: auto;
  min-height: 72px;
}

.bg-indigo-600 {
  background-color: #5c6bc0;
}

.text-white {
  color: white;
}

.rounded-lg {
  border-radius: 8px;
}

.hover:bg-indigo-700:hover {
  background-color: #3949ab;
}

.text-gray-600 {
  color: #4b4b4b;
}

.hover:text-gray-800:hover {
  color: #2e2e2e;
}
</style>
