var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/scraping')
var express = require('express')
const WebRequest = require('web-request')
var router = express.Router()
var striptags = require('striptags')

async function run(req, res, next) {
	console.log(decodeURI(req.query.url))
	let html
	try{
		html = await WebRequest.get(decodeURI(req.query.url)+"&hl=en")
	}
	catch(e){
		res.send({error:true})
		return null
	}
	let doc = sc.createDocument(html.content)
	let showImage = req.query.showImage
	var details = {
		email: ((doc)=>{ 
			let result = Array.from(doc.querySelectorAll("a")).find(it=>{ return it.href.toLowerCase().includes("mailto") })
			return result ? result.getAttribute("href").split(":")[1] : ""
		})(doc),
		appId : req.query.appId,
		url: decodeURI(req.query.url),
		package: decodeURI(req.query.url).split("id=")[1],
		name: doc.querySelector("[itemprop='name']") ? striptags(doc.querySelector("[itemprop='name']").innerHTML) : null,
		installs: doc.querySelector("[itemprop='numDownloads']") ? doc.querySelector("[itemprop='numDownloads']").innerHTML : null,
		score: doc.querySelector(".score") ? parseFloat(doc.querySelector(".score").innerHTML) : null,
		company: doc.querySelector("a.document-subtitle.primary > span") ? doc.querySelector("a.document-subtitle.primary > span").innerHTML : null,
		website: ((doc)=>{ 
			let result
			if(doc.querySelectorAll("a.dev-link"))
				doc.querySelectorAll("a.dev-link").forEach(it=>{ if(it.innerHTML.toLowerCase().includes("website")) result = it })
			return result ? result.getAttribute('href').split("google.com/url?q=")[1] : null
		})(doc),
		reviews: doc.querySelector(".reviews-num") ? parseInt(doc.querySelector(".reviews-num").innerHTML.replace(",","").replace(".","")) : null,
		category: doc.querySelector("a.document-subtitle.category > span") ? doc.querySelector("a.document-subtitle.category > span").innerHTML : null,
		relatedAppsUrl: ((doc)=>{
			let a = Array.from(doc.querySelectorAll("a")).find(a=>{return a.href.includes("similar_apps")})
			return (a && a.href) ? (a.href.includes("https://") ? "" : "https://play.google.com" )+a.href  : ""
		})(doc),
		relatedApps: Array.from(doc.querySelectorAll("div.details > a.title")).map(a=>{return (a.href.includes("https://") ? "" : "https://play.google.com" )+a.href }),
		img: showImage ? await fn.getImageData(((doc)=>{
			let i = doc.querySelector("div.details-info img.cover-image").getAttribute("src")
			return i.includes("http") ? i : "http:"+i
		})(doc)) : null
	}
	res.send(details)

}

router.get('/', function(req, res, next) { 
	try{
		run(req,res,next) 
	}	
	catch(e){
		res.send({error:true})
	}
	
})
module.exports = router