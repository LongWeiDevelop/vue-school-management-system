// _           _             _     _
//| |         | |           (_)   | |
//| |____   __| |_   _  ____ _  __| | ___
//| |  _ \ / _  | | | |/ ___) |/ _  |/ _ \
//| | | | ( (_| | |_| ( (___| ( (_| | |_| |
//|_|_| |_|\____|____/ \____)_|\____|\___/
// tiny Javascript microframework
//
// (c) Nadir Boussoukaia < nadir _@_ inducido.com >
// Released under the normal copyright license
//
// inducido : http://www.inducido.com
// Creation date: 17:32 08/10/2009

  /*
        var  Inducido = {
            base_url:"[[INDUCIDO_BASE_URL]]",
            env:"[[INDUCIDO_ENV]]",
            lang:"[[lang]]",
            language:"[[language]]"
        };
Inducido_base_url="[[INDUCIDO_BASE_URL]]";
Inducido_env="[[INDUCIDO_ENV]]"; 
Inducido_lang="[[lang]]"; 
Inducido_language="[[language]]"; 
*/
//----------------------------------------------
// helper fn for console logging
//console.log for old versions of IE. in IE8 isn't a Javascript function, but an OBJECT
if (!(window.console && window.console.log && 'function' === typeof window.console.log)) 
{
    window.console = window.console || {};   // store logs to an array for reference
    window.console.log = window.console.log || function (){};   // store logs to an array for reference

    window.console.log =  function ()
    {
        window.console.log.history = window.console.log.history || [];   // store logs to an array for reference
        window.console.log.history.push(Array.prototype.slice.call(arguments) );

    };

}



//----------------------------------------------
//deroute tout les clicks de lien "#" vers un simple console.log
(function($){

 if(Inducido && 'settings' in Inducido && Inducido.settings.catchhashlink)
    $(document).delegate("a", 'click', function(e) {
          if($(e.target).attr('href')=="#")
          {
                e.preventDefault();
                console.log("A.HREF PROBLEM OR CLICK HANDLER PROBLEM on:" );
                console.log(e.target);
          }
            });

})(jQuery);
//----------------------------------------------//----------------------------------------------
//----------------------------------------------//----------------------------------------------

