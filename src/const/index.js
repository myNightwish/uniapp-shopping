export const userDefaultData = {
	avatarUrl: "/static/image/avatar/avatar_0.png",
	nickName: "新用户",
	province: "未知",
	birthday: "未知",
	id: "--",
};

export const logoUrl = "/static/logo.jpg";
export const ossHost = "https://mynightwish.oss-cn-beijing.aliyuncs.com";
export const banners = [
	"https://gd-hbimg.huaban.com/fcf6e09f17da2ec355206b468fa345d876ee7b5f17c47-2ypoiV_fw480webp",
	"https://gd-hbimg.huaban.com/43ab6070b44b2f9ed930f89d2fd47c74f30d30a94cb42-U4KHsc_fw480webp"
];
export const writerUrl = '/static/image/questionnairePage/writer.png'
export const questionnaireUrl = '/static/image/questionnairePage/questionnaire.png'
export const emptyUrl = '/static/image/noData.png'

// icons
export const homeIconsList = [
	{
		icon: '/static/image/homeIcons/questionnaireLook.png',
		name: '查看问卷',
		path: '/pages/questionnaire/index',
		isTab: true
	},
	{
		icon: '/static/image/homeIcons/aboutMe.png',
		name: '关于自己',
		path: '/pages/me/rankList?option=me',
		isTab: false
	},
	{
		icon: '/static/image/homeIcons/aboutOther.png',
		name: '关于他人',
		path: '/pages/me/rankList?option=other',
		isTab: false
	},
	{
		icon: '/static/image/homeIcons/qa.png',
		name: '心理问答',
		path: '/pages/index/chatGPT',
		isTab: false
	}
]

export const firstRank = '/static/image/list/first.png'
export const secondRank = '/static/image/list/second.png'
export const thirdRank = '/static/image/list/third.png'

export const feedbackUrl = 'https://s16lcff6dxs.feishu.cn/share/base/form/shrcn1e65mKwsG63NJB01kLbM3c'
export const wxMoney = '/static/wechatCode.jpg'

export const chatType = {
	customerChat: 0,
	chatGPT: 1
}