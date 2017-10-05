var fn = require('./shared')
var express = require('express')
var router = express.Router()
const { Chromeless } = require('chromeless')

async function run(req, res, next) {

	//redirects to http://shouji.baidu.com/, it may be down
	let search = req.query.search
	var chrome = await fn.startChrome();
	const chromeless = new Chromeless({launchChrome:false})

	let results = await fn.getResultsList(chromeless,'http://apk.91.com/soft/android/search/1_5_0_0_',search,'a')
	let bestResult = await fn.getBestMatch(chromeless,results,search,'p.count span')
	let json = bestResult ? { link: "<a href='"+bestResult.href+"' target='_blank'>View in store</a>", downloads: bestResult.downloads ? fn.numberWithCommas(bestResult.downloads) : "RESULTS FOUND", found: "yes", downloadsFull: bestResult.downloads } : { link: null, downloads: null, found: "no", downloadsFull: null}

	await chromeless.end()
	await chrome.kill()
	res.send(json)

}

router.get('/', function(req, res, next) { run(req,res,next) });
module.exports = router;