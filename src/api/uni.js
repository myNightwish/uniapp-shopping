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

