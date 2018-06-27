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
							text: it.getAttribute("title").replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, ""),
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
			      a => ({text: a.innerText.replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, ""), href: a.href})
			    )
			    return links
			},selector)
		}
		return links
	}
}