<template>
	<view class="update-user-container">
		<one-row-card>
			<template #left>头像</template>
			<template #rightText>
				<image
					class="avatar"
					style="width: 50px; border-radius: 25px"
					mode="widthFix"
					:src="user.avatarUrl || userDefaultData.avatarUrl"
				></image>
			</template>
			<template #rightIcon>
				<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<uni-icons type="forward" size="30" color="#D3D3D3"></uni-icons>
				</button>
			</template>
		</one-row-card>

		<one-row-card :right-text-width="'60px'">
			<template #left>昵称</template>
			<template #rightText>
				<input type="nickname" placeholder="新用户" v-model="user.nickName" @blur="handleNickNameChange" />
			</template>
			<template #rightIcon>
				<uni-icons type="compose" size="30" color="#D3D3D3"></uni-icons>
			</template>
		</one-row-card>
		<view class="save" @click="save"> 保存修改 </view>
		<view class="logout" @click="logout"> 退出登录 </view>
	</view>
</template>
<script setup>
import oneRowCard from "@/components/common/oneRowCard.vue";
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { ossHost, userDefaultData } from "@/const";
import { uniUploadFile } from "@/api/uni.js";
import { isValidKey } from "@/utils/tools";
import { getStringWidth } from "@/utils/tools";
import UniIcons from '@/common/uni-icons/uni-icons.vue';
const HOST_URL = "http://127.0.0.1:7001"
const meStore = useAuthStore();
const user = reactive({});

function onChooseAvatar(e) {
  user.avatarUrl = e.detail.avatarUrl;
}

function handleNickNameChange(e) {
  user.nickName = e.detail.value;
}

async function save() {
  const len = getStringWidth(user.nickName);
  
  if (len > 10 || len === 0) {
    uni.showToast({
      title: "昵称过长，请修改",
      icon: "error",
      duration: 2000,
    });
    throw new Error("昵称长度错误");
  }

  // if (meStore.user?.avatarUrl !== user.avatarUrl) {
  //   // 模拟头像上传（返回静态的头像 URL）
  //   user.avatarUrl = await uploadAvatar(user.avatarUrl);
  // }

  // 模拟用户更新参数
  // const userParams = {};
  // Object.entries(user).forEach(([key, val]) => {
  //   if (isValidKey(key, mockUserData)) {
  //     if (mockUserData[key] !== val) {
  //       userParams[key] = val;
  //     }
  //   }
  // });


  meStore.$patch({ user });
  uni.navigateBack({
    delta: 1,
  });
}

async function uploadAvatar(filePath) {
  console.log("模拟上传头像: ", filePath);
  // 模拟返回 OSS 上传后的头像 URL
  return "https://example.com/oss-avatar.jpg";
}

function logout() {
  console.log("模拟退出登录");
}
</script>

<style lang="scss" scoped>
.update-user-container {
	.save {
		color: $uni-color-primary;
		width: 100vw;
		height: 68px;
		margin-top: 20px;
		background-color: #ffffff;
		line-height: 68px;
		text-align: center;
	}

	.logout {
		color: $uni-text-color-disable;
		width: 100vw;
		height: 68px;
		background-color: transparent;
		line-height: 68px;
		text-align: center;
		font-size: 13px;
	}

	.avatar-wrapper {
		padding-left: 0;
		padding-right: 0;
		height: 50px;
		line-height: 50px;
		background-color: transparent;
		border-color: transparent;
	}

	.avatar-wrapper::after {
		border: none;
	}

	.picker-container {
		padding-right: 50px;
	}
}
</style>
