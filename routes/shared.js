var stringSimilarity = require('string-similarity')
const launchChrome = require('@serverless-chrome/lambda')
const SIMILARITY_LIMIT = 0.875

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

		if(bestResult.similarity < SIMILARITY_LIMIT) return null

		console.log(bestResult)

		if(selector){
			let downloads = await chromeless
			.goto(bestResult.href)
			.evaluate((selector) => {
				console.log("evaluating")
				return document.querySelectorAll(selector)[0].innerHTML
			},selector)
			bestResult.downloads = this.chineseToInternationalNumbers(downloads)
		}
		return bestResult
	},
	chineseToInternationalNumbers: function(text){
		var downloads = parseInt(text.replace(/[^0-9]/gi,''))
		if(text.match(/百/g)) downloads = downloads*100
		if(text.match(/千/g)) downloads = downloads*1000
		if(text.match(/万/g)) downloads = downloads*10000
		if(text.match(/亿/g)) downloads = downloads*100000000
		return downloads
	},
	numberWithCommas: function(x) {
    	var parts = x.toString().split(".");
	    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    return parts.join(".");
	},
	getDownloads: async function(chromeless,url,selector){
		await chromeless
			.goto(url)
			.wait(selector)
			.evaluate(() => {
				return document.querySelectorAll('div.det-ins-num')[0].innerHTML
			})
		return this.chineseToInternationalNumbers(chineseDownloads)
	},
}