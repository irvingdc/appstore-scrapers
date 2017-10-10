var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/scraping')
var express = require('express')
var router = express.Router()

async function run(req, res, next) {

	let search = req.query.search

	let results = await sc.getResultsList('http://appstore.huawei.com/search/',search,'h4.title a')
	let bestResult = await sc.getBestMatch(results,search,'span[class="grey sub"]')
	let json = bestResult ? { link: "<a href='"+bestResult.href+"' target='_blank'>View in store</a>", downloads: bestResult.downloads ? fn.numberWithCommas(bestResult.downloads) : "RESULTS FOUND", found: "yes", downloadsFull: bestResult.downloads } : { link: null, downloads: null, found: "no", downloadsFull: null}

	res.send(json)

}

router.get('/', function(req, res, next) { run(req,res,next) });
module.exports = router;