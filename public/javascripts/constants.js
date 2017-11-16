module.exports = {
	_2345: {
		searchUrl: "http://zhushou.2345.com/index.php?c=web&d=doSearch&so=",
		targetSelector: "a",
		downloadsSelector: "div.prop span.piece",
		async: false,
	},
	_360: {
		searchUrl: "http://zhushou.360.cn/search/index/?kw=",
		targetSelector: "a",
		downloadsSelector: "span.s-3",
		async: false,
	},
	_91: {
		searchUrl: "http://apk.91.com/soft/android/search/1_5_0_0_",
		targetSelector: "a",
		downloadsSelector: "p.count span",
		async: false,
	},
	anzhi: {
		searchUrl: "http://www.anzhi.com/search.php?keyword=",
		targetSelector: "a",
		downloadsSelector: "span.spaceleft",
		async: false,
	},
	appchina: {
		searchUrl: "http://www.appchina.com/sou/",
		targetSelector: "h1.app-name a",
		downloadsSelector: null,
		async: false,
	},
	baidu: {
		searchUrl: "http://shouji.baidu.com/s?wd=",
		targetSelector: "a",
		downloadsSelector: "span.download-num",
		async: false,
	},
	cheering: {
		searchUrl: "http://apps.mycheering.com/WebPage/search_result.html?sword=",
		targetSelector: "a.lm_soft_icon",
		downloadsSelector: null,
		async: true,
	},
	himarket: {
		searchUrl: "http://apk.hiapk.com/search?key=",
		targetSelector: "a",
		downloadsSelector: "span.font14",
		async: false,
	},
	huawei: {
		searchUrl: "http://appstore.huawei.com/search/",
		targetSelector: "h4.title a",
		downloadsSelector: 'span[class="grey sub"]',
		async: false,
	},
	lenovo: {
		searchUrl: "http://www.lenovomm.com/search/index.html?q=",
		targetSelector: "a",
		downloadsSelector: "div.detailDownNum",
		async: false,
	},
	meizu: { //verify this, it may need a custom function
		searchUrl: "http://app.meizu.com/apps/public/detail?package_name=",
		targetSelector: "a",
		downloadsSelector: "a[packagename]",
		async: true,
	},
	mm: {
		searchUrl: "http://mm.10086.cn/searchapp?st=0&q=",
		targetSelector: "a",
		downloadsSelector: null,
		async: false,
	},
	oppo: {
		searchUrl: "http://store.oppomobile.com/search/do.html?keyword=",
		targetSelector: "a",
		downloadsSelector: "div.soft_info_nums",
		async: false,
	},
	pp: {
		searchUrl: "https://www.25pp.com/ios/search_app_0/",
		targetSelector: "a.app-title",
		downloadsSelector: "p.app-downs",
		async: false,
	},
	sogou: {
		searchUrl: "http://zhushou.sogou.com/apps/search.html?key=",
		targetSelector: "a[title]",
		downloadsSelector: "p.count span",
		async: false,
	},
	tencent: {
		searchUrl: "http://android.myapp.com/myapp/search.htm?kw=",
		targetSelector: "a.appName",
		downloadsSelector: "div.det-ins-num",
		async: true,
	},
	wandoujia: {
		searchUrl: "http://www.wandoujia.com/search?key=",
		targetSelector: "a",
		downloadsSelector: "i[itemprop='interactionCount']",
		async: false,
	},
	xiaomi: {
		searchUrl: "http://app.mi.com/search?keywords=",
		targetSelector: "a",
		downloadsSelector: null,
		async: false,
	},
	zol: {
		searchUrl: "http://xiazai.zol.com.cn/search?wd=",
		targetSelector: "a",
		downloadsSelector: "li.item-3 span:nth-child(2)",
		async: false,
	},
}