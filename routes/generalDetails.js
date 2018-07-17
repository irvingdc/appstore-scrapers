var express = require('express')
var router = express.Router()
const constants = require('../public/javascripts/constants')
const WebRequest = require('web-request')
var sc = require('../public/javascripts/scraping')
var fn = require('../public/javascripts/shared')
const puppeteer = require('puppeteer')

async function run(req, res, next) {
	console.log("GETTING STORE "+req.query.store)
	let appstore = constants[req.query.store.toLowerCase()] || constants["_"+req.query.store.toLowerCase()]
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
		return { downloads: downloads ? fn.chineseToInternationalNumbers(downloads) : null }
	}
	catch(e){
		return { error: true }
	}
}

async function getDetailsAsync(appstore, url){
	var page
	try{
		page = await global.browser.newPage()
		await page.goto(url)
		if(typeof(appstore.downloadsSelector!="function")) await page.waitForSelector(appstore.downloadsSelector)
		let downloads = await page.evaluate((appstore) => {
			let downloads
			if(typeof(appstore.downloadsSelector)=="function") downloads = appstore.downloadsSelector(document)
			else if(document.querySelector(appstore.downloadsSelector)) downloads = document.querySelector(appstore.downloadsSelector).innerHTML
			return downloads
		},appstore)
		return { downloads: downloads ? fn.chineseToInternationalNumbers(downloads) : null }

	}
	catch(e){
		page.close()
		return { error: true }
	}
}

router.get('/', async (req, res, next) => { 
	let result = await run(req,res,next)
	res.send({
		...result, 
		storeId: req.query.storeId, 
		appId: req.query.appId
	})
})

module.exports = router