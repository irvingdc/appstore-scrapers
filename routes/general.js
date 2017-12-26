var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/scraping')
var asc = require('../public/javascripts/asyncScraping')
var express = require('express')
var router = express.Router()
const { Chromeless } = require('chromeless')
const constants = require('../public/javascripts/constants')

async function run(req, res, next) {

	let appName = decodeURI(req.query.appName)
	let appFullName = decodeURI(req.query.appFullName)
	console.log("SEARCHING FOR APP "+appName)
	let package = req.query.package
	let appstore = constants[req.query.store]
	let results = []
	let bestResult = {}

	if(appstore.async){
		const chromeless = new Chromeless({ remote: {
	    	endpointUrl: 'https://49hghygba8.execute-api.us-east-2.amazonaws.com/dev/',
		    apiKey: 'DNQjxLIt5A7B2UvRQsCAPaYdy08vn94z4JOyVjiE'
		}, })
		results = await asc.getResultsList(chromeless, appstore.searchUrl, appName, appstore.targetSelector, req.query.store)
		//console.log(results)
		bestResult = await asc.getBestMatch(chromeless, results, appName, appFullName, package, appstore.downloadsSelector, appstore.packageSelector, appstore.deepSearch)
			.then(async (result)=>{ 
				await chromeless.end()
				res.send(result) 
			},async (error)=>{ 
				await chromeless.end()
				res.send(error) 
			})
	}
	else{
		results = await sc.getResultsList(appstore.searchUrl, appName, appstore.targetSelector, appstore.customLinksSelector)
		//console.log(results)
		sc.getBestMatch(results, appName, appFullName, package, appstore.downloadsSelector, appstore.packageSelector, appstore.deepSearch)
			.then((result)=>{ res.send(result) },(error)=>{ res.send(error) })
	}

}

router.get('/', function(req, res, next) { run(req,res,next) });
module.exports = router;