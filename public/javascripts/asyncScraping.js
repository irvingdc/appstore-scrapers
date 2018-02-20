const stringSimilarity = require('string-similarity')
const fn = require('./shared')
const WebRequest = require('web-request')
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const puppeteer = require('puppeteer');
var striptags = require('striptags')

const PACKAGE_SIMILARITY_LIMIT = 0.97
const NAME_SIMILARITY_LIMIT = 0.9

module.exports = {

	getResultsList: async function(page,url,search,selector,appstore){
		let location = url.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)/gm)
		let links
		if(appstore == "meizu"){
			await page.goto(url+search)
			await page.waitForSelector(selector)
			await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36")
			links = await page.evaluate(() => {
				    let links = []
					document.querySelectorAll("a.ellipsis[packageName]").forEach((it)=>{
						links.push({
							package: it.getAttribute("packageName"),
							text: it.getAttribute("title"),
							href: "http://app.meizu.com/apps/public/detail?package_name="+it.getAttribute("packageName"),
						})
					})
					return links
				})
		}
		else{
			console.log("searching url "+url+search)
			await page.goto(url+search)
			await page.waitForSelector(selector)

			links = await page.evaluate((selector) => {
			    const links = [].map.call(
			      document.querySelectorAll(selector),
			      a => ({text: a.innerText, href: a.href})
			    )
			    return links
			},selector)
		}
		return links
	},
	getBestMatch: async function(page,results, appName, appFullName, appPackage, downloadsSelector, packageSelector, deepSearch){
		var bestResult, bestResultByName, bestResultByFullName, bestResultByPackage, count = 0
		bestResult = bestResultByName = bestResultByFullName = bestResultByPackage = {text: "", href: "", packageSimilarity:0, nameSimilarity:0, fullNameSimilarity:0}

		return new Promise(async (resolve, reject) => {  
	        results.forEach(async (it) => {

	        	//TODO: implement a deep search to open all links and scrape the package name from there
	        	it.packageFound = it.deepSearch ? "" : packageSelector(it)

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

						await page.goto(bestResult.href)
						await page.waitForSelector(downloadsSelector)

						let downloads = await page.evaluate((downloadsSelector) => {
							return document.querySelector(downloadsSelector).innerHTML
						},downloadsSelector)
						bestResult.downloads = fn.chineseToInternationalNumbers(downloads)
						bestResult.styledDownloads = fn.numberWithCommas(bestResult.downloads)
					}
					resolve(bestResult)
				}
			})
		})
	},
}