/*!
 * inducido JavaScript Library v1.0.0
 * http://inducido.com/
 *
 * Copyright 2011, Nadir Boussoukaia
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: 17:32 08/10/2011
 */
 
//----------------------------------------------------------------------
 //utilisé par worker.js
//----------------------------------------------------------------------
 
//todo <!-- REPLACE "/admin" [[BASE]] -->
//Inducido_base_url="/admin";


//$(document).ready(function(){
	/* The following code is executed once the DOM is loaded */

var loader_unique_id=0;
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
//--------------------------------------------------------------------
function is_string(input){
    return typeof(input)=='string';
}

        //----------------------------------------------------------------------
//indique si l'url donné est une action au format [[controller/action]], sinon renvoie null
 function iActionURL(url)
 {
    if(url.trim().charAt(0)!='[') return null;

    tableau = url.trim().trimBraquets().split("/");
    
    if(tableau==null || tableau.length<2)return null;
    
    obj={ 
        'controller':tableau[tableau.length-2],
        'action':tableau[tableau.length-1],
        'folder':tableau.slice(0, tableau.length-2).join('/')
        };
        
    return obj;
 }               
//----------------------------------------------------------------------
//   img.src = iUrl("lowsec","load", { 'id':id } );
     
// appel du genre url("eval","login", array(id=>"1",nom=>"mickey") ) -->
//creation de l'url applicative définitive par defaut
//forme: url("eval/login", array(id=>"1",nom=>"mickey") );

/**
* @param mixed $action
* @param mixed $params
*/
function iUrl(controller,action,params,folder)
//todo le rendre parametrable
//todo: il faudrait 3 modes: URL_QUERY_STRING, URL_SEF, URL_REWRITE
{
//    <!-- //REPLACE ACTION /runtime/index.php?action=eval_login -->

        // Set the base URL
//        Inducido::$base_url = rtrim($settings['base_url'], '/');


     //Get the path from the base URL, including the index file

//todo il faudrait mettre application_url_prefix = "/runtime/index.php?" ou "/runtime/index.php/"
//todo ou alors un parametre front_controller=

//en cas d'appel en interne de la forme $text=i::url('eval/resultat');
//je prefere cette ecriture, c'est moins chiant que de passer 2 parametres
if(action==null)
{
    ca=explode('/',controller);
    controller=array_shift(ca);
    action=array_shift(ca);
}

var url=withslash(Inducido_base_url)+withslash(folder)+"index.php?"
+"action="+controller
+ifne("_",action)
+ifne("&",(params==null)?"":http_build_query(params));

return url;
}
//--------------------------------------------------------------------
// (if not empty) return the string 'header.value" if value not null
//used like this: ifne("&",ifne("userid=",$_REQUEST["userid"]))
function ifne(header,value)
{
    return (!empty(value))?header+value:"";
}
//--------------------------------------------------------------------
function withslash(destination)
{
    //si chaine vide ne renvoie pas '/' tout seul
if(empty(destination))
    return "";

    if (php_substr(destination, -1, 1) != '/' && php_substr(destination, -1, 1) != '\\')
        return destination + '/';

    return destination;
}


var I={ 
 "url": iUrl 
}