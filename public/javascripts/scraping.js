var stringSimilarity = require('string-similarity')
const WebRequest = require('web-request')
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const fn = require("./shared")
var striptags = require('striptags')

const PACKAGE_SIMILARITY_LIMIT = 0.97
const NAME_SIMILARITY_LIMIT = 0.9

module.exports = {
	getResultsList: async function(url,search,selector, customLinksSelector = null){
		console.log("searching..."+url+encodeURI(search))
		let html = await WebRequest.get(url+encodeURI(search))
		let doc = this.createDocument(html.content)
		let location = url.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)/gm)
		let links
		if(customLinksSelector) links = customLinksSelector(doc)
		else{
			links = [].map.call(
		      doc.querySelectorAll(selector),
		      a => ({text: striptags(a.innerHTML).replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, ""), href: ( /^(http+?)(s\b|\b)(:\/\/)/.test(a.href) ? a.href : location+a.href)})
		    )
		}
		return links
	},
	createDocument: function(htmlString){
		const dom = new JSDOM(htmlString)
		return dom.window.document
	},
	setDownloads: async function(bestResult, downloadsSelector){
		let html = await WebRequest.get(bestResult.href)
		let doc = this.createDocument(html.content)
		let downloads = doc.querySelectorAll(downloadsSelector)[0].innerHTML
		console.log("downloads: "+downloads)
		bestResult.downloads = fn.chineseToInternationalNumbers(downloads)
		bestResult.styledDownloads = fn.numberWithCommas(bestResult.downloads)
		return bestResult
	},
	getBestMatch: function(results, appName, appFullName, appPackage, downloadsSelector, packageSelector, deepSearch){
		var bestResult = {text: "", href: "", similarity:0}, count = 0, sim1 = 0, sim2 = 0
		return new Promise(async (resolve, reject) => {  
			if(results.length == 0) resolve(null)
	        results.forEach(async (it) => {
	        	let element
	        	if(deepSearch){
	        		let html = await WebRequest.get(it.href)
					element = this.createDocument(html.content)
	        	}
	        	else element = it
	        	count += 1
	        	if(packageSelector){
					it.packageFound = packageSelector(element)
					it.similarity = stringSimilarity.compareTwoStrings(it.packageFound, appPackage)
					if(it.similarity > bestResult.similarity) bestResult = it
					if(count == results.length && bestResult.similarity < PACKAGE_SIMILARITY_LIMIT) bestResult = null
				}
				else{
					if (fn.isChineseText(it.text)) {
						it.similarity = fn.getChineseSimilarity(it.text, appFullName)
					}
					else{
						sim1 = stringSimilarity.compareTwoStrings(it.text, appFullName)
						sim2 = stringSimilarity.compareTwoStrings(it.text, appName)
						it.similarity = sim1 > sim2 ? sim1 : sim2
					}
					if(it.similarity > bestResult.similarity) bestResult = it
					if(count == results.length && bestResult.similarity < NAME_SIMILARITY_LIMIT) bestResult = null
				}
				console.log(bestResult)
				if(count == results.length){
					if(downloadsSelector && bestResult != null) bestResult = await this.setDownloads(bestResult, downloadsSelector)
					resolve(bestResult)
				}
			})	
	    })
	}
}