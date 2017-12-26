var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/scraping')
var express = require('express')
const WebRequest = require('web-request')
var router = express.Router()

async function run(req, res, next) {
	console.log(decodeURI(req.query.url))
	let html = await WebRequest.get(decodeURI(req.query.url))
	let doc = sc.createDocument(html.content)
	let mail = doc.querySelector("a.dev-link") ? doc.querySelectorAll("a.dev-link")[1].getAttribute("href").split(":")[1] : null
	res.send(mail)

}

router.get('/', function(req, res, next) { run(req,res,next) })
module.exports = router