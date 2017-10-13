var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/asyncScraping')
var express = require('express')
var router = express.Router()
const { Chromeless } = require('chromeless')

async function run(req, res, next) {

	let search = req.query.search
	const chromeless = new Chromeless({ remote: true, })

	let customGetResultsList = async function(chromeless,url,search,selector){

		let detailUrl = "http://app.meizu.com/apps/public/detail?package_name="

		let links = await chromeless
	    .goto(url+search)
	    .wait(selector)
		.evaluate((selector,detailUrl) => {
		    const links = [].map.call(
		      document.querySelectorAll(selector),
		      a => ({text: a.innerText, href: detailUrl+a.getAttribute("packagename")})
		    )
		    return links
		},selector,detailUrl)
		return links
	}

	let results = await customGetResultsList(chromeless,'http://app.meizu.com/apps/public/search?keyword=',search,'a.ellipsis')
	let bestResult = await sc.getBestMatch(chromeless,results,search,'div.app_content span')
	let json = bestResult ? { link: "<a href='"+bestResult.href+"' target='_blank'>View in store</a>", downloads: bestResult.downloads ? fn.numberWithCommas(bestResult.downloads) : "RESULTS FOUND", found: "yes", downloadsFull: bestResult.downloads } : { link: null, downloads: null, found: "no", downloadsFull: null}

	await chromeless.end()
	res.send(json)

}

router.get('/', function(req, res, next) { run(req,res,next) });
module.exports = router;