(function($) {
    'use strict';

    var VERSION = "29.09.2012";

	//cross browser (IE!!) console.log
	// call: I.log('test'+counter++);    --> only 1 param
	// call: I.log.history                     is an array
	// log in the body:set somewhere a  <div id="console"></div>
	function log() {
	//inspiré de http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
	//celui là: trop lourd http://patik.com/blog/complete-cross-browser-console-log/

		  //console.log in IE8 isn't a Javascript function, but an OBJECT
			if (window.console && window.console.log && 'function' === typeof window.console.log) {
				window.console.log(Array.prototype.slice.call(arguments) );
			}
			else
			 if (window.opera && window.opera.postError) {
				window.opera.postError(Array.prototype.slice.call(arguments) );
			}
			 else
			 {
				 log.history = log.history || [];   // store logs to an array for reference
				 log.history.push(Array.prototype.slice.call(arguments) );

			 }

		//if a console div exist, log into it
		if(document.getElementById("console")!=null)
		document.getElementById("console").innerHTML +=  Array.prototype.slice.call(arguments)  + " ";
		//document.getElementById("console").textContent +=  msg + " ";
	}

	//----------------------------------------------------------------------
	/**
	 * ajaxSubmit() provides a mechanism for immediately submitting
	 * an HTML form using AJAX.
	 */
	$.fn.ajaxSendForm = function(options) {

		// fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
		if (!this.length) {
			log('ajaxSubmit: skipping submit process - no element selected');
			return this;
		}
		//serialise() provided by jquery
	var defaults = {   params: $(this).serialize(), block: this.attr('id')
				   ,themed:false 
					};
	   if ( options === undefined )
			options = {};
	// Merge defaults and options, without modifying defaults
	options =  $.extend( {}, defaults, options );
		I.postJSON(options);
	};
//----------------------------------------------------------------------
	function dev()
	{
	return (Inducido.env && Inducido.env=="dev");
	}

//----------------------------------------------------------------------
function pushtoparentiframe(action, message)
{
	var is_child_iframe=("iFrameResizer" in window) && ("parentIFrame" in window);
	if(is_child_iframe) {
		parentIFrame.sendMessage({action: action, data: message});
		return true;
	}
}
	function add2statusbar( message ) {
		console.log('[statusbar]', message);
		if(pushtoparentiframe('add2statusbar', message)) return;

	//'add2statusbar': function ( message ) {
        //notify(('Information'), message, {icon:'js/notify/ico/what.png'});
		notify(__('Information'),message, {
            title:'primary',
            system:                true,
            vPos:                Inducido.settings.vPos,  //'bottom'
            hPos:                Inducido.settings.hPos, //'left';  'center';
            autoClose:            true,
            icon:                'inducido/notify/signs/info.png' ,
            iconOutside:        false,
            closeButton:        true,
            classes:['primary'],
            showCloseOnHover:    true,
            groupSimilar:        true
        });

    } 
    
    function add2statusbarKO( message ) {
		console.error('[statusbarKO]',message);
		if(pushtoparentiframe('add2statusbarKO', message)) return;

    //add2statusbarKO: function  ( message ) {
        //bloque le message d'erreur si on est en mode debug
        //notify('<span class="error">'+('Error')+'</span>', message, {icon:'js/notify/ico/amazing.png'});

        notify(__('Error'),message, {
            title:'danger',
            system:                true,
            vPos:                Inducido.settings.vPos,  //'bottom'
            hPos:                Inducido.settings.hPos, //'left';  'center';
            autoClose:            true,
            icon:                'inducido/notify/signs/ko.png' ,
            iconOutside:        false,
            closeButton:        true,
            classes:['danger'],
            showCloseOnHover:    true,
            groupSimilar:        true
        });
	}
    
    function add2statusbarOK( message ) {
		console.log('[statusbarOK]',message);
		if(pushtoparentiframe('add2statusbarOK', message)) return;
    //add2statusbarOK: function ( message ) {
        //notify('<span class="success">'+('Success')+'</span>', message, {icon:'js/notify/ico/big_smile.png'});
        notify(__('Done'),message, {
            title:'success',
            system:                true,
            vPos:                Inducido.settings.vPos,  //'bottom'
            hPos:                Inducido.settings.hPos, //'left';  'center';
            autoClose:            true,
            icon:                'inducido/notify/signs/ok.png' ,
            iconOutside:        false,
            closeButton:        true,
            classes:['success'],
            showCloseOnHover:    true,
            groupSimilar:        true
        });


    }
	//----------------------------------------------------------------------
	//indique si l'url donné est une action au format [[controller/action]], sinon renvoie null
	 function ActionURL(url)
	 {
		if(url==null ||url.trim().charAt(0)!='[') return null;

		var tableau = url.trim().trimBraquets().split("/");

		if(tableau==null || tableau.length<2)return null;

		var obj={
			'controller':tableau[tableau.length-2],
			'action':tableau[tableau.length-1],
			'folder':tableau.slice(0, tableau.length-2).join('/')
			};

		return obj;
	 }


	//----------------------------------------------------------------------
	//   img.src = I.url("lowsec","load", { 'id':id } );

	// appel du genre url("eval","login", array(id=>"1",nom=>"mickey") ) -->
	//creation de l'url applicative définitive par defaut
	//forme: url("eval/login", array(id=>"1",nom=>"mickey") );

	/**
	* @param mixed $action
	* @param mixed $params
	*/
	function Url(controller,action,params,folder)
	//todo le rendre parametrable
	//todo: il faudrait 3 modes: URL_QUERY_STRING, URL_SEF, URL_REWRITE
	{
	//    <!-- //REPLACE ACTION /runtime/index.php?action=eval_login -->

			// Set the base URL
	//        Inducido::$base_url = rtrim($settings['base_url'], '/');


		 //Get the path from the base URL, including the index file

	//todo il faudrait mettre application_url_prefix = "/runtime/index.php?" ou "/runtime/index.php/"
	//todo ou alors un parametre front_controller=
	try{
	//en cas d'appel en interne de la forme $text=i::url('eval/resultat');
	//je prefere cette ecriture, c'est moins chiant que de passer 2 parametres
	if(action==null)
	{
		var ca=explode('/',controller);
		var controller=array_shift(ca);
		var action=array_shift(ca);
		controller= controller.trim().trimBraquets();
		action= action.trim().trimBraquets();

		//il manque un bout...
	//if(!empty(ca))
	//{    
	//    var params=ca;
	//    var ca=explode(',',controller);
	//    
	}

	//url=withslash(Inducido.base_url)+withslash(folder)+"index.php?"
	//+"action="+controller
	//+ifne("_",action)
	//+ifne("&",(params==null)?"":http_build_query(params));

	if(Inducido.base_url==null || Inducido.base_url=="[[Inducido.base_url]]")Inducido.base_url="";

	var url=util.withslash(window.Inducido.base_url)+
		util.withslash(folder)+
		util.withslash(controller)+
		action
		+util.ifne("/",(params==null)?"":http_build_query ( params,0,'/').replace(/=/g,"/"));

	}
    catch(e)
	{
		console.log('error',e);
//	    add2statusbarKO(__('Error ')+e);
	    add2statusbarKO(__('Error during the request'));
	    url="";
	}

	return url;
	}

	//----------------------------------------------------------------------
	var loader_unique_id=0;
	//--------------------------------------------------------------------
	/*
	blockedcontrol est
	- soit la chaine de l'id du control à bloquer sans le #
	- soit le controle lui-meme (objet jquery) à bloquer
	- soit une fonction: block:function(state,id)

	 qui recoit ('start'), ('stop'),('started',id) en parametre pour state et (id=nom du controle du loader image/progress bar)
		la fonction peut renvoyer le nom du controle à bloquer (sinon rien n'est fait)
		ou alors block={'id':"saisie",'message':"zoby la mouche..",'loadingimage':""}; et renvoyer block
		id est l'id du controle à bloquer, message et loading image pour remplacer celles par defaut
		si message vaut 'none', alors le contrle est bloqué sans la fenetre de feedabck UI
						block:function(state,id)
						{
                              if(state=='start')
                              {
                                  block={'id':"saisie",'message':"<span id=msgprgbr>Création des copies..</span>",'loadingimage':""};
                                  return block;
                              }
                              else
                              if(state=='started')
                              {
                                if(id)
                                $(id).progressbar({ value: 5 });
                              }

                              //controle à bloquer
                              return "saisie";
                          }
	*/
	function blockcontrol( blockedcontrol,useJUI ) {
		var title=__("<h2>Processing...</h2>");
		//            loadingimage='<img src="/maquette/admin/images/ajax-loading.gif" width="220" height="19" />';
	//	var loadingimage='<img id="loader" src="./ani-processing.gif" width="129" height="20" style="float: none;" />';
	//	var loadingimage='<span></span>';
		//var loadingimage='<img id="loader" src="/maquette/admin/inducido/ajax-loading.gif" width="129" height="20" style="float: none;" />';
		//	var loadingimage='<span>&nbsp;</span>';
		var transparent=
		"data:image/gif;base64,R0lGODlhgQAUAIAAAAAAAP///yH5BAEAAAEALAAAAACBABQAAAI0jI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpecAgA7"
	;
		var loadingimage='<img id="loader" src="'+transparent+'" width="129" height="20" style="float: none;" />';
		var callfunction=null;


	if (blockedcontrol)
	{
		if( typeof blockedcontrol == 'function' )
		{
			callfunction=blockedcontrol;
			var ret=blockedcontrol('start');
			if( typeof(ret)=='object')
			{
				if('id' in ret)
				blockedcontrol=ret['id'];

				if('message' in ret) // tester l'existence d'une propriété d'un objet
				title=ret['message'];

				if('loadingimage' in ret)  //peut etre vide  tester l'existence d'une propriété d'un objet
				loadingimage=ret['loadingimage'];
			}
			else
			if(!util.isString(ret)) return;
			else
			blockedcontrol=ret;

		}

		if( typeof blockedcontrol != 'function' )
		{
			var obj=blockedcontrol;

			if(util.isString(blockedcontrol))
			var obj=$('#'+blockedcontrol);

			//NBO garde fou
			if(typeof loader_unique_id=="undefined")
				loader_unique_id=0;
			var id="progressbar"+(loader_unique_id++);
			//je veux pas de dépendance à un css
			var the_message=title+'<div id="'+id+'" style="margin-left:auto;margin-right:auto" class="blocked_content">'+loadingimage+'</div>' ;
			
			if(title=='none') the_message=null; //desactive la fenetre message
			//todo remplacer par une classe class="ajaxloader"
			var themed=(typeof jQuery.ui != 'undefined');

			if(useJUI!=null)
			themed=useJUI;

			if(obj.width()<100 || obj.height() < 60 )
				obj.block({message: null});
				else

			obj.block({                 
						message: the_message, 
	//					message:null,
						theme:themed,
	//					timeout: 10000,  //delai max de blockage
						title: __('Please wait'),      // title string; only used when theme == true
						//    draggable: false,  // only used when theme == true (requires jquery-ui.js to be loaded)                
						css: {
							border: '4px solid #2983B5',
							padding: "20px",
							margin: "10px",
							//ca sert à rien: je pense que c'est que dans le cas non themed
							opacity: "0.80",
							'-webkit-border-radius': '10px',
							'-moz-border-radius':     '10px',
							'border-radius':          '10px'
						},

                overlayCSS:  {    // styles for the overlay
                    backgroundColor: '#fff',
                    opacity:         0.8,
                    cursor:          'wait'
                },

                //css du dialog en mode themed
						themedCSS: {
							opacity: 0.8
						}
					});
			//opacité globale du controle bloqué        
			obj.data('old-opacity',obj.css('opacity'));
		//	obj.css('opacity','0.4');
			if(callfunction)
			callfunction('started','#'+id);

		}
	}
	}

	//--------------------------------------------------------------------

	function unblockcontrol( blockedcontrol ) {


	/*if(this.blocked)
	if( typeof this.blocked == 'function' )
	this.blocked('stop');
	else
	$('#'+this.blocked).unblock();
	*/

	if (blockedcontrol)
	{
		if( typeof blockedcontrol == 'function' )
		{
			var ret=blockedcontrol('stop');
			if(!util.isString(ret)) 
			return;
			else
			blockedcontrol=ret;
		}

		if( typeof blockedcontrol != 'function' )
		{
			try{
			$('#'+blockedcontrol).unblock();
			//$('#'+blockedcontrol).css('opacity','0.4');
			$('#'+blockedcontrol).css('opacity',$('#'+blockedcontrol).data('old-opacity'));
			}catch(e){ $('#'+blockedcontrol).css('opacity','1');}
		}
	}
	}
//----------------------------------------------------------------------
//--------------------------------------------------------------------
/*
I.getJSON({url:'[[qcm/ajax_add_question]]'
		   ,params:{'id_qcm':id_qcm,'id_question':id_question}
           ,block:function(state,id)
				{
					  if(state=='start')
					  {
						  block={'id':'roundgroupboxAjoutViaID','message':"none",'loadingimage':""};
						  return block;
					  }

					  //controle à bloquer
					  return 'roundgroupboxAjoutViaID';
				  }
		  ,callback:function(msg, textStatus)
				{
					  if(msg && msg.status==1)
					  add2statusbar('ok!');
				}
   });
*/
//JSON The type of data that you're expecting back from the server
// a utiliser SEULEMENT QUAND params ne comptiens que des valeurs "légères" (id etc) sinon utiliser POST
function getJSON(options) {
	return iDoAjax(options,"GET",'json');
}
//--------------------------------------------------------------------
//JSON The type of data that you're expecting back from the server
function postJSON(options) {
	return iDoAjax(options,"POST",'json');
}
//--------------------------------------------------------------------
/*
I.getHTML({url:'[[exam/generatestep2]]'
,params:{'id_qcm':id_qcm,'id_question':id_question}
,callback:function(htmlcode)
{
	if(htmlcode)
	{
		add2statusbarOK("Succès");
		$('#saisie').hide().html(htmlcode).fadeIn('slow');
	}
}
});
*/
//The type of data that you're expecting back from the server
function getHTML(options) {
	return iDoAjax(options,"GET",'html');
}
//--------------------------------------------------------------------
//The type of data that you're expecting back from the server
function postHTML(options) {
	return iDoAjax(options,"POST",'html');
}
//--------------------------------------------------------------------
function iDoAjax(options,method,format) {
	var action=null;
	var default_args = {
		'url'	:	 null,
        'callback'    :    null,
        'callback_ko'    :    null,
		'params'	:	null,
		'block'    :	null,
		'themed' :	null,
		'async' : true
	}
	/* options[] has all the data - user provided and optional */
	for(var index in default_args) {
//		if(index in options) test=true; else test=false;
		if(typeof options[index] == "undefined") options[index] = default_args[index];
	}

  if (options.block)
	 blockcontrol( options.block,options.themed ) ;

	 if((action=ActionURL(options.url))!=null)
	 {
          	//function I.url(controller,action,params,folder)
		 options.url= Url(action.controller,action.action,method=="POST"?null:options.params,action.folder);
		 if(method!="POST")options.params=null; //already indcluded in the url for GET
	 }

    return $.ajax({
		type:method,
		url: options.url,
        // data is converted to a query string if not already a string
		data: options.params,
		error: callback_ko,
		success: callback_ok,
        ok: options.callback,
        //        timeout:13*1000, //13 second timeout
		ko: options.callback_ko,
		blocked: options.block,
		async: options.async,
		dataType:format
    });
};
//--------------------------------------------------------------------

function AjaxForm(controle, options)
{
    //Merge the contents of two or more objects together into the first object.
    //force mon callback
    options = 
    $.extend( options,
        {error: callback_ko,
        success: callback_ok});
    
return $(controle).ajaxForm(options);

}
//--------------------------------------------------------------------

function callback_ko(jqXHR, reason, exThrown) {


    //todo appelé au cas ou erreur php, on a parseerror invalid JSON
    //reason donne: parseerror
    //exThrown donne: le texte "invalid JSON" et suivant

    unblockcontrol(this.blocked);

    //en cas de response sur un appel ajax avec une exception style "paramtre non validés" ou "parametre manquant"
    //attention: apres this.blocked car this n'exsite plus dans l'appel
    if (typeof jqXHR.responseJSON != "undefined") {
        var msg = jqXHR.responseJSON;
        if (typeof msg == 'object')
        //c'est un message d'erreur du framwork (erreur 500, pour eviter la duplication de code)
        //<Inducido_Exception> Inducido_Exception [ 0 ]: Action register/exam_post non validÃ©e correctement ~
            if ('framework' in msg && msg.framework == 'inducido') {
                //cet appel fonctionne, ca permet de traiter le message msg, sans appeler ok()
                //alternative: externaliser le code traitant msg, mais attention pas acces à this dans ce cas
                //car this sera null
                var ret = callback_ok(jqXHR.responseJSON, reason)

                //callback appelé dans tout les cas
                if (typeof this != "undefined")
                    if (this.ko)
                        try {
                            this.ko(jqXHR.responseJSON, reason, exThrown);
                        } catch (e) {
                        }

                return ret;

            }
    }

    //Echec du dialogue avec le serveur (Raison:error undefined (Ajax: 0 error) )    
    //cas coupure réseau 
    if (jqXHR.status == 0 && jqXHR.statusText == "error")
        return;

    //status: 302: redirection demandée apr le serveur
    if (jqXHR.status == 302  /*&& jqXHR.statusText=="Found"*/)
        return;
    //status: 414
    //statusText: "Request-too long
    var details = "Ajax: " + jqXHR.status + " " + jqXHR.statusText + " ";

    if (dev() && (typeof exThrown.stack != "undefined"))
        details += "<br>" + exThrown.stack;

    if (dev())
        console.log('URL: ' + this.url + ' -> ' + details + "\n" + jqXHR.responseText);

    if (dev())
        details += __("Response text") + ":<br>" + jqXHR.responseText.substring(0, 40);

    //The HTTP response status code 302 Found is a common way of performing URL redirection.
    if (jqXHR.status == 302) {
        console.error(details + "\n" + jqXHR.responseText)
        //ca arrive quand je fais un load (html) et que coté backend je demande une redirection
        return
    }


    var normal_error=false;

    //les erreurs sont remontées en Status Code:403 Forbidden
    if (jqXHR.getResponseHeader('content-type').indexOf("application/json") != -1)
	{
        var msg = JSON.parse(jqXHR.responseText)
        normal_error=('framework' in msg && msg.framework =='inducido')
		if(normal_error)
        callback_ok(msg);
	}

	if(!normal_error)
    add2statusbarKO(__("Dialogue with the server failed (Reason:")+reason+
       util.ifne(" ",exThrown.message) +" "+details+' on ['+this.url+"])"
    );
  
}
//--------------------------------------------------------------------
function callback_ok(msg, textStatus)
  {
    //msg: returned from the server, formatted according to the dataType parameter
    //alert ("callback_ok ajax:"+textStatus);  //affiche "success"
if (typeof this != "undefined")
unblockcontrol(this.blocked);
/*
if(this.blocked)
if( typeof this.blocked == 'function' )
this.blocked('stop');
else
$('#'+this.blocked).unblock();
*/
    if(msg)
    {
			if(typeof msg == 'object')
			if('framework' in msg && msg.framework =='inducido')
//			if(msg.dataType=='json')
			{
						if(msg.status==1)//normal behavior
						{
							if(msg.html!=null)
							add2statusbar(msg.html, 5000);            
							if(msg.text!=null)
							add2statusbar(msg.text, 5000);
						}
						else
						if(msg.status==2) //redirect
						{
							if(msg.text)
							{
								var calledurl=msg.text;
								window.location=calledurl;
							}
						}
						else
						if(msg.status==0) //erreur applicative
						{
							if(msg.html!=null)
							add2statusbarKO(msg.html);
							
							if(msg.text!=null)
							add2statusbarKO(msg.text);
						}
						else
						if(msg.status==3)//dialog to be opened : normal behavior
						{
							if(msg.html!=null)
							add2statusbar(msg.html);            
							if(msg.text!=null)
							add2statusbar(msg.text);
						}
						else //msg.status inconnu
						{
						
								add2statusbarKO(__("Bad format of the server response."),"error",5000);
								try{
									add2statusbar("content: "+msg);
								}
								catch(ex)
								{
									add2statusbar(__("Impossible to display its content"));
								}
						}


						if(msg.statusbar_ko) //bar d'erreur
                        {
                           // if(msg.statusbar_ko.length>3 && msg.statusbar_ko.substring(0,2)!="[!]")
				           add2statusbarKO(msg.statusbar_ko);
                            //console.error(msg.statusbar_ko, this.url,this);
                        }
							
						if(msg.statusbar_ok) //bar de confirmation
						add2statusbarOK(msg.statusbar_ok);       
						//la barre jaune je veux qu'elle soit en dessous (elle peut complementer les 2 barres au dessus)
						if(msg.statusbar) //bar d'info
							add2statusbar(msg.statusbar);
				
			}

            //else
            if( typeof msg != 'object' &&
            //si on load un html qui comporte du code json, c'est un bug d'ajax entre la partie serveur/client
            msg.indexOf('"framework":"inducido"')!=-1)
            {
                //supprime le code JSON pour la suite (affichage HTML possiblement..)
                msg=msg.replace(/{(.*)}/gi,"");
                //espace pour effacer un ajax loader eventuel
                msg=" "+msg;
                //msg="Erreur<br>"+msg;

            }
            //callback appelé dans tout les cas
            if (typeof this != "undefined")
            if(this.ok)
            try{this.ok(msg,textStatus);}catch(e){}

    }
    else
    {
          add2statusbarKO(__("No answer from the server"));
    }

  }
//----------------------------------------------------------------------
	//get et set et exist() à la fois.
	function setting(name,value)
	{
		if(value!=undefined)
		{
            if(I.settings==undefined)
                I.settings={};
            I.settings[name]=value;
            return I.settings[name]
		}
		var notfound=null

			if(I.settings==undefined)
		return notfound

		if(I.settings[name]==undefined)
			return notfound

		return I.settings[name]
    }
//----------------------------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------
    /** Utility functions
     *
     *  These are more or less modelled on the ones used in Underscore.js,
     *  but might not be as extensive or failproof.
     *  However, they are pretty damn useful and can be accessed by using
     *  the Inducido.util global
     */
    var util = {
	//--------------------------------------------------------------------
	// (if not empty) return the string 'header.value" if value not null
	//used like this: ifne("&",ifne("userid=",$_REQUEST["userid"]))
	"ifne": function (header,value)
	{
		return (!empty(value))?header+value:"";
	},
	//--------------------------------------------------------------------
	"withslash": function (destination)
	{
		//si chaine vide ne renvoie pas '/' tout seul
	if(empty(destination))
		return "";

		if (php_substr(destination, -1, 1) != '/' && php_substr(destination, -1, 1) != '\\')
			return destination + '/';

		return destination;
	},
	//--------------------------------------------------------------------
	"merge": function( first, second ) {

	   var inArray=function( elem, array ) {
			if ( !array )
				return -1;

			for ( var i = 0, length = array.length; i < length; i++ )
				if ( array[ i ].name === elem )
					return i;
			return -1;
		};

		for (var name in first ) {
				var obj = first[ name ];
				var index=inArray(obj.name,second);
				if(index>=0){
				first.splice(name,1);
				first.push(second[index]);
				}

		};

		for ( name in second ) {
				obj = second[ name ];
				if(inArray(obj.name,first)<0)
				first.push(second[name]);
		};

		return first;
	},
	//--------------------------------------------------------------------
//    utilisé par ajaxComplete
			"stripTags": function (input, allowed) {
			// Strips HTML and PHP tags from a string
			//
			allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
			var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
				commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
			return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
				return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
			});
		},
	//--------------------------------------------------------------------
			//----------------------------------------------------------------------
	//    var params=I.url("#FormContact");
			/*
			 on peut parcourir le resultat via
			 for (key in arr) { value = arr[key]; console.log('key/v='+key+","+value); }
			 (ce n'est pas un tableau standard)
			 */
			"SerializeArray":      function iSerializeArray(ctrl_name)
		{
			//Encode a set of form elements as an array of JSON object {names and values}.
			var params=$(ctrl_name).serializeArray();

			//var arr=[];
			var arr={};
			for ( var i = 0, length = params.length; i < length; i++ )
				//si la valuer est vide, on le met pas, sinon en mode seo on a des url comme
				// "/admin/question/recherche/mot//includeoptions/checked/qcm_in//qcm_out/"
				// et les doubles slash ton eliminés
				if(params[ i ].value.length)
					arr[ params[ i ].name ]= params[ i ].value;
			return arr;

		},

	//--------------------------------------------------------------------

	//--------------------------------------------------------------------
			"isString": function (input){
				return typeof(input)=='string';
			},

			//Unfortunately Javascript's native typeof doesn't return the correct type
			//of an Array (it returns 'object' instead). This util fixes that.
			"isArray" : function(val) {
				return util.typeOf(val) === "array";
			},

			"isObject" : function(val) {
				return util.typeOf(val) === "object";
			},

			//Returns all keys of an object as an array.
			//var obj = {"one" : 1, "two" : 2, "three" : 3};
			//console.log( I.util.keys( obj ) ); // ["one", "two", "three"]
			"keys" : function(list) {
				return util.map(list, function(value, key) {
					return key;
				});
			},
			//Returns all values of an object as an array.
			 //var obj = {"one" : 1, "two" : 2, "three" : 3};
			 //   console.log( I.util.values( obj ) ); // [1, 2, 3]
			"values" : function(list) {
				return util.map(list, function(value, key) {
					return value;
				});
			},

			// from http://stackoverflow.com/a/2117523/152809
			//How to create a GUID / UUID in Javascript?
			//Returns a random uniqe 128-bit id of the version 4 (random) type.
			"makeUuid" : function() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
					return v.toString(16);
				});
			},

			//Converts Array-like values (like the arguments variable in a function
			//or a DOM Node collection) to real arrays. Calling this function with
			//an object as the argument is the same as calling I.util.values.
			"toArray" : function(val) {
				if (util.isObject(val)) {
					return util.values(val);
				} else {
					return Array.prototype.slice.call(val, 0);
				}
			},

			//A better typeof operator that returns the correct type of a value.
			//console.log( I.util.typeOf( {} ) ); // 'object'
			//console.log( I.util.typeOf( [] ) ); // 'array'
			//console.log( I.util.typeOf( 1 ) ); // 'number'
			//console.log( I.util.typeOf( '' ) ); // 'string'
			//console.log( I.util.typeOf( null ) ); // 'null'
			//console.log( I.util.typeOf( undefined ) ); // 'undefined'
			"typeOf" : function(val) {
				return Object.prototype.toString.call(val).replace(/\[object |\]/g, '').toLowerCase();
			},

			//----------------------------------------------------------------------
			/* extract a database id from the component id having the format 'field-id' */
			"id2id": function id2id(obj)
			{
				try{
					//return (String)($(obj).attr('id')).split('-')[1];
					//pop->cas "question-text-322"
					return (String)($(obj).attr('id')).split('-').pop();

				}
				catch(e){ return null; }
			}

			//----------------------------------------------------------------------

			//----------------------------------------------------------------------



	};


    {
    	//default settings
        var settings={
            vPos: 'top',  // 'top' 'bottom'
            hPos: 'left', //'left';  'center'  'right';
        };

        if (window.Inducido && 'settings' in window.Inducido) {
            $.extend(settings,window.Inducido.settings);
        }

        var Inducido = $.extend(window.Inducido, {
            settings: settings,

            //"extend" : function(obj) {
            //    util.each(obj, function(value, key) {
            //        _.Module[key] = value;
            //    });
            //},


            //"on" : function() {
            //    _.addEventHandler.apply(this, arguments);
            //},

            toJSON: (typeof JSON != "undefined" ? JSON.stringify : function (obj) {
                    var arr = [];
                    $.each(obj, function (key, val) {
                        var next = key + ": ";
                        next += $.isPlainObject(val) ? this.toJSON(val) : val;
                        arr.push(next);
                    });
                    return "{ " + arr.join(",\n ") + " }";
                }),


            "util": util,

            'log': log,
            'add2statusbar': add2statusbar,
            'add2statusbarKO': add2statusbarKO,
            'add2statusbarOK': add2statusbarOK,
            'actionURL': ActionURL,
            'url': Url,
            'getHTML': getHTML,
            'postHTML': postHTML,
            'getJSON': getJSON,
            'postJSON': postJSON,
            'ajaxForm': AjaxForm,
            'blockcontrol': blockcontrol,
            'unblockcontrol': unblockcontrol,
            'setting': setting,
            "version": VERSION
        });

    }

    // This library can be used as an AMD module, a Node.js module, or an old fashioned global
    //
    // if (typeof exports !== "undefined") {
    //     // Server
    //     if (typeof module !== "undefined" && module.exports) {
    //         exports = module.exports = Inducido;
    //     }
    //     exports.I = Inducido;
    // } else
    	if (typeof define === "function" && define.amd) {
        // AMD
        define(function() {
            return Inducido;
        });
    } else {
        // Global scope
        window['I'] = Inducido;
    }

})(jQuery);

