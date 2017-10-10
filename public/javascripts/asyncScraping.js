const stringSimilarity = require('string-similarity')
const fn = require('./shared')
const launchChrome = require('@serverless-chrome/lambda')
const WebRequest = require('web-request')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

const SIMILARITY_LIMIT = 0.82

module.exports = {
	startChrome: function() {
		return Promise.resolve().then(() => {
			return launchChrome({
    			flags:  ['--window-size=1200,800', '--disable-gpu', '--headless', '--disable-images']
			}).then(function(chrome) {
				return chrome;
			});
		});
	},
	getResultsList: async function(chromeless,url,search,selector){
		let links = await chromeless
	    .goto(url+search)
	    .wait(selector)
		.evaluate((selector) => {
		    const links = [].map.call(
		      document.querySelectorAll(selector),
		      a => ({text: a.innerText, href: a.href})
		    )
		    return links
		},selector)
		return links
	},
	getBestMatch: async function(chromeless,results,search,selector){
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
			let downloads = await chromeless
			.goto(bestResult.href)
			.evaluate((selector) => {
				console.log("evaluating")
				return document.querySelectorAll(selector)[0].innerHTML
			},selector)
			bestResult.downloads = fn.chineseToInternationalNumbers(downloads)
		}
		return bestResult
	},
}