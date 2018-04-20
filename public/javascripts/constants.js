var striptags = require('striptags')
module.exports = {
	_2345: {
		searchUrl: "http://zhushou.2345.com/index.php?c=web&d=doSearch&so=",
		targetSelector: "a.trig:not([id])",
		downloadsSelector: null,
		async: false,
		deepSearch: true,
		packageSelector: function(doc){
			return doc.querySelector("a.Mbtn").getAttribute("packagename")
		}
	},
	_360: {
		searchUrl: "http://zhushou.360.cn/search/index/?kw=",
		targetSelector: "h3 a",
		downloadsSelector: "span.s-3",
		async: false,
		deepSearch: true,
		packageSelector: function(doc){
			let scriptContent
			doc.querySelectorAll("script").forEach((it, index)=>{
				if(it.innerHTML.includes("var detail")){
					scriptContent = it.innerHTML
				}
			})
			eval(scriptContent)
			return detail.pname
		}
	},
	anzhi: {
		searchUrl: "http://www.anzhi.com/search.php?keyword=",
		targetSelector: "span.app_name a",
		downloadsSelector: "span.spaceleft",
		async: false,
		deepSearch: false,
		packageSelector: function(el){
			return el.href.split("/").slice(-1)[0].split("_")[1].replace(".html","")
		}
	},
	appchina: {
		searchUrl: "http://www.appchina.com/sou/",
		targetSelector: "h1.app-name a",
		downloadsSelector: null,
		async: false,
		deepSearch: false,
		packageSelector: function(el){
			return el.href.split("/").slice(-1)[0]
		}
	},
	baidu: {
		searchUrl: "http://shouji.baidu.com/s?wd=",
		targetSelector: "a.app-name",
		downloadsSelector: "span.download-num",
		async: false,
		deepSearch: true,
		packageSelector: function(doc){
			return doc.querySelector("span.one-setup-btn").getAttribute("data_package")
		},
	},
	cheering: {
		searchUrl: "http://apps.mycheering.com/WebPage/search_result.html?sword=",
		targetSelector: "a.lm_soft_icon",
		downloadsSelector: null,
		async: true,
		deepSearch: false,
		packageSelector: false
	},
	eoe:{
		downloadsSelector: function(doc){
			let element = Array.from(doc.querySelectorAll(".info_appintr .clearfix em")).filter(it=>{return it.innerHTML.includes("下载次数")})
			return element ? element[0].innerHTML.split(":")[0] : null
		}
	},
	lenovo: {
		searchUrl: "http://www.lenovomm.com/search/index.html?q=",
		targetSelector: "div.appDetails a",
		downloadsSelector: "div.detailDownNum span",
		async: false,
		deepSearch: true,
		packageSelector: function(doc){
			return doc.querySelector("ul.detailTop2 a").getAttribute("data-pkgName")
		}
	},
	meizu: { //verify this, it may need a custom function
		searchUrl: "http://app.meizu.com/apps/public/search?keyword=",
		targetSelector: "a.ellipsis[packageName]",
		downloadsSelector: "div.app_content span",
		async: true,
		deepSearch: false,
		packageSelector: function(el){
			return el.package
		}
	},
	mm: {
		searchUrl: "http://mm.10086.cn/searchapp?st=0&q=",
		targetSelector: "div.info a[title]",
		downloadsSelector: null,
		async: false,
		deepSearch: false,
		packageSelector: false
	},
	pp: {
		searchUrl: "https://www.25pp.com/ios/search_app_0/",
		targetSelector: "a.app-title",
		downloadsSelector: "div.app-info div.app-downs",
		async: false,
		deepSearch: false,
		packageSelector: false
	},
	sogou: {
		searchUrl: "http://zhushou.sogou.com/apps/search.html?key=",
		targetSelector: "a[title]",
		downloadsSelector: "p.count span",
		async: false,
		deepSearch: false,
		customLinksSelector: function(doc){
			let links = []
			doc.querySelectorAll("li").forEach((it)=>{
				links.push({
					package: it.getAttribute("pkg"),
					text: striptags(it.querySelector("a").getAttribute("title")),
					href: it.querySelector("a").getAttribute("href"),
				})
			})
			return links
		},
		packageSelector: function(el){
			return el.package
		}
	},
	tencent: {
		searchUrl: "http://android.myapp.com/myapp/search.htm?kw=",
		targetSelector: "a.appName",
		downloadsSelector: "div.det-ins-num",
		async: true,
		deepSearch: false,
		packageSelector: function(el){
			return el.href.split("apkName=")[1]
		}
	},
	vivo: {
		async: false,
		downloadsSelector : function(doc){
			let element = striptags(doc.querySelector(".item-introduce-download").innerHTML).split("M")
			return element ? element[1] : null
		}
	},  
	wandoujia: {
		searchUrl: "http://www.wandoujia.com/search?key=",
		targetSelector: "h2.app-title-h2 a",
		downloadsSelector: "i[itemprop='interactionCount']",
		async: false,
		deepSearch: false,
		packageSelector: function(el){
			return el.href.split("/").slice(-1)[0]
		}
	},
	xiaomi: {
		searchUrl: "http://app.mi.com/search?keywords=",
		targetSelector: "ul.applist li h5 a",
		downloadsSelector: null,
		async: false,
		deepSearch: false,
		packageSelector: function(el){
			return el.href.split("&")[0].split("=")[1]
		}
	},
	zol: {
		searchUrl: "http://xiazai.zol.com.cn/search?wd=",
		targetSelector: "div.result-title > a",
		downloadsSelector: "li.item-3 span:nth-child(2)",
		async: false,
		deepSearch: false,
		packageSelector: false
	},
	himarket : {}, //nothing. use baidu
	_91: {}, //nothing use baidu
	oppo : {}, // nothing
	










}