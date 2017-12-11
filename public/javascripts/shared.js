const WebRequest = require('web-request')
var base64 = require('node-base64-image')

module.exports = {
	chineseToInternationalNumbers: function(text){
		var downloads = parseFloat(text.replace(/[^\d\.,]/gi,''))
		if(text.match(/百/g)) downloads = downloads*100
		if(text.match(/千/g)) downloads = downloads*1000
		if(text.match(/万/g)) downloads = downloads*10000
		if(text.match(/亿/g)) downloads = downloads*100000000
		return Math.round(downloads)
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