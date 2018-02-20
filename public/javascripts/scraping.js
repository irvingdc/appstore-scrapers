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
		      a => ({text: striptags(a.innerHTML), href: ( /^(http+?)(s\b|\b)(:\/\/)/.test(a.href) ? a.href : location+a.href)})
		    )
		}
		return links
	},
	createDocument: function(htmlString){
		const dom = new JSDOM(htmlString)
		return dom.window.document
	},
	getBestMatch: function(results, appName, appFullName, appPackage, downloadsSelector, packageSelector, deepSearch){

		var bestResult, bestResultByName, bestResultByFullName, bestResultByPackage, count = 0
		bestResult = bestResultByName = bestResultByFullName = bestResultByPackage = {text: "", href: "", packageSimilarity:0, nameSimilarity:0, fullNameSimilarity:0}

		return new Promise(async (resolve, reject) => {  
			if(results.length == 0) resolve(null)
	        results.forEach(async (it) => {
	        	let element
	        	if(deepSearch){
	        		let html = await WebRequest.get(it.href)
					element = this.createDocument(html.content)
	        	}
	        	else element = it

				it.packageFound = packageSelector(element)

				it.nameSimilarity = stringSimilarity.compareTwoStrings(it.text.replace(/[^a-z0-9]/gi,''), appName.replace(/[^a-z0-9]/gi,''))
				if(it.nameSimilarity > bestResultByName.nameSimilarity) bestResultByName = it

				it.fullNameSimilarity = stringSimilarity.compareTwoStrings(it.text.replace(/[^a-z0-9]/gi,''), appFullName.replace(/[^a-z0-9]/gi,''))
				if(it.fullNameSimilarity > bestResultByFullName.fullNameSimilarity) bestResultByFullName = it

				it.packageSimilarity = stringSimilarity.compareTwoStrings(it.packageFound.replace(/[^a-z0-9]/gi,''), appPackage.replace(/[^a-z0-9]/gi,''))
				if(it.packageSimilarity > bestResultByPackage.packageSimilarity) bestResultByPackage = it
				
				count += 1
				if(count == results.length){

					if(bestResultByPackage.packageSimilarity >= PACKAGE_SIMILARITY_LIMIT) 
						bestResult = bestResultByPackage
					else if(bestResultByName.nameSimilarity >= NAME_SIMILARITY_LIMIT) 
						bestResult = bestResultByName
					else if(bestResultByFullName.fullNameSimilarity >= NAME_SIMILARITY_LIMIT) 
						bestResult = bestResultByFullName
					else bestResult = null

					if(downloadsSelector && bestResult != null){
						let html = await WebRequest.get(bestResult.href)
						let doc = this.createDocument(html.content)
						let downloads = doc.querySelectorAll(downloadsSelector)[0].innerHTML
						console.log("downloads: "+downloads)
						bestResult.downloads = fn.chineseToInternationalNumbers(downloads)
						bestResult.styledDownloads = fn.numberWithCommas(bestResult.downloads)
					}

					bestResult.text = bestResult.text.replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "")

					resolve(bestResult)
				}

			})	
	    })
	}
}