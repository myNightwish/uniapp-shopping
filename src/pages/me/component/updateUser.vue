<template>
	<view class="update-user-container">
		<view class="one-row-card">
			<view class="left">头像</view>
			<view class="right-text">
				<image class="avatar" style="width: 50px; border-radius: 25px" mode="widthFix" :src="user.avatarUrl || userDefaultData.avatarUrl" />
			</view>
			<view class="right-icon">
				<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<uni-icons type="forward" size="30" color="#D3D3D3"></uni-icons>
				</button>
			</view>
		</view>

		<view class="one-row-card">
			<view class="left">昵称</view>
			<view class="right-text">
				<input type="text" placeholder="新用户" v-model="user.nickName" @blur="handleNickNameChange" />
			</view>
			<view class="right-icon">
				<uni-icons type="compose" size="30" color="#D3D3D3"></uni-icons>
			</view>
		</view>

		<view class="one-row-card">
			<view class="left">性别</view>
			<view class="right-text">{{ user.gender || userDefaultData.gender }}</view>
			<view class="right-icon">
				<picker mode="selector" :range="genderRange" :value="user.gender" @change="bindGenderChange">
					<uni-icons type="forward" size="30" color="#D3D3D3"></uni-icons>
				</picker>
			</view>
		</view>

		<view class="one-row-card">
			<view class="left">城市</view>
			<view class="right-text">{{ user.province || userDefaultData.province }}</view>
			<view class="right-icon">
				<picker mode="selector" :range="provinceRange" :value="user.province" @change="bindProvinceChange">
					<uni-icons type="forward" size="30" color="#D3D3D3"></uni-icons>
				</picker>
			</view>
		</view>

		<view class="one-row-card">
			<view class="left">生日</view>
			<view class="right-text">
				<view>{{ user.birthday || userDefaultData.birthday }}</view>
			</view>
			<view class="right-icon">
				<picker mode="date" :value="user.birthday" @change="bindDateChange">
					<uni-icons type="forward" size="30" color="#D3D3D3"></uni-icons>
				</picker>
			</view>
		</view>

		<view class="save" @click="save">保存修改</view>
		<view class="logout" @click="logout">退出登录</view>
	</view>
</template>

<script>
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { provincesInChina, userDefaultData } from "@/const";
import { uniUploadFile } from "@/apis/uni.api";
import { getStringWidth } from "@/utils/tools";
import { useMutation } from "villus";
import { getPostObjectParamsGQL, updateUserGQL } from "@/graphql/me.graphql";

export default {
	data() {
		return {
			user: reactive({
				avatarUrl: this.$store.state.me.avatarUrl,
				nickName: this.$store.state.me.nickName,
				gender: this.$store.state.me.gender,
				province: this.$store.state.me.province,
				birthday: this.$store.state.me.birthday,
			}),
			genderRange: ["男", "女", "其他"],
			provinceRange: provincesInChina,
		};
	},
	methods: {
		onChooseAvatar(e) {
			this.user.avatarUrl = e.detail.avatarUrl;
		},
		handleNickNameChange(e) {
			this.user.nickName = e.detail.value;
		},
		bindGenderChange(e) {
			this.user.gender = this.genderRange[e.detail.value];
		},
		bindProvinceChange(e) {
			this.user.province = this.provinceRange[e.detail.value];
		},
		bindDateChange(e) {
			this.user.birthday = e.detail.value;
		},
		async save() {
			const len = getStringWidth(this.user.nickName);
			if (len > 10 || len === 0) {
				uni.showToast({
					title: "昵称长度错误",
					icon: "error",
					duration: 2000,
				});
				throw new Error("昵称长度错误");
			}

			if (this.$store.state.me.avatarUrl !== this.user.avatarUrl) {
				const ossAvatarUrl = await this.uploadAvatar(this.user.avatarUrl);
				this.user.avatarUrl = ossAvatarUrl;
			}

			const userParams = {};
			Object.entries(this.user).forEach(([key, val]) => {
				if (this.$store.state.me[key] !== val) {
					userParams[key] = val;
				}
			});

			const { execute } = useMutation(updateUserGQL);
			const { error, data } = await execute({ data: userParams });

			if (error) {
				uni.showToast({
					title: `保存修改失败`,
					icon: "error",
					duration: 2000,
				});
				throw new Error(`保存修改失败: ${error}`);
			}
			this.$store.commit("setUser", { ...this.$store.state.me, ...this.user });
			uni.navigateBack({ delta: 1 });
		},
		async uploadAvatar(filePath) {
			const { execute } = useMutation(getPostObjectParamsGQL);
			const { error, data } = await execute();
			if (error) {
				uni.showToast({
					title: `上传头像失败`,
					icon: "error",
					duration: 2000,
				});
				throw new Error(`上传头像失败: ${error}`);
			}

			const { OSSAccessKeyId, policy, signature } = data?.getPostObjectParams || {};
			const imgType = filePath.split(".").pop();
			const key = `wxmp/${this.$store.state.me.id}/${new Date().getTime()}.${imgType}`;
			const ossRes = await uniUploadFile({
				url: "https://oss_host_url",
				filePath,
				name: "file",
				formData: {
					key,
					policy,
					OSSAccessKeyId,
					signature,
				},
			});
			uni.hideLoading();
			return `https://oss_host_url/${key}`;
		},
		logout() {
			// Implement logout logic
		},
	},
};
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
