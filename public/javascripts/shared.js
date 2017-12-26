const WebRequest = require('web-request')
var base64 = require('node-base64-image')

module.exports = {
	chineseToInternationalNumbers: function(text){
        var result = ""
        var multiplier = 1
        var endFound = false
        var numbersFound = false
        if(text){
        	text.split("").forEach((it)=>{
	            let match = it.match(/[\d\.,百千亿万]/gi)
	            if(!numbersFound && it.match(/[\d]/gi)) numbersFound = true
	            if(!match && numbersFound) endFound = true
	            if(!endFound && match) result += match[0].toString()
	        })
	        var number = parseFloat(result)

	        if(text.match(/百/g)) multiplier = multiplier*100
	        if(text.match(/千/g)) multiplier = multiplier*1000
	        if(text.match(/万/g)) multiplier = multiplier*10000
	        if(text.match(/亿/g)) multiplier = multiplier*100000000
	        return Math.round(multiplier * number)
        }        
	},
	numberWithCommas: function(x) {
    	var parts = x.toString().split(".");
	    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    return parts.join(".");
	},
	getImageData: async function(url) {
		return new Promise((resolve, reject) => {
			let image = base64.encode(url, {string: true}, (err, image) => { 
				if(!err) resolve(image)
				return reject (err)
			})
		})	
	}

}
