!function(e,t,n){function r(e,t){return typeof e===t}function o(){var e,t,n,o,i,a,s;for(var l in b){if(e=[],t=b[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=r(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)a=e[i],s=a.split("."),1===s.length?S[s[0]]=o:(!S[s[0]]||S[s[0]]instanceof Boolean||(S[s[0]]=new Boolean(S[s[0]])),S[s[0]][s[1]]=o),x.push((o?"":"no-")+s.join("-"))}}function i(e){var t=C.className,n=S._config.classPrefix||"";if(E&&(t=t.baseVal),S._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}S._config.enableClasses&&(t+=" "+n+e.join(" "+n),E?C.className.baseVal=t:C.className=t)}function a(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):E?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function s(){var e=t.body;return e||(e=a(E?"svg":"body"),e.fake=!0),e}function l(e,n,r,o){var i,l,u,c,d="modernizr",f=a("div"),p=s();if(parseInt(r,10))for(;r--;)u=a("div"),u.id=o?o[r]:d+(r+1),f.appendChild(u);return i=a("style"),i.type="text/css",i.id="s"+d,(p.fake?p:f).appendChild(i),p.appendChild(f),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(t.createTextNode(e)),f.id=d,p.fake&&(p.style.background="",p.style.overflow="hidden",c=C.style.overflow,C.style.overflow="hidden",C.appendChild(p)),l=n(f,e),p.fake?(p.parentNode.removeChild(p),C.style.overflow=c,C.offsetHeight):f.parentNode.removeChild(f),!!l}function u(e,t){return!!~(""+e).indexOf(t)}function c(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function d(t,r){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(c(t[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];o--;)i.push("("+c(t[o])+":"+r+")");return i=i.join(" or "),l("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return n}function f(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function p(e,t,o,i){function s(){c&&(delete j.style,delete j.modElem)}if(i=r(i,"undefined")?!1:i,!r(o,"undefined")){var l=d(e,o);if(!r(l,"undefined"))return l}for(var c,p,m,h,v,g=["modernizr","tspan"];!j.style;)c=!0,j.modElem=a(g.shift()),j.style=j.modElem.style;for(m=e.length,p=0;m>p;p++)if(h=e[p],v=j.style[h],u(h,"-")&&(h=f(h)),j.style[h]!==n){if(i||r(o,"undefined"))return s(),"pfx"==t?h:!0;try{j.style[h]=o}catch(y){}if(j.style[h]!=v)return s(),"pfx"==t?h:!0}return s(),!1}function m(e,t){if("object"==typeof e)for(var n in e)A(e,n)&&m(n,e[n]);else{e=e.toLowerCase();var r=e.split("."),o=S[r[0]];if(2==r.length&&(o=o[r[1]]),"undefined"!=typeof o)return S;t="function"==typeof t?t():t,1==r.length?S[r[0]]=t:(!S[r[0]]||S[r[0]]instanceof Boolean||(S[r[0]]=new Boolean(S[r[0]])),S[r[0]][r[1]]=t),i([(t&&0!=t?"":"no-")+r.join("-")]),S._trigger(e,t)}return S}function h(e,t){return function(){return e.apply(t,arguments)}}function v(e,t,n){var o;for(var i in e)if(e[i]in t)return n===!1?e[i]:(o=t[e[i]],r(o,"function")?h(o,n||t):o);return!1}function g(e,t,n,o,i){var a=e.charAt(0).toUpperCase()+e.slice(1),s=(e+" "+M.join(a+" ")+a).split(" ");return r(t,"string")||r(t,"undefined")?p(s,t,o,i):(s=(e+" "+L.join(a+" ")+a).split(" "),v(s,t,n))}function y(e,t,r){return g(e,n,n,t,r)}var b=[],T={_version:"3.1.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){b.push({name:e,fn:t,options:n})},addAsyncTest:function(e){b.push({name:null,fn:e})}},S=function(){};S.prototype=T,S=new S;var x=[],C=t.documentElement,E="svg"===C.nodeName.toLowerCase(),w=T._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];T._prefixes=w;var _=function(e){function n(t,n){var o;return t?(n&&"string"!=typeof n||(n=a(n||"div")),t="on"+t,o=t in n,!o&&r&&(n.setAttribute||(n=a("div")),n.setAttribute(t,""),o="function"==typeof n[t],n[t]!==e&&(n[t]=e),n.removeAttribute(t)),o):!1}var r=!("onblur"in t.documentElement);return n}();T.hasEvent=_;var k=function(){var t=e.matchMedia||e.msMatchMedia;return t?function(e){var n=t(e);return n&&n.matches||!1}:function(t){var n=!1;return l("@media "+t+" { #modernizr { position: absolute; } }",function(t){n="absolute"==(e.getComputedStyle?e.getComputedStyle(t,null):t.currentStyle).position}),n}}();T.mq=k;var N={elem:a("modernizr")};S._q.push(function(){delete N.elem});var j={style:N.elem.style};S._q.unshift(function(){delete j.style});var A,z=(T.testProp=function(e,t,r){return p([e],n,t,r)},T.testStyles=l);!function(){var e={}.hasOwnProperty;A=r(e,"undefined")||r(e.call,"undefined")?function(e,t){return t in e&&r(e.constructor.prototype[t],"undefined")}:function(t,n){return e.call(t,n)}}(),T._l={},T.on=function(e,t){this._l[e]||(this._l[e]=[]),this._l[e].push(t),S.hasOwnProperty(e)&&setTimeout(function(){S._trigger(e,S[e])},0)},T._trigger=function(e,t){if(this._l[e]){var n=this._l[e];setTimeout(function(){var e,r;for(e=0;e<n.length;e++)(r=n[e])(t)},0),delete this._l[e]}},S._q.push(function(){T.addTest=m});E||!function(e,t){function n(e,t){var n=e.createElement("p"),r=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",r.insertBefore(n.lastChild,r.firstChild)}function r(){var e=E.elements;return"string"==typeof e?e.split(" "):e}function o(e,t){var n=E.elements;"string"!=typeof n&&(n=n.join(" ")),"string"!=typeof e&&(e=e.join(" ")),E.elements=n+" "+e,u(t)}function i(e){var t=C[e[S]];return t||(t={},x++,e[S]=x,C[x]=t),t}function a(e,n,r){if(n||(n=t),v)return n.createElement(e);r||(r=i(n));var o;return o=r.cache[e]?r.cache[e].cloneNode():T.test(e)?(r.cache[e]=r.createElem(e)).cloneNode():r.createElem(e),!o.canHaveChildren||b.test(e)||o.tagUrn?o:r.frag.appendChild(o)}function s(e,n){if(e||(e=t),v)return e.createDocumentFragment();n=n||i(e);for(var o=n.frag.cloneNode(),a=0,s=r(),l=s.length;l>a;a++)o.createElement(s[a]);return o}function l(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return E.shivMethods?a(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+r().join().replace(/[\w\-:]+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(E,t.frag)}function u(e){e||(e=t);var r=i(e);return!E.shivCSS||h||r.hasCSS||(r.hasCSS=!!n(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),v||l(e,r),e}function c(e){for(var t,n=e.getElementsByTagName("*"),o=n.length,i=RegExp("^(?:"+r().join("|")+")$","i"),a=[];o--;)t=n[o],i.test(t.nodeName)&&a.push(t.applyElement(d(t)));return a}function d(e){for(var t,n=e.attributes,r=n.length,o=e.ownerDocument.createElement(_+":"+e.nodeName);r--;)t=n[r],t.specified&&o.setAttribute(t.nodeName,t.nodeValue);return o.style.cssText=e.style.cssText,o}function f(e){for(var t,n=e.split("{"),o=n.length,i=RegExp("(^|[\\s,>+~])("+r().join("|")+")(?=[[\\s,>+~#.:]|$)","gi"),a="$1"+_+"\\:$2";o--;)t=n[o]=n[o].split("}"),t[t.length-1]=t[t.length-1].replace(i,a),n[o]=t.join("}");return n.join("{")}function p(e){for(var t=e.length;t--;)e[t].removeNode()}function m(e){function t(){clearTimeout(a._removeSheetTimer),r&&r.removeNode(!0),r=null}var r,o,a=i(e),s=e.namespaces,l=e.parentWindow;return!k||e.printShived?e:("undefined"==typeof s[_]&&s.add(_),l.attachEvent("onbeforeprint",function(){t();for(var i,a,s,l=e.styleSheets,u=[],d=l.length,p=Array(d);d--;)p[d]=l[d];for(;s=p.pop();)if(!s.disabled&&w.test(s.media)){try{i=s.imports,a=i.length}catch(m){a=0}for(d=0;a>d;d++)p.push(i[d]);try{u.push(s.cssText)}catch(m){}}u=f(u.reverse().join("")),o=c(e),r=n(e,u)}),l.attachEvent("onafterprint",function(){p(o),clearTimeout(a._removeSheetTimer),a._removeSheetTimer=setTimeout(t,500)}),e.printShived=!0,e)}var h,v,g="3.7.3",y=e.html5||{},b=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,T=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,S="_html5shiv",x=0,C={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",h="hidden"in e,v=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(n){h=!0,v=!0}}();var E={elements:y.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:g,shivCSS:y.shivCSS!==!1,supportsUnknownElements:v,shivMethods:y.shivMethods!==!1,type:"default",shivDocument:u,createElement:a,createDocumentFragment:s,addElements:o};e.html5=E,u(t);var w=/^$|\b(?:all|print)\b/,_="html5shiv",k=!v&&function(){var n=t.documentElement;return!("undefined"==typeof t.namespaces||"undefined"==typeof t.parentWindow||"undefined"==typeof n.applyElement||"undefined"==typeof n.removeNode||"undefined"==typeof e.attachEvent)}();E.type+=" print",E.shivPrint=m,m(t),"object"==typeof module&&module.exports&&(module.exports=E)}("undefined"!=typeof e?e:this,t),S.addTest("blobconstructor",function(){try{return!!new Blob}catch(e){return!1}},{aliases:["blob-constructor"]}),S.addTest("localstorage",function(){var e="modernizr";try{return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return!1}});var P="Moz O ms Webkit",M=T._config.usePrefixes?P.split(" "):[];T._cssomPrefixes=M;var L=T._config.usePrefixes?P.toLowerCase().split(" "):[];T._domPrefixes=L,T.testAllProps=g,T.testAllProps=y,S.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&y("transform","scale(1)",!0)});var O="CSS"in e&&"supports"in e.CSS,q="supportsCSS"in e;S.addTest("supports",O||q),S.addTest("csstransforms3d",function(){var e=!!y("perspective","1px",!0),t=S._config.usePrefixes;if(e&&(!t||"webkitPerspective"in C.style)){var n;S.supports?n="@supports (perspective: 1px)":(n="@media (transform-3d)",t&&(n+=",(-webkit-transform-3d)")),n+="{#modernizr{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0}}",z(n,function(t){e=9===t.offsetLeft&&5===t.offsetHeight})}return e}),S.addTest("preserve3d",y("transformStyle","preserve-3d")),S.addTest("inputsearchevent",_("search")),S.addTest("svg",!!t.createElementNS&&!!t.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect),S.addTest("details",function(){var e,t=a("details");return"open"in t?(z("#modernizr details{display:block}",function(n){n.appendChild(t),t.innerHTML="<summary>a</summary>b",e=t.offsetHeight,t.open=!0,e=e!=t.offsetHeight}),e):!1}),S.addTest("cors","XMLHttpRequest"in e&&"withCredentials"in new XMLHttpRequest),S.addTest("history",function(){var t=navigator.userAgent;return-1===t.indexOf("Android 2.")&&-1===t.indexOf("Android 4.0")||-1===t.indexOf("Mobile Safari")||-1!==t.indexOf("Chrome")||-1!==t.indexOf("Windows Phone")?e.history&&"pushState"in e.history:!1});var F=a("input"),H="autocomplete autofocus list placeholder max min multiple pattern required step".split(" "),$={};S.input=function(t){for(var n=0,r=t.length;r>n;n++)$[t[n]]=!!(t[n]in F);return $.list&&($.list=!(!a("datalist")||!e.HTMLDataListElement)),$}(H),S.addTest("json","JSON"in e&&"parse"in JSON&&"stringify"in JSON),S.addTest("webanimations","animate"in a("div")),S.addTest("checked",function(){return z("#modernizr {position:absolute} #modernizr input {margin-left:10px} #modernizr :checked {margin-left:20px;display:block}",function(e){var t=a("input");return t.setAttribute("type","checkbox"),t.setAttribute("checked","checked"),e.appendChild(t),20===t.offsetLeft})}),S.addTest("hsla",function(){var e=a("a").style;return e.cssText="background-color:hsla(120,40%,100%,.5)",u(e.backgroundColor,"rgba")||u(e.backgroundColor,"hsla")}),S.addTest("opacity",function(){var e=a("a").style;return e.cssText=w.join("opacity:.55;"),/^0.55$/.test(e.opacity)}),S.addTest("rgba",function(){var e=a("a").style;return e.cssText="background-color:rgba(150,255,150,.5)",(""+e.backgroundColor).indexOf("rgba")>-1}),S.addTest("target",function(){var t=e.document;if(!("querySelectorAll"in t))return!1;try{return t.querySelectorAll(":target"),!0}catch(n){return!1}}),S.addTest("progressbar",a("progress").max!==n),S.addTest("meter",a("meter").max!==n),S.addTest("template","content"in a("template")),S.addTest("time","valueAsDate"in a("time")),S.addTest("texttrackapi","function"==typeof a("video").addTextTrack),S.addTest("track","kind"in a("track")),S.addTest("contains",r(String.prototype.contains,"function")),S.addTest("placeholder","placeholder"in a("input")&&"placeholder"in a("textarea")),S.addTest("fetch","fetch"in e),o(),i(x),delete T.addTest,delete T.addAsyncTest;for(var D=0;D<S._q.length;D++)S._q[D]();e.Modernizr=S}(window,document);