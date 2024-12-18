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
				<input type="nickname" placeholder="新用户"
					v-model="user.nickName"
					@blur="handleNickNameChange"
					@input="handleNickNameChange"
				/>
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
import {getOosConfig} from '@/api/oos.js';
import {updateUserInfo} from '@/api/user.js';

const meStore = useAuthStore();
const user = reactive(JSON.parse(JSON.stringify(meStore.user || {})));

function onChooseAvatar(e) {
  user.avatarUrl = e.detail.avatarUrl;
}

function handleNickNameChange(e) {
	if(user.nickName === e.detail.value) return;
  user.nickName = e.detail.value;
}

async function save() {
	const oldUser = meStore.user || {};
	if(oldUser?.avatarUrl === user.avatarUrl
	&& user.nickName === oldUser.nickName) {
		return;
	}
  const len = getStringWidth(user.nickName);
  
  if (len > 20 || len === 0) {
    uni.showToast({
      title: "昵称过长，请修改",
      icon: "error",
      duration: 2000,
    });
    throw new Error("昵称长度错误");
  }

  if (oldUser?.avatarUrl !== user.avatarUrl) {
    // 模拟头像上传（返回静态的头像 URL）
    user.avatarUrl = await uploadAvatar(user.avatarUrl);
  }

  // 用户更新参数
  const userParams = {};
  Object.entries(user).forEach(([key, val]) => {
    if (isValidKey(key, oldUser)) {
      if (oldUser[key] !== val) {
        userParams[key] = val;
      }
    }
  });
	// 3. 调用服务端接口更新用户信息
  const res = await updateUserInfo(userParams);
  if (res.success && res.data) {
    uni.showToast({
      title: '更新成功',
      icon: 'success',
    });
		meStore.$patch({ user: res.data });
		uni.navigateBack({
			delta: 1,
		});
  } else {
    uni.showToast({
      title: `更新失败：${res.data.message}`,
      icon: 'error',
    });
    throw new Error(res.data.message);
  }
}

async function uploadAvatar(filePath) {
  // 1. 获取上传参数
	const response =await getOosConfig();
  const { OSSAccessKeyId, policy, signature } = response;

		// 2. 上传文件至阿里云 OSS
		const key = `user-avatars/${Date.now()}.${filePath.split('.').pop()}`;
		const ossRes = await uniUploadFile({
			url: ossHost,
			filePath,
			name: 'file',
			formData: {
				key,
				policy,
				OSSAccessKeyId,
				signature,
			},
		});
		if (ossRes.statusCode === 204) {
			return ossHost + `/${key}`;
		} else {
			throw new Error('上传失败');
		}
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