//----------------------------------------------
// JavaScript i18n
// 24ways.org  / http://24ways.org/2007/javascript-internationalisation
// trop complet http://i18next.com/
//http://stackoverflow.com/questions/9640630/javascript-i18n-internationalization-frameworks-libraries-for-client-side-use
/*
function _(s) {
    if (typeof(i18n)!='undefined' && i18n[s]) {
        return i18n[s];
    }
    return s;
}
*/

/*
puis
   <script type="text/javascript" src="js.fr.js"></script>
qui contient:

// French translation file

var i18n = {
    thousands_sep: ' ',

    '%s bushel of hay': '%s boisseau de foin',
    '%s bushels of hay': '%s boisseaux de foin',
    '%s carrot': '%s carotte',
    '%s carrots': '%s carottes',
    '%s shiny bell': '%s clochette brillante',
    '%s shiny bells': '%s clochettes brillantes',
    '%s, %s, and %s': '%s, %s et %s',
    'You are ordering %s, at a total cost of <strong>%s</strong> gold pieces.': 'Vous commandez %s, pour un co&ucirc;t total de <strong>%s</strong> pi&egrave;ces d\'or.',
    'Thank you.': 'Merci.'
};

var messages_1 = {
    'bushel of hay': 'boisseau de foin',
    'carrot': 'carotte',
}
var messages_2 = {
	'shiny bell': 'clochette brillante',
    'Thank you.': 'Merci.',
}

*/

