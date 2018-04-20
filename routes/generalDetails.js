var express = require('express')
var router = express.Router()
const constants = require('../public/javascripts/constants')
const WebRequest = require('web-request')
var sc = require('../public/javascripts/scraping')
var fn = require('../public/javascripts/shared')
const puppeteer = require('puppeteer')

async function run(req, res, next) {
	let appstore = constants[req.query.store]
	let url = req.query.url
	console.log("getting "+(()=>{return appstore.async ? "async" : "regular"})()+" url: "+url)
	return appstore.async ? await getDetailsAsync(appstore, url) : await getDetails(appstore, url)
}

async function getDetails(appstore, url){
	try{
		let html = await WebRequest.get(url)
		let doc = sc.createDocument(html.content)
		let downloads
		if(typeof(appstore.downloadsSelector)=="function") downloads = appstore.downloadsSelector(doc)
		else if(doc.querySelector(appstore.downloadsSelector)) downloads = doc.querySelector(appstore.downloadsSelector).innerHTML
		return { downloads: downloads ? fn.chineseToInternationalNumbers(downloads) : undefined }
		//return doc
	}
	catch(e){
		console.log("-- ERROR --> ",e)
		return {}
	}
}

async function getDetailsAsync(appstore, url){
	var page
	try{
		page = await global.browser.newPage()
		console.log("opening new page")
		// await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36")
		await page.goto(url)
		console.log("waiting")
		if(typeof(appstore.downloadsSelector!="function")) await page.waitForSelector(appstore.downloadsSelector)
		console.log("finished waiting")
		let result = await page.evaluate((appstore) => {
			let downloads
			if(typeof(appstore.downloadsSelector)=="function") downloads = appstore.downloadsSelector(document)
			else if(document.querySelector(appstore.downloadsSelector)) downloads = document.querySelector(appstore.downloadsSelector).innerHTML
			return document.documentElement.innerHTML
		},appstore)
		return result//{ downloads : result ? fn.chineseToInternationalNumbers(result) : undefined }

	}
	catch(e){
		console.log("-- ERROR --> ",e)
		page.close()
		return {}
	}
}

router.get('/', async (req, res, next) => { 
	let result = await run(req,res,next)
	res.send(result)
})

module.exports = router