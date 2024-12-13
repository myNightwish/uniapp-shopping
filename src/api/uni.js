// 登录函数
export function uniLogin(provider) {
  return new Promise((resolve, reject) => {
    uni.login({
      provider,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        uni.showToast({
          title: `获取${provider}登录code失败`,
          icon: "error",
          duration: 2000,
        });
        reject(err);
      },
    });
  });
}

// 文件上传函数
export function uniUploadFile(data) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      ...data,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        uni.showToast({
          title: `文件上传oss失败`,
          icon: "error",
          duration: 2000,
        });
        reject(err);
      },
    });
  });
}

export function getUserProfile() {
  return new Promise((resolve, reject) => {
    uni.getUserProfile({
      desc: '用于完善用户资料', // 用户授权信息的说明
      success: profileRes => {
        const userInfo = profileRes.userInfo;  // 用户详细信息（昵称、头像等）
        // 将 code 和用户信息发送到后端
        resolve(userInfo);
      },
      fail: err => {
        uni.showToast({
          title: '授权失败',
          icon: 'none',
        });
        reject(err);
      }
    });
  });
}