//---------------------------------------------- HELPERS
function buildRuntimeHack(url){ return '['+'['+url+']'+']'; }
//----------------------------------------------------------------------

function add2statusbar( message ) {    I.add2statusbar( message ); }
function add2statusbarKO( message ) {    I.add2statusbarKO( message ); }
function add2statusbarOK( message ) {    I.add2statusbarOK( message ); }

//----------------------------------------------------------------------

//----------------------------------------------------------------------
if (!Array.prototype.forEach) //pour IE
{
    Array.prototype.forEach = function(fun /*, thisp*/)
    {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in this)
                fun.call(thisp, this[i], i, this);
        }
    };
}

//----------------------------------------------------------------------

if(String.prototype.trim==null)
    String.prototype.trim = function()
    {
        return this.replace(/(^\s*)|(\s*$)/g,'');
        //bizzarement \s ne remplacais pas les \n en debut de chain alors que
        // \s veut dire espace et \r ou \n en regexp-->balec, je fait bourrin
        //je viens de comprendre: chorme a un trim natif
        //return this.replace(/(^[\n\s\r]*)|([\n\s\r]*$)/g,'');
    }

if(String.prototype.alltrim==null)
    String.prototype.alltrim = function()
    {
        //return this.replace(/(^\s*)|(\s*$)/g,'');
        //bizzarement \s ne remplacais pas les \n en debut de chain alors que
        // \s veut dire espace et \r ou \n en regexp-->balec, je fait bourrin
        //je viens de comprendre: chorme a un trim natif
        return this.replace(/(^[\n\s\r]*)|([\n\s\r]*$)/g,'');
    }

