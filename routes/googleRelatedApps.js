var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/scraping')
var express = require('express')
const WebRequest = require('web-request')
var router = express.Router()

async function run(req, res, next) {

	let url = req.query.url
	let selector = '.card.apps'

	let html = await WebRequest.get(url)
	let doc = sc.createDocument(html.content)
	let results = [].map.call(
        doc.querySelectorAll(selector),
        div => ({
        		url: "https://play.google.com"+div.querySelector("a.title").getAttribute("href"),
      			name: div.querySelector("a.title").getAttribute("title"), 
      			package: div.getAttribute("data-docid"),
      		 })
	    )
	res.send(results)
}

router.get('/', function(req, res, next) { run(req,res,next) })
module.exports = router