var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/asyncScraping')
var express = require('express')
var router = express.Router()
const { Chromeless } = require('chromeless')

async function run(req, res, next) {

	let search = req.query.search
	const chromeless = new Chromeless({ remote: true, })

	let results = await sc.getResultsList(chromeless,'http://android.myapp.com/myapp/search.htm?kw=',search,'a.appName')
	let bestResult = await sc.getBestMatch(chromeless,results,search,'div.det-ins-num')
	let json = bestResult ? { link: "<a href='"+bestResult.href+"' target='_blank'>View in store</a>", downloads: bestResult.downloads ? fn.numberWithCommas(bestResult.downloads) : "RESULTS FOUND", found: "yes", downloadsFull: bestResult.downloads } : { link: null, downloads: null, found: "no", downloadsFull: null}

	await chromeless.end()
	res.send(json)

}

router.get('/', function(req, res, next) { run(req,res,next) });
module.exports = router;