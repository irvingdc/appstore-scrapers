var express = require('express')
var router = express.Router()

async function run(req, res, next) {
	let selector = "li[data-result-rank] a.s-access-detail-page"
	let url = decodeURI(req.query.url)
	try{
		let page = await global.browser.newPage()
		await page.goto(url)
		try{
			await page.waitForSelector("h2.a-spacing-base a", 10000)
			let newUrl = await page.evaluate(() => { return document.querySelector("h2.a-spacing-base a").href })
			await page.goto(newUrl)
		}
		catch(e){}
		let results = await page.evaluate((selector) => { return Array.from(document.querySelectorAll(selector)).map(a=>{return {"url": a.href, "title":a.title} }) }, selector )
		results.forEach((it,index)=>{setTimeout(()=>{console.log(it.url)}, index*500)} )
		page.close()
		return {res:results}
	}
	catch(e){
		console.log("------------------ ERROR ------------------> url: "+url, e)
		return {err:e}
	}
}

router.get('/', async (req, res, next) => { 
	var result = await run(req,res,next)

	setTimeout(async ()=>{
		if(result.res) res.send(result.res)
		else{ result = await run(req,res,next)
			console.log("Failed 1 time")
			setTimeout(async ()=>{
				if(result.res) res.send(result.res)
				else{
					console.log("Failed 2 times")
					result = await run(req,res,next)
					setTimeout(async ()=>{
						console.log("Failed 3 times")
						if(result.res) res.send(result.res)
						else res.send(null)
					},2000)
				}
			},2000)
		}
	},2000)
})

module.exports = router