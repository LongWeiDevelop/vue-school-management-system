/*
 * jQuery i18n plugin
 * @requires jQuery v1.1 or later
 *
 * See http://recursive-design.com/projects/jquery-i18n/
 * basé sur http://markos.gaivo.net/blog/?p=100
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version: 0.9.2 (201204070102)
 */
 (function($) {
/**
 * i18n provides a mechanism for translating strings using a jscript dictionary.
 *
 */


/*
 * i18n property list
 */
$.i18n = {
	// Set default locale to english
	defaultLang : "en",

	dict: {},
	
/**
 * setDictionary()
 * Initialise the dictionary and translate nodes
 *
 * @param property_list i18n_dict : The dictionary to use for translation
 */
	dico: function(lang,i18n_dict) {
		this.dict[lang] = this.dict[lang] || {};
		$.extend (this.dict[lang],i18n_dict);
        return this.dict[lang];
	},

    /* get or set the current lang */
	lang: function(lang) {
		if(lang)
		this.defaultLang = lang;
		return this.defaultLang;
	},
	
/**
 * _()
 * The actual translation function. Looks the given string up in the 
 * dictionary and returns the translation if one exists. If a translation 
 * is not found, returns the original word
 *
 * @param string str : The string to translate 
 * @param property_list params : params for using printf() on the string
 * @return string : Translated word
 *
 */
	_: function (str, params) {
		var transl = str;
        if(this.defaultLang!='en')
		if (this.dict[this.defaultLang] && this.dict[this.defaultLang][str]) {
			transl = this.dict[this.defaultLang][str];
		}
		return this.printf(transl, params);
	},
	
/*
 * printf()
 * C-printf like function, which substitutes %s with parameters
 * given in list. %%s is used to escape %s.
 *
 * Doesn't work in IE5.0 (splice)
 *
 * @param string S : string to perform printf on.
 * @param string L : Array of arguments for printf()
 */
//exemple printf("this is %1 now %2", [33, 44] );
	printf: function(S, L) {
		if (!L) return S;
//https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Expressions_r%C3%A9guli%C3%A8res
		var nS     = "";
//		var search = /%(\d+)\$s/g;   //ca peut pas marcher ca
		var search = /%(\d+)/g;
		// replace %1 to %10 where n is a number
		while (result = search.exec(S)) {
			var index = parseInt(result[1], 10) - 1;
			S = S.replace('%' + result[1] + '\$s', (L[index]));
			S = S.replace(result[0], (L[index]));
			// L.splice(index, 1); //ca peut pas marcher ca
		}
		var tS = S.split("%s");

		if (tS.length > 1) {
			for(var i=0; i<L.length; i++) {
				if (tS[i].lastIndexOf('%') == tS[i].length-1 && i != L.length-1)
					tS[i] += "s"+tS.splice(i+1,1)[0];
				nS += tS[i] + L[i];
			}
		}
		return nS + tS[tS.length-1];
	}
};

/*
 * _t
 * Allows you to translate a jQuery selector
 *
 * eg $('h1')._t('some text')
 * 
 * @param string str : The string to translate 
 * @param property_list params : params for using printf() on the string
 * @return element : chained and translated element(s)
*/
$.fn._t = function(str, params) {
  return $(this).text($.i18n._(str, params));
};


})(jQuery);


/* 
NBO TODO
to be removed : compatibilité avec underscore
*/

_ = function (str, params) {
 return $.i18n._(str, params);
};

/* foolprof addition (parce que coté serveur ca s'ecrit comme ca 
et compatibilité avec underscore
*/
__ = function (str, params) { 
    try{        
    return $.i18n._(str, params);
    }
    catch(e)
    {
        console.log(e);
    }
 }; 

/*
exemple d'appel:

var messages_1 = {
    'bushel of hay': 'boisseau de foin',
    'carrot': 'carotte',
}
var messages_2 = {
	'shiny bell': 'clochette brillante',
    'Thank you.': 'Merci.',
}	

$.i18n.dico('fr',messages_1);
$.i18n.dico('fr',messages_2);
$.i18n.lang('fr');

alert(_('Thank you.'));
*/