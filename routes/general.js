var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/scraping')
var express = require('express')
var router = express.Router()

async function run(req, res, next) {

	let app = req.query.app

	let results = await sc.getResultsList('https://play.google.com/store/search?q=', app, '.card.apps')
	
	res.send(results)

}

router.get('/', function(req, res, next) { run(req,res,next) });
module.exports = router;