<template>
  <footer class="footer">
    <div class="footer-text">
      © {{ new Date().getFullYear() }} FamilyList. All rights reserved.
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* 淡白背景 */
  border-top: 1px solid #ddd;
  z-index: 10;
}

.footer-text {
  margin-bottom: 1rem;
  padding-top: 1rem;
  text-align: center;
  font-size: 0.875rem; /* 等效于 text-sm */
  color: #6b7280; /* 灰色文本 */
}

.footer.dark .footer-text {
  color: #d1d5db; /* 深色模式下的灰色文本 */
  background-color: rgba(31, 41, 55, 0.8); /* 深色模式下的背景 */
}
</style>
