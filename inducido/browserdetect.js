/*
// detection du navigateur - pour le stocker en base 
var agt=navigator.userAgent.toLowerCase();
var navdetect= navigator.appName;

if( agt.indexOf("firefox") != -1) navdetect="firefox";
else
if( agt.indexOf("msie") != -1) navdetect="msie";
else
if( agt.indexOf("chrome") != -1) navdetect="chrome";
else
if( agt.indexOf("opera") != -1) navdetect="opera";
else
if( agt.indexOf("gecko") != -1) navdetect="mozilla";

*/
//from http://www.quirksmode.org/js/detect.html
//donne BrowserDetect.browser + ' ' + BrowserDetect.version + ' on ' + BrowserDetect.OS

var BrowserDetect = {
		//result pour pouvoir sérialiser que les 3 valeurs résultats 
		//"{"browser":"Chrome","version":17,"OS":"Windows"}"avec $.toJSON
		//avec $.toJSON(BrowserDetect.result)
    result:{},  
	init: function () {
		this.browser=this.result.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.result.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.result.OS = this.searchString(this.dataOS) || "an unknown OS";
//If the browser supports web workers, a worker property will be available 
//on the global window object.
//The following code checks for web worker support on a browser	
		this.worker=this.result.worker=!!window.Worker;				
		this.screenwidth=this.result.screenwidth=screen.width;
		this.screenheight=this.result.screenheight=screen.height;
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{       //IE 11 changed detection string
			string: navigator.userAgent,
			subString: "Trident",
			identity: "Explorer",
			versionSearch: "rv"
		},		
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};

//retrouver BrowserDetect.browser + ' ' + BrowserDetect.version + ' on ' + BrowserDetect.OS
BrowserDetect.init();

