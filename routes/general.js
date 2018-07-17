var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/scraping')
var asc = require('../public/javascripts/asyncScraping')
var express = require('express')
var router = express.Router()
const puppeteer = require('puppeteer');
const constants = require('../public/javascripts/constants')

async function run(req, res, next) {

	let appName = decodeURIComponent(req.query.appName).split("-")[0]
	let appFullName = decodeURIComponent(req.query.appFullName)
	let pkg = req.query.package
	let store = req.query.store
	let appstore = constants[store]
	let results = []
	let bestResult = {}
	var page = {}

	try{
		if(store == "vivo" || store == "huawei" || store == "oppo"){
			res.send({
				appId: req.query.appId,
				index: appstore.index,
				store: appstore.fullName,
				storeId: req.query.storeId
			}) 
		}
		else if(appstore.async){
			page = await global.browser.newPage()
			results = await asc.getResultsList(page, appstore.searchUrl, appName, appstore.targetSelector, req.query.store)
			sc.getBestMatch(results, appName, appFullName, pkg, appstore)
				.then((r)=>{ 
					if(!r) r = {}
					page.close()
					res.send({
						appId: req.query.appId,
						index: appstore.index,
						store: appstore.fullName,
						storeId: req.query.storeId,
					...r}) 
				},(error)=>{ res.send({error:true}) })
		}
		else{
			results = await sc.getResultsList(appstore.searchUrl, appName, appstore.targetSelector, appstore.customLinksSelector)
			sc.getBestMatch(results, appName, appFullName, pkg, appstore)
				.then((r)=>{ 
					if(!r) r = {}
					res.send({
						appId: req.query.appId,
						index: appstore.index,
						store: appstore.fullName,
						storeId: req.query.storeId,
					...r}) 
				},(error)=>{ res.send({error:true}) })
		}
	}
	catch(e){
		if(appstore.async) page.close()
		res.send({error:true})
	}
}

router.get('/', function(req, res, next) { 
	run(req,res,next) 
});
module.exports = router;
