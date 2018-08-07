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
		console.log("appstore:",appstore)
		console.log("url:",url)
		let html = await WebRequest.get(url)
		let doc = sc.createDocument(html.content)
		let downloads, version

		if(appstore.versionSelector && typeof appstore.versionSelector == "function") version = appstore.versionSelector(doc)

		if(typeof(appstore.downloadsSelector)=="function") downloads = appstore.downloadsSelector(doc)
		else if(doc.querySelector(appstore.downloadsSelector)) downloads = doc.querySelector(appstore.downloadsSelector).innerHTML
		return { 
			downloads: downloads ? fn.chineseToInternationalNumbers(downloads) : null,
			version: version
		}
	}
	catch(e){
		console.log("error",e)
		return { error: true }
	}
}

async function getDetailsAsync(appstore, url){
	var page
	try{
		console.log("appstore:",appstore)
		console.log("url:",url)
		page = await global.browser.newPage()
		await page.goto(url)
		if(typeof(appstore.downloadsSelector!="function")) await page.waitForSelector(appstore.downloadsSelector)

		appstore.strVersionSelector = appstore.versionSelector.toString()

		let downloads, version
		[ downloads, version ] = await page.evaluate((appstore) => {

			eval("document.versionSelector="+appstore.strVersionSelector)
			let d, v
			if(document.versionSelector && typeof document.versionSelector == "function") v = document.versionSelector(document)

			if(typeof(appstore.downloadsSelector)=="function") d = appstore.downloadsSelector(document)
			else if(document.querySelector(appstore.downloadsSelector)) d = document.querySelector(appstore.downloadsSelector).innerHTML
			return [ d, v ]

		},appstore)
		return { 
			downloads: downloads ? fn.chineseToInternationalNumbers(downloads) : null,
			version: version
		}

	}
	catch(e){
		page.close()
		console.log("error",e)
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