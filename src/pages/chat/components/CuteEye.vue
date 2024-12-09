<template>
  <view class="cute-eye-container" :style="{ width: size + 'px', height: size + 'px' }">
    <!-- Main eye container -->
    <view class="eye-base" :style="eyeBaseStyle">
      <!-- Star decoration -->
      <view class="star-highlight" :style="starStyle">
        <view class="star-point" v-for="n in 5" :key="n"></view>
      </view>
    </view>
    <!-- Blush effect -->
    <view class="blush-effect"></view>
  </view>
</template>

<script>
export default {
  name: 'CuteEye',
  props: {
    size: {
      type: Number,
      default: 100
    }
  },
  computed: {
    eyeBaseStyle() {
      return {
        width: (this.size * 0.9) + 'px',
        height: (this.size * 0.9) + 'px'
      }
    },
    starStyle() {
      return {
        width: (this.size * 0.4) + 'px',
        height: (this.size * 0.4) + 'px'
      }
    }
  }
}
</script>

<style scoped>
.cute-eye-container {
  position: relative;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

.eye-base {
  position: absolute;
  left: 5%;
  top: 5%;
  background-color: #000;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.star-highlight {
  position: relative;
  background: white;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: twinkle 2s ease-in-out infinite;
}

.blush-effect {
  position: absolute;
  width: 120%;
  height: 40%;
  background: rgba(255, 192, 203, 0.6);
  border-radius: 50%;
  bottom: -30%;
  left: -10%;
  filter: blur(5px);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.9);
  }
}
</style>
