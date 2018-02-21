var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/scraping')
var asc = require('../public/javascripts/asyncScraping')
var express = require('express')
var router = express.Router()
const puppeteer = require('puppeteer');
const constants = require('../public/javascripts/constants')

async function run(req, res, next) {

	let appName = decodeURI(req.query.appName).split("-")[0]
	let appFullName = decodeURI(req.query.appFullName)
	console.log("SEARCHING FOR APP "+appName)
	let package = req.query.package
	let appstore = constants[req.query.store]
	let results = []
	let bestResult = {}
	var browser

	try{
		if(appstore.async){
			browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox']});
			const page = await browser.newPage();
			console.log("puppeteer initialized")

			results = await asc.getResultsList(page, appstore.searchUrl, appName, appstore.targetSelector, req.query.store)
			console.log(results)
			await asc.getBestMatch(page, results, appName, appFullName, package, appstore.downloadsSelector, appstore.packageSelector, appstore.deepSearch)
				.then(async (r)=>{ 
					browser.close();
					if(r) r.storeId = req.query.storeId
					res.send(r) 
				},async (error)=>{ 
					browser.close();
					res.send(error) 
				})
		}
		else{
			results = await sc.getResultsList(appstore.searchUrl, appName, appstore.targetSelector, appstore.customLinksSelector)
			console.log(results)
			sc.getBestMatch(results, appName, appFullName, package, appstore.downloadsSelector, appstore.packageSelector, appstore.deepSearch)
				.then((r)=>{ 
					console.log(r)
					if(r) r.storeId = req.query.storeId
					res.send(r) 
				},(error)=>{ res.send(error) })
		}
	}
	catch(e){
		if(appstore.async) browser.close()
		console.log("----------------------------------- Error -----------------------------------")
		console.log(e)
		console.log("----------------------------------- Error -----------------------------------")
		res.send({error:true})
	}

		

}

router.get('/', function(req, res, next) { 
	run(req,res,next) 
});
module.exports = router;