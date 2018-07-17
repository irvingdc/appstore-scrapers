const WebRequest = require('web-request')
var fn = require('../public/javascripts/shared')
var sc = require('../public/javascripts/scraping')
var express = require('express')
var router = express.Router()
var striptags = require('striptags')

let getWebsite = (doc) => { 
	let result
	if(doc.querySelectorAll("a.dev-link")){
		doc.querySelectorAll("a.dev-link").forEach(it=>{ 
			if(it.innerHTML.toLowerCase().includes("website")) result = it 
		})
	}
	return result ? result.getAttribute('href').split("google.com/url?q=")[1] : null
}

let getEmail = (doc) => {
	let result = Array.from(doc.querySelectorAll("a")).find(it => it.href.toLowerCase().includes("mailto"))
	return result ? result.getAttribute("href").split(":")[1] : ""
}

let getRelatedAppsUrl = (doc) => {
	let a = Array.from(doc.querySelectorAll("a")).find(a => a.href.includes("similar_apps"))
	return (a && a.href) ? (a.href.includes("https://") ? "" : "https://play.google.com" )+a.href  : ""
}

let getImageUrl = (doc) => {
	let i = doc.querySelector("div.details-info img.cover-image").getAttribute("src")
	return i.includes("http") ? i : "http:"+i
}

let getDetails = async (doc, req, showImage) => ({
	email: getEmail(doc),
	appId : req.query.appId,
	url: decodeURI(req.query.url),
	package: decodeURI(req.query.url).split("id=")[1],
	name: doc.querySelector("[itemprop='name']") ? striptags(doc.querySelector("[itemprop='name']").innerHTML) : null,
	installs: doc.querySelector("[itemprop='numDownloads']") ? doc.querySelector("[itemprop='numDownloads']").innerHTML : null,
	score: doc.querySelector(".score") ? parseFloat(doc.querySelector(".score").innerHTML) : null,
	company: doc.querySelector("a.document-subtitle.primary > span") ? doc.querySelector("a.document-subtitle.primary > span").innerHTML : null,
	website: getWebsite(doc),
	reviews: doc.querySelector(".reviews-num") ? parseInt(doc.querySelector(".reviews-num").innerHTML.replace(",","").replace(".","")) : null,
	category: doc.querySelector("a.document-subtitle.category > span") ? doc.querySelector("a.document-subtitle.category > span").innerHTML : null,
	relatedAppsUrl: getRelatedAppsUrl(doc),
	relatedApps: Array.from(doc.querySelectorAll("div.details > a.title")).map(a => (a.href.includes("https://") ? "" : "https://play.google.com" )+a.href ),
	img: (showImage ? await fn.getImageData(getImageUrl(doc)) : null)
})

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
	var details = await getDetails(doc, req, showImage)
	res.send(details)

}

router.get('/', function(req, res, next) { 
	run(req,res,next) 
})

module.exports = router