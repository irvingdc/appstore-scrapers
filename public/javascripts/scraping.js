var stringSimilarity = require('string-similarity')
const WebRequest = require('web-request')
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const fn = require("./shared")
var striptags = require('striptags')

const SIMILARITY_LIMIT = 0.875

module.exports = {
	getResultsList: async function(url,search,selector){
		let html = await WebRequest.get(url+search)
		let doc = this.createDocument(html.content)
		let location = url.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)/gm)

		let links = [].map.call(
		      doc.querySelectorAll(selector),
		      a => ({text: striptags(a.innerHTML), href: ( /^(http+?)(s\b|\b)(:\/\/)/.test(a.href) ? a.href : location+a.href)})
		    )
		return links
	},
	createDocument: function(htmlString){
		const dom = new JSDOM(htmlString)
		return dom.window.document
	},
	getBestMatch: async function(results,search,selector){
		var bestResult = {text: "", href: "", similarity:0}
		results.forEach(it => {
			it.similarity = stringSimilarity.compareTwoStrings(it.text.replace(/[^a-z0-9]/gi,''), search.replace(/[^a-z0-9]/gi,''))
			it.chineseSimilarity = stringSimilarity.compareTwoStrings(it.text,search)
			if(it.similarity == 0){
				if(it.chineseSimilarity > bestResult.chineseSimilarity) bestResult = it
			}
			else{
				if(it.similarity > bestResult.similarity) bestResult = it
			}
		})

		console.log(bestResult)

		if(bestResult.similarity < SIMILARITY_LIMIT) return null

		if(selector){
			let html = await WebRequest.get(bestResult.href)
			let doc = this.createDocument(html.content)
			let downloads = doc.querySelectorAll(selector)[0].innerHTML
			bestResult.downloads = fn.chineseToInternationalNumbers(downloads)
		}
		return bestResult
	}
}