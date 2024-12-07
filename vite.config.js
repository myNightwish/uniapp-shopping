import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
const path = require('path');
// https://vitejs.dev/config/
export default defineConfig({
  alias: {
    '@': path.resolve(__dirname, 'src') // 配置 @ 指向 src 目录
  },
  plugins: [
    uni(),
  ],
  compilerOptions: {
    isCustomElement: tag => tag.startsWith('uni-') // 排除以 `uni-` 开头的自定义元素
  }
})
