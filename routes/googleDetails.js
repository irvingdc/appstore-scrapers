var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/scraping')
var express = require('express')
const WebRequest = require('web-request')
var router = express.Router()

async function run(req, res, next) {
	console.log(decodeURI(req.query.url))
	let html = await WebRequest.get(decodeURI(req.query.url)+"&hl=en")
	let doc = sc.createDocument(html.content)

	res.send({
		email: ((doc)=>{ 
			console.log(doc.querySelectorAll("a.dev-link"))
			let result
			doc.querySelectorAll("a.dev-link").forEach(it=>{ if(it.innerHTML.toLowerCase().includes("email")) result = it })
			return result ? result.getAttribute("href").split(":")[1] : null
		})(doc),
		url: decodeURI(req.query.url),
		package: decodeURI(req.query.url).split("id=")[1],
		name: doc.querySelector(".id-app-title").innerHTML,
		installs: doc.querySelector("[itemprop=numDownloads]").innerHTML,
		score: doc.querySelector(".score") ? parseFloat(doc.querySelector(".score").innerHTML) : null,
		company: doc.querySelector("a.document-subtitle.primary > span").innerHTML,
		website: ((doc)=>{ 
			let result
			doc.querySelectorAll("a.dev-link").forEach(it=>{ if(it.innerHTML.toLowerCase().includes("website")) result = it })
			return result ? result.getAttribute('href').split("google.com/url?q=")[1] : null
		})(doc),
		reviews: doc.querySelector(".reviews-num") ? parseInt(doc.querySelector(".reviews-num").innerHTML.replace(",","").replace(".","")) : null,
		category: doc.querySelector("a.document-subtitle.category > span").innerHTML
	})

}

router.get('/', function(req, res, next) { run(req,res,next) })
module.exports = router