var express = require('express')
var router = express.Router()

async function run(req, res, next) {
	let page
	try{
		page = await global.browser.newPage()
		let url = decodeURI(req.query.url)
		await page.goto(url,{timeout:10000})
		//await page.waitForSelector(".buying a",{timeout:10000})
		var result = await page.evaluate(() => { 
			let aEmail = Array.from(document.querySelectorAll("#mas-developer-info a")).find(it => { return it.href.includes("mailto") })
			let aWebsite = Array.from(document.querySelectorAll("#mas-developer-info a"))
								.filter(it => { return it.href.includes("http") })
								.find(it => { return !it.innerHTML.includes("More apps") })
			let email = aEmail ? aEmail.href.split(":")[1] : ""
			let company = Array.from(document.querySelectorAll(".buying a")).map(a=>{return a.innerHTML})[0]
			let website = aWebsite ? aWebsite.href : ""
			return { email:email, company:company, website:website}
		})
		page.close()
		console.log(result)
		return {id:req.query.id, ...result}
		//return result
	}
	catch(e){
		page.close()
		console.log("------------------ ERROR ------------------> url: "+req.query.url, e)
		return {id:req.query.id, error:true}
	}
}

router.get('/', async (req, res, next) => { 
	let result = await run(req,res,next)
	res.send(result)
})

module.exports = router