if(String.prototype.trimBraquets==null)
    String.prototype.trimBraquets = function()
    {
        return this.replace(/(^[\[\]]*)|([\[\]]*$)/g,'');
    }

if(String.prototype.toTitleCase==null)
String.prototype.toTitleCase = function (global) {

    //According to ECMA-262 3rd Edition, \s, \S, ., ^, and $ use Unicode-based interpretations
    //while \d, \D, \w, \W, \b, and \B use ASCII-only interpretations
    if(typeof global == "undefined")
    //un seul, le premier
//    return this.replace(/\w\S*/, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        return this.replace(/.*\S*/, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    else
    //global
        return this.replace(/.*\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
//    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

//----------------------------------------------------------------------

//--------------------------------------------------------------------
/* ----------- Global Ajax Event Handlers
 * http://api.jquery.com/category/ajax/global-ajax-event-handlers/
 */
//("<div></div>")

$(document).ajaxComplete(
    function(event, xhr /*request*/ , settings) {

        url=settings.url;
        response=xhr.response;
        msg_header="<i style='color: darkRed'>"+__("CATCHED I/O FORMAT ERROR")+"<br></i>";
        div_header="<div style='margin-top: 8px; font-size:0.8em; line-height:1em;'>";
        diverr_header="<div style='margin-top: 8px; color: #DF0003'>";

        //si la reponse contient une redirection en mode ajax, redirection
        //in http://en.wikipedia.org/wiki/List_of_HTTP_header_fields
        //Non-standard header fields are conventionally marked by prefixing the field name with X- .
//voir aussi http://en.wikipedia.org/wiki/HTTP_302
        if (xhr.getResponseHeader('X-Location') != null){
            window.location = xhr.getResponseHeader('X-Location');
            //todo dans ce cas tout ce qui arrive derriere ne sera pas affiché
            //todo pourquoi dans ce cas on a une erreur ajax (callback_ko appelé) "302 found"

        };


//pas assez robuste
        //        data=jQuery.parseJSON( response );
//      $.jnotify(data.text, "warning",true);

//datatype:(xml, json, script, or html)

//si on attendait un html, mais qu'on a un json, alors c'est une erreur serveur remonté
        if( settings.dataType!="json"  && settings.dataType!="script"
        && settings.dataType != undefined // cas de http upload Ajaxisé
//si on load un html qui comporte du code javascript, ca doit pas etre affiché        
        && response && response.indexOf('"framework":"inducido"')!=-1)
        {
            msg_header+="<i style='color: darkRed;font-size: 12px;'>"+__("(HTML expected, received JSON)")+"<br></i>";
            response=response.replace(/[{}"]/gi, " ");
            response=response.replace(/,/gi, "<br>");
            response=msg_header+div_header+"url: "+url+"<br>"+diverr_header+response+"</div></div>";
            if(Inducido.env=="prod") console.error(response); else
            add2statusbarKO(response);
        }
        else
//si on attendait un json, mais qu'on a pas de json, alors c'est une erreur
        if(settings.dataType=="json" && response && response.indexOf('"framework":"inducido"')==-1)
        {
            msg_header+="<i style='color: darkRed;font-size: 12px;'>("+__("JSON expected")+")<br></i>";
            response=response.replace(/\\n/gi, "<br>");
            response=msg_header+div_header+"url: "+"url: "+url+"<br>"+diverr_header+response+"</div></div>";
            if(Inducido.env=="prod") console.error(response); else
            add2statusbarKO(response);
        }
        else
        //erreur de syntaxe dans le source php, exception
        if(settings.dataType==null && response && response.indexOf('"framework":"inducido"')!=-1)
        {
            msg_header+="<br>";
            response=response.replace(/[{}"]/gi, " ");
            response=response.replace(/,/gi, "<br>");
            response=msg_header+div_header+"url: "+"url: "+url+"<br>"+diverr_header+response+"</div></div>";
            if(Inducido.env=="prod") console.error(response); else
            add2statusbarKO(response);
        }
        //en cas d'erreur qui renvoie que du javascript comme:
        //"<script type="text/javascript">add2statusbarKO('Error code error4f6a0f1bbf624 Inducido_Excep...
        //qui apparait quand j'appelle ajax/feedback par exemple
        if(typeof response != "undefined")
            if("<script"==response.substr(0,"<script".length))
                eval(I.util.stripTags(response));

    });

//----------------------------------------------------------------------

// borrowed from jQuery easing plugin
// http://gsgd.co.uk/sandbox/jquery.easing.php
$.easing.easeOutBounce = function(x, t, b, c, d) {

    if ((t/= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t-= (1.5 / 2.75)) * t + .75) + b;
    } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t-= (2.25 / 2.75)) * t + .9375) + b;
    }
    return c * (7.5625 * (t-= (2.625 / 2.75)) * t + .984375) + b;
};

//----------------------------------------------------------------------

//---------------------------------------------- INIT
$(function(){
	if($.cookie)
	{ 
		if(Inducido && Inducido.base_url)
		$.cookie.defaults={ path: Inducido.base_url };
		else
		$.cookie.defaults={ path:'/' };

	    if(Inducido && Inducido.env!="prod") 
	    console.log('default cookie path: '+$.cookie.defaults.path); 		    
	}	
	
	//$.i18n.lang('en');
	
});
