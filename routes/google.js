var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/scraping')
var express = require('express')
const WebRequest = require('web-request')
var router = express.Router()
const NUMBER_GOOGLE_RESULTS = 6

async function run(req, res, next) {

	let url = 'https://play.google.com/store/search?hl=en&q='+encodeURIComponent(req.query.appName)
	console.log("google url:",url)
	let selector = '.card.apps'

	try{
		let html = await WebRequest.get(url)
		let doc = sc.createDocument(html.content)
		let results = [].map.call(
	        doc.querySelectorAll(selector),
	        div => ({
	        		url: "https://play.google.com"+div.querySelector("a.title").getAttribute("href"),
	      			img: div.querySelector("img").getAttribute("src").includes("http") ? div.querySelector("img").getAttribute("src") : "http:"+div.querySelector("img").getAttribute("src"), 
	      			company: div.querySelector("a.subtitle").getAttribute("title"),
	      			name: div.querySelector("a.title").getAttribute("title"), 
	      			package: div.getAttribute("data-docid"),
	      		 })
		    ).slice(0, NUMBER_GOOGLE_RESULTS)
		
		//TODO: refactor this code to use promises and await/async properly
		var count = 0
		results.forEach(async (it, index) => {
			it.imageData = await fn.getImageData(it.img)
			count += 1
			if(count == results.length) res.send(results)
		})
	}
	catch(e){
		res.send({error:true})
	}
}

router.get('/', function(req, res, next) { run(req,res,next) })
module.exports = router