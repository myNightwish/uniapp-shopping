export const userDefaultData = {
	avatarUrl: "/static/image/avatar/avatar_0.png",
	nickName: "新用户",
	province: "未知",
	birthday: "未知",
	id: "--",
};

export const provincesInChina = [
	"北京市",
	"上海市",
	"天津市",
	"重庆市",
	"河北省",
	"山西省",
	"内蒙古自治区",
	"辽宁省",
	"吉林省",
	"黑龙江省",
	"江苏省",
	"浙江省",
	"安徽省",
	"福建省",
	"江西省",
	"山东省",
	"河南省",
	"湖北省",
	"湖南省",
	"广东省",
	"广西壮族自治区",
	"海南省",
	"四川省",
	"贵省",
	"云南省",
	"西藏自治区",
	"陕西省",
	"甘肃省",
	"宁夏回族自治区",
	"青海省",
	"新疆维吾尔族自治区",
	"香港特别行政区",
	"澳门特别行政区",
	"台湾省",
	"其它",
];

export const logoUrl = "/static/logo.jpg";
export const ossHost = "https://oss.justin3go.com";
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
		path: '/pages/my/rankList?option=me',
		isTab: false
	},
	{
		icon: '/static/image/homeIcons/aboutOther.png',
		name: '关于他人',
		path: '/pages/my/rankList?option=other',
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

export const feedbackUrl = 'https://xh4u7d54le.feishu.cn/share/base/form/shrcntq0JjHrPv50gsBhU5yVRrc'
export const sourceCodeUrl = 'https://github.com/Justin3go/xiaoyou-mp'

export const wxMoney = '/static/wechatCode.jpg'

export const chatType = {
	customerChat: 0,
	chatGPT: 1
}