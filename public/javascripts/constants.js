var striptags = require('striptags')
var _ = require('underscore')

module.exports = {
	oppo: {
		fullName: 'Oppo Software Store',
		index: 4
	},	
	huawei: {
		fullName: 'Huawei App Market',
		index: 5
	},
	vivo: {
		fullName: 'VIVO App Store',
		index: 7
	},
	_2345: {
		searchUrl: "http://zhushou.2345.com/index.php?c=web&d=doSearch&so=",
		targetSelector: "a.trig:not([id])",
		downloadsSelector: null,
		async: false,
		deepSearch: true,
		packageSelector: function(doc){
			return doc.querySelector("a.Mbtn").getAttribute("packagename")
		},
		versionSelector: function(doc){
			let rows = Array.from(doc.querySelectorAll(".softIntro_part .prop_area li"))
			let element = rows && rows.length ? rows.find(it=>striptags(it.innerHTML).includes("版本")) : null
			return element ? striptags(element.innerHTML).replace(/[\u3400-\u9FBF()：:;& a-zA-Z]/g,'') : "" 
		}
	},
	_360: {
		fullName: '360 Mobile Assistant',
		searchUrl: "http://zhushou.360.cn/search/index/?kw=",
		targetSelector: "h3 a",
		downloadsSelector: "span.s-3",
		async: false,
		index: 2,
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
		},
		versionSelector: function(doc){
			let rows = Array.from(doc.querySelectorAll("div.base-info td"))
			let element = rows && rows.length ? rows.find(it=>striptags(it.innerHTML).includes("版本")) : null
			return element ? striptags(element.innerHTML).replace(/[\u3400-\u9FBF()：:;& a-zA-Z]/g,'') : "" 
		}

	},
	anzhi: {
		fullName: 'Anzhi',
		searchUrl: "http://www.anzhi.com/search.php?keyword=",
		targetSelector: "span.app_name a",
		downloadsSelector: "span.spaceleft",
		async: false,
		index: 10,
		deepSearch: false,
		packageSelector: function(el){
			return el.href.split("/").slice(-1)[0].split("_")[1].replace(".html","")
		},
		versionSelector: function(doc){
			let el = doc.querySelector(".app_detail_version")
			return el && el.innerHTML ? el.innerHTML.replace(/[\u3400-\u9FBF()：:;& a-zA-Z]/g,"") : ""
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
		},
		versionSelector: function(doc){
			let rows = Array.from(doc.querySelectorAll(".intro .art-content"))
			let element = rows && rows.length ? rows.find(it=>striptags(it.innerHTML).includes("版本")) : null
			return element ? striptags(element.innerHTML).replace(/[\u3400-\u9FBF()：:;& a-zA-Z]/g,'') : "" 
		}
	},
	baidu: {
		fullName: 'Baidu Mobile Assistant',
		searchUrl: "http://shouji.baidu.com/s?wd=",
		targetSelector: "a.app-name",
		downloadsSelector: "span.download-num",
		async: false,
		index: 3,
		deepSearch: true,
		packageSelector: function(doc){
			return doc.querySelector("span.one-setup-btn").getAttribute("data_package")
		},
		versionSelector: function(doc){
			let element = doc.querySelector("div.detail span.version")
			return element && element.innerHTML ? element.innerHTML.replace(/[\u3400-\u9FBF()：:;& a-zA-Z]/g,"") : ""
		}
	},
	cheering: {
		searchUrl: "http://apps.mycheering.com/WebPage/search_result.html?sword=",
		targetSelector: "a.lm_soft_icon",
		downloadsSelector: null,
		async: true,
		deepSearch: false,
		packageSelector: false,
		versionSelector: function(doc){
			let list = Array.from(doc.querySelectorAll(".sdmr_info li"))
			let index = list && list.length ? list.findIndex(it=>it.innerHTML ? _.unescape(it.innerHTML).includes("版本") : false) : null
			return index && list[index] && list[index].innerHTML ? list[index].querySelector("span:last-child").innerHTML.replace(/[\u3400-\u9FBF()：:;& a-zA-Z]/g,"") || "" : ""
		}
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
		},
		versionSelector: function(doc){
			let rows = Array.from(doc.querySelectorAll("f12 fgrey4 txtCut"))
			let element = rows && rows.length ? rows.find(it=>striptags(it.innerHTML).includes("版本")) : null
			return element ? striptags(element.innerHTML).replace(/[\u3400-\u9FBF()：:;& a-zA-Z]/g,'') : "" 
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
		},
		versionSelector: function(doc){
			let el = doc.querySelector(".app_download ul .noPointer")
			return el ? el.innerHTML : ""
		}
	},
	mm: {
		searchUrl: "http://mm.10086.cn/searchapp?st=0&q=",
		targetSelector: "div.info a[title]",
		downloadsSelector: null,
		async: false,
		deepSearch: false,
		packageSelector: false,
		versionSelector: function(doc){
			let rows = Array.from(doc.querySelectorAll(".tor_msg_ealine"))
			let element = rows && rows.length ? rows.find(it=>_.unescape(striptags(it.innerHTML)).includes("版本")) : null
			return element ? _.unescape(striptags(element.innerHTML)).replace(/[\u3400-\u9FBF()：:;& a-zA-Z]/g,'') : "" 
		}
	},
	pp: {
		fullName: 'PP',
		searchUrl: "https://www.25pp.com/ios/search_app_0/",
		targetSelector: "a.app-title",
		downloadsSelector: "div.app-info div.app-downs",
		async: false,
		index: 8,
		deepSearch: false,
		packageSelector: false,
		versionSelector: function(doc){
			let list = doc.querySelectorAll(".app-detail-info span strong")
			let el = list && list.length ? list[2] : null
			return el && el.innerHTML ? el.innerHTML.trim() : ""
		}
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
		},
		versionSelector: function(doc){
			let rows = Array.from(doc.querySelectorAll(".appinfo .detail .info td"))
			let element = rows && rows.length ? rows.find(it=>striptags(it.innerHTML).includes("版本")) : null
			return element ? striptags(element.innerHTML).replace(/[\u3400-\u9FBF()：:;& a-zA-Z]/g,'') : "" 
		}
	},
	tencent: {
		fullName: 'Tencent MyApp',
		searchUrl: "http://android.myapp.com/myapp/search.htm?kw=",
		targetSelector: "a.appName",
		downloadsSelector: "div.det-ins-num",
		async: true,
		index: 1,
		deepSearch: false,
		packageSelector: function(el){
			return el.href.split("apkName=")[1]
		},
		versionSelector: function(doc){
			let list = Array.from(doc.querySelectorAll(".det-othinfo-container div"))
			let index = list && list.length ? list.findIndex(it=>it.innerHTML ? it.innerHTML.includes("版本号") : false) + 1 : null
			return index && list[index] && list[index].innerHTML ? list[index].innerHTML.replace(/[\u3400-\u9FBF()：:;& a-zA-Z]/g,"") || "" : ""
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
		fullName: 'Wandoujia',
		searchUrl: "http://www.wandoujia.com/search?key=",
		targetSelector: "h2.app-title-h2 a",
		downloadsSelector: "i[itemprop='interactionCount']",
		async: false,
		index: 9,
		deepSearch: false,
		packageSelector: function(el){
			return el.href.split("/").slice(-1)[0]
		},
		versionSelector: function(doc){
			let block = doc.querySelector(".infos-list")
			let list = block && block.childNodes ? Array.from(block.childNodes) : null
			let index = list && list.length ? list.findIndex(it=>it.innerHTML ? it.innerHTML.includes("版本") : false) + 1 : null
			return index && list[index] && list[index].innerHTML ? list[index].innerHTML.replace(/[\u3400-\u9FBF()：:;& a-zA-Z]/g,"") || "" : ""
		}
	},
	xiaomi: {
		fullName: 'MIUI App Store',
		searchUrl: "http://app.mi.com/search?keywords=",
		targetSelector: "ul.applist li h5 a",
		downloadsSelector: null,
		async: false,
		index: 6,
		deepSearch: false,
		packageSelector: function(el){
			return el.href.split("&")[0].split("=")[1]
		},
		versionSelector: function(doc){
			let list = Array.from(doc.querySelectorAll("div.details li"))
			let index = list && list.length ? list.findIndex(it=>it.innerHTML ? it.innerHTML.includes("版本号") : false) + 1 : null
			return index && list[index] ? list[index].innerHTML || "" : ""
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
}
