
export function getNews() {
	const news = uni.getStorageSync("news");
	if (!news) return [];
	else return JSON.parse(news);
}

export function setNews(value) {
	return uni.setStorageSync("news", JSON.stringify(value));
}
