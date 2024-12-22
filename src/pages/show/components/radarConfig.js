export const radarOptions = {
	title: {
		text: '亲密关系雷达图',
		subtext: '伴侣关系对比',
		left: 'center'
	},
	tooltip: {
		trigger: 'axis'
	},
	legend: {
		show: true,
		position: "right",
		lineHeight: 25,
	},
	extra: {
		radar: {
			gridType: "radar",
			gridColor: "#CCCCCC",
			gridCount: 1,
			opacity: 0.2,
			max: 5,
			labelShow: true,
			border: true,
		},
	},
};