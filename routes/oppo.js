var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/scraping')
var express = require('express')
var router = express.Router()

async function run(req, res, next) {

	//appstore doesn't seem to have search anymore, some research about the appstore is required
	let search = req.query.search

	let results = await sc.getResultsList('http://store.oppomobile.com/search/do.html?keyword=',search,'a')
	let bestResult = await sc.getBestMatch(results,search,'div.soft_info_nums')
	let json = bestResult ? { link: "<a href='"+bestResult.href+"' target='_blank'>View in store</a>", downloads: bestResult.downloads ? fn.numberWithCommas(bestResult.downloads) : "RESULTS FOUND", found: "yes", downloadsFull: bestResult.downloads } : { link: null, downloads: null, found: "no", downloadsFull: null}

	res.send(json)

}

router.get('/', function(req, res, next) { run(req,res,next) });
module.exports = router;