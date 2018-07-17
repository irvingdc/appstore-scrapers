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
		let html = await WebRequest.get(url+encodeURIComponent(search))
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
		let downloads = doc.querySelector(downloadsSelector).innerHTML
		bestResult.downloads = fn.chineseToInternationalNumbers(downloads)
		bestResult.styledDownloads = fn.numberWithCommas(bestResult.downloads)
		return bestResult
	},
	getResultDetails: async function(bestResult, store){
		let html = await WebRequest.get(bestResult.href)
		let doc = this.createDocument(html.content)
		let downloads = store.downloadsSelector ? doc.querySelector(store.downloadsSelector).innerHTML : null
		let version = store.versionSelector && typeof store.versionSelector == "function" ? store.versionSelector(doc) : ""
		if(typeof version == "object"){
			if(version.length){
				version.forEach(it=>console.log(it))
			}
		}
		bestResult.version = version
		bestResult.downloads = downloads ? fn.chineseToInternationalNumbers(downloads) : null
		bestResult.styledDownloads = downloads ? fn.numberWithCommas(bestResult.downloads) : null
		return bestResult
	},
	chooseBestOption: function(bestResultByPackage, bestResultByName, bestResultByFullName){
		if(bestResultByPackage.packageSimilarity >= PACKAGE_SIMILARITY_LIMIT) 
			return bestResultByPackage
		else if(bestResultByName.nameSimilarity >= NAME_SIMILARITY_LIMIT) 
			return bestResultByName
		else if(bestResultByFullName.fullNameSimilarity >= NAME_SIMILARITY_LIMIT) 
			return bestResultByFullName
		else return null
	},
	getBestMatch: function(results, appName, appFullName, appPackage, store){
		var bestResult, bestResultByName, bestResultByFullName, bestResultByPackage, count = 0
		bestResult = bestResultByName = bestResultByFullName = bestResultByPackage = {text: "", href: "", packageSimilarity:0, nameSimilarity:0, fullNameSimilarity:0}

		return new Promise(async (resolve, reject) => {  
			if(results.length == 0) resolve(null)
	        results.forEach(async (it) => {
	        	let element
	        	if(store.deepSearch){
	        		let html = await WebRequest.get(it.href)
					element = this.createDocument(html.content)
	        	}
	        	else element = it

				it.packageFound = store.packageSelector ? store.packageSelector(element) : ""
				it.nameSimilarity = stringSimilarity.compareTwoStrings(fn.clean(it.text), fn.clean(appName))
				if(it.nameSimilarity > bestResultByName.nameSimilarity) bestResultByName = it
				it.fullNameSimilarity = stringSimilarity.compareTwoStrings(fn.clean(it.text), fn.clean(appFullName))
				if(it.fullNameSimilarity > bestResultByFullName.fullNameSimilarity) bestResultByFullName = it
				it.packageSimilarity = stringSimilarity.compareTwoStrings(fn.clean(it.packageFound), fn.clean(appPackage))
				if(it.packageSimilarity > bestResultByPackage.packageSimilarity) bestResultByPackage = it
				
				count += 1
				if(count == results.length){
					bestResult = this.chooseBestOption(bestResultByPackage, bestResultByName, bestResultByFullName)
					if((store.downloadsSelector || store.versionSelector) && bestResult != null){
						bestResult = await this.getResultDetails(bestResult, store)
					}
					if(bestResult) bestResult.text = bestResult.text.replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "")
					resolve(bestResult)
				}
			})	
	    })
	}
}