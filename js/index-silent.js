!function(){"use strict";var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},n=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),r=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},i=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},o=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},a=function(){function e(){t(this,e)}return n(e,[{key:"render",value:function(){return k(this.template)}},{key:"bind",value:function(){}},{key:"template",get:function(){}},{key:"el",get:function(){return this._el||(this._el=this.render(),this.bind(this._el)),this._el}}]),e}(),s=function(e){function o(e,n,r){t(this,o);var a=i(this,(o.__proto__||Object.getPrototypeOf(o)).call(this));return a._value=e,a._type=n,a._isPrimitive=r,a}return r(o,a),n(o,[{key:"value",get:function(){return this._value}},{key:"type",get:function(){return this._type}},{key:"isPrimitive",get:function(){return this._isPrimitive}}]),o}(),c="log",l="dir",u="preview",d="error",_="console__item-head",h="console__item-head_size",p="console__item-head_elements",f="console__item-content-container",v=function(e){function o(e,n){t(this,o);var r=i(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,e,"object",!1));return r._mode=n,r._entries=new Map,r._instanceOfOther="[object Object]"!==e.toString(),r._isOpened=!1,r}return r(o,s),n(o,[{key:"bind",value:function(){var e=this,t=this.el.querySelector("."+_);this._contentContainerEl=this.el.querySelector("."+f);var n=this._getHeadContent();n instanceof HTMLElement||n instanceof DocumentFragment?t.appendChild(n):t.innerHTML=n,this._mode!==u&&t.addEventListener("click",function(){e._isOpened?e._hideContent():e._showContent(),e._isOpened=!e._isOpened})}},{key:"_showContent",value:function(){this._proxiedContentEl||(this._proxiedContentEl=k('<div class="console__item-content"></div>'),this._proxiedContentEl.appendChild(this.createContent(this.value,!1))),this._contentContainerEl.appendChild(this._proxiedContentEl)}},{key:"_hideContent",value:function(){this._contentContainerEl.innerHTML=""}},{key:"_getHeadContent",value:function(){return this._instanceOfOther?this._mode===l?this._getHeadDirContent():this._mode===c?this._getHeadDirContent():this._mode===u?this._getHeadDirContent():this._mode===d?this._getHeadDirContent():"":this._mode!==u?this.createContent(this.value,!0):"..."}},{key:"_getHeadPreviewContent",value:function(){}},{key:"_getHeadLogContent",value:function(){}},{key:"_getHeadErrorContent",value:function(){}},{key:"_getHeadDirContent",value:function(){if(this.value instanceof HTMLElement){var e=this.value.tagName.toLowerCase();return this.value.classList.length&&(e+="."+Array.prototype.join.call(this.value.classList,".")),e}return this.value instanceof Error?this.value.stack:this.value.constructor.name}},{key:"createContent",value:function(e,t){var n=document.createDocumentFragment(),r=new Set;for(var i in e){r.add(i);var a=e[i],s=E(a,t?u:l),c=o.createEntryEl(i,s.el);n.appendChild(c)}var d=!0,_=!1,h=void 0;try{for(var p,f=Object.getOwnPropertyNames(e)[Symbol.iterator]();!(d=(p=f.next()).done);d=!0){var v=p.value;if(!r.has(v)){var y=e[v],m=E(y,t?u:l),C=o.createEntryEl(v,m.el);n.appendChild(C)}}}catch(e){_=!0,h=e}finally{try{!d&&f.return&&f.return()}finally{if(_)throw h}}return n}},{key:"template",get:function(){return'\n<div class="object '+(this._instanceOfOther?"":"object_Object")+" "+(this._mode===d?""+this._mode:"")+' console__item">  <div class="'+_+'"></div>  <div class="'+f+'"></div></div>'}}],[{key:"createEntryEl",value:function(e,t){var n=k('<span class="object__entry object-entry">\n  <span class="object-entry__key">'+e+'</span><span class="object-entry__value-container"></span>\n</span>');return n.querySelector(".object-entry__value-container").appendChild(t),n}}]),o}(),y=function(e){function o(e,n){t(this,o);var r=i(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,e,"array",!1));return r._arr=e,r._mode=n,r._elements=new Map,r._isOpened=!1,r}return r(o,s),n(o,[{key:"bind",value:function(){var e=this;if(this._mode!==u){this._contentContainerEl=this.el.querySelector("."+f);var t=this.el.querySelector("."+_);t.appendChild(this.createContent(this.value,!0)),t.addEventListener("click",function(){e._isOpened?e._hideContent():e._showContent(),e._isOpened=!e._isOpened})}}},{key:"_showContent",value:function(){this._proxiedContentEl||(this._proxiedContentEl=k('<div class="console__item-content"></div>'),this._proxiedContentEl.appendChild(this.createContent(this.value,!1))),this._contentContainerEl.appendChild(this._proxiedContentEl)}},{key:"_hideContent",value:function(){this._contentContainerEl.innerHTML=""}},{key:"createContent",value:function(e,t){var n=Object.getOwnPropertyNames(e),r=Object.keys(e),i=document.createDocumentFragment(),a=!0,s=!1,c=void 0;try{for(var d,_=n[Symbol.iterator]();!(a=(d=_.next()).done);a=!0){var h=d.value,p=e[h],f=r.indexOf(h),v=Number.isNaN(Number.parseInt(h,10));if(!t||-1!==f){var y=E(p,t?u:l),m=o.createEntryEl(h,y.el,t?!v:t);i.appendChild(m)}}}catch(e){s=!0,c=e}finally{try{!a&&_.return&&_.return()}finally{if(s)throw c}}return i}},{key:"template",get:function(){return'<div class="array console__item">\n  <div class="'+_+" "+(this._mode===u?h:p)+'">'+(this._mode===u?"Array("+this._arr.length+")":"")+'</div>  <div class="'+f+'"></div>\n</div>'}}],[{key:"createEntryEl",value:function(e,t,n){var r=k('<span class="array__entry array-entry">  '+(n?"":'<span class="array-entry__key">'+e+"</span>")+'<span class="array-entry__value-container"></span></span>');return r.querySelector(".array-entry__value-container").appendChild(t),r}}]),o}(),m="plain",C="arrow",g="class",b=function(e){function o(e,n){t(this,o);var r=i(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,e,"function",!1));return r._mode=n,r._isOpened=!1,r._fnType=o.checkFnType(e),r}return r(o,s),n(o,[{key:"bind",value:function(){var e=this;if(this._mode===l){this._contentContainerEl=this.el.querySelector("."+f);this.el.querySelector("."+_).addEventListener("click",function(){e._isOpened?e._hideContent():e._showContent(),e._isOpened=!e._isOpened})}}},{key:"_showContent",value:function(){this._proxiedContentEl||(this._proxiedContentEl=k('<div class="console__item-content"></div>'),this._proxiedContentEl.appendChild(this.createContent(this.value))),this._contentContainerEl.appendChild(this._proxiedContentEl)}},{key:"_hideContent",value:function(){this._contentContainerEl.innerHTML=""}},{key:"_getHeadMarkup",value:function(){var e=this._parseFunction(this.value),t=e.name,n=e.params,r=e.lines.join("\n"),i="<span>"+(this._fnType===g?"class ":"")+(this._fnType===m?"f ":"")+(t||"")+(this._fnType!==g?"("+n.join(", ")+")":"")+(this._fnType===C?" => ":" ");return this._fnType!==g&&(i+="{  "+(r.length<=43?r:"...")+"}"),i+="</span>"}},{key:"_getLogMarkup",value:function(){return"<pre>"+this.value.toString()+"</pre>"}},{key:"_parseParams",value:function(e){var t=e.indexOf("("),n=e.indexOf(")"),r=e.substring(t+1,n).trim();return r?r.split(",").map(function(e){return e.trim()}):[]}},{key:"_parseName",value:function(e){var t=void 0;this._fnType===g?t="{":this._fnType===m&&(t="(");var n=void 0,r=new RegExp("(?:class|function)\\s+(\\w+)\\s*(?:\\"+t+")").exec(e);return null!==r&&(n=r[1]),n}},{key:"_parseBody",value:function(e){var t=e.indexOf("{"),n=e.lastIndexOf("}"),r=e.substring(t+1,n).trim();return r?r.split("\n").map(function(e){return e.trim()}):[]}},{key:"_parseFunction",value:function(e){var t=void 0;return"string"!=typeof e&&(t=e.toString()),{name:this._parseName(t),params:this._parseParams(t),lines:this._parseBody(t)}}},{key:"createContent",value:function(e){var t=document.createDocumentFragment(),n=!0,r=!1,i=void 0;try{for(var a,s=["name","prototype","caller","arguments","length","__proto__"][Symbol.iterator]();!(n=(a=s.next()).done);n=!0){var c=a.value,u=void 0;try{u=e[c]}catch(e){continue}var d=E(u,l),_=o.createEntryEl(c,d.el);t.appendChild(_)}}catch(e){r=!0,i=e}finally{try{!n&&s.return&&s.return()}finally{if(r)throw i}}return t}},{key:"template",get:function(){var e='<div class="function console__item">';switch(this._mode){case u:e+="f";break;case l:e+='<div class="'+_+'">'+this._getHeadMarkup()+'</div><div class="'+f+'"></div>';break;case c:e+=this._getLogMarkup()}return e+="</div>"}}],[{key:"checkFnType",value:function(e){var t=e.toString(),n=t.indexOf("("),r=t.indexOf("class"),i=t.indexOf("=>");return-1!==r&&r<n?g:-1!==i&&i>n?C:m}},{key:"createEntryEl",value:function(e,t){var n=k('<span class="object__entry object-entry">\n  <span class="object-entry__key">'+e+'</span><span class="object-entry__value-container"></span>\n</span>');return n.querySelector(".object-entry__value-container").appendChild(t),n}}]),o}(),w=function(e){function o(e,n){return t(this,o),i(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,e,n,!0))}return r(o,s),n(o,[{key:"template",get:function(){var e=this.type,t=this.value,n="";switch(e){case"undefined":n='<div class="console__item '+e+'">'+e+"</div>";break;case"number":n=isNaN(t)?'<div class="console__item NaN">NaN</div>':t===1/0||t===-1/0?'<div class="console__item number">'+(t===-1/0?"-":"")+"Infinity</div>":'<div class="console__item '+e+'">'+t+"</div>";break;case"string":n='<div class="console__item '+e+'">"'+t+'"</div>';break;case"null":case"boolean":n='<div class="console__item '+e+'">'+t+"</div>";break;case"symbol":n='<div class="console__item '+e+'">'+t.toString()+"</div>";break;case"object":if(null===t){n='<div class="console__item null">'+t+"</div>";break}}return n}}]),o}(),k=function(e){var t=document.createElement("div");return t.innerHTML=e,t.firstElementChild},E=function(t,n){var r=void 0,i=void 0===t?"undefined":e(t);switch(i){case"function":r=new b(t,n);break;case"object":r=null!==t?Array.isArray(t)?new y(t,n):new v(t,n):new w(t,i);break;default:r=new w(t,i)}return r},O="log",j="dir",x="error",S=function(e,t){var n=k('<div class="console__row"></div>');return e.forEach(function(e){n.appendChild(E(e,t).el)}),n},H=[],L=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];H.push(t)};window.onerror=L,window.console.warn=L,window.console.error=L;var T=[],M=function(){T.push.apply(T,arguments)};window.console.info=M,window.console.log=M,window.console.debug=M;var P=function(){var e=window.document.createElement("div"),t=function(e){if(!e)throw Error("Console is not inited!");var t={};return t.log=function(){for(var n=arguments.length,r=Array(n),i=0;i<n;i++)r[i]=arguments[i];e.appendChild(S(r,O)),"function"==typeof t.onlog&&t.onlog(r)},t.error=function(t){var n=k('<div class="console__row"></div>');t instanceof Error?n.appendChild(E(t,x).el):"string"==typeof t&&n.appendChild(E(new Error(t),x).el),e.appendChild(n)},t.clean=function(){e.innerHTML=""},t.getLogSource=function(){return e.innerHTML},t.dir=function(){for(var n=arguments.length,r=Array(n),i=0;i<n;i++)r[i]=arguments[i];e.appendChild(S(r,j)),"function"==typeof t.onlog&&t.onlog(r)},t.extend=function(e){return e.log=t.log,e.info=t.log,e.error=t.error,e.warn=t.error,e.dir=t.dir,e},t}(e);window.document.body.appendChild(e),t.extend(window.console),H.forEach(function(e){t.error.apply(t,[t].concat(o(e)))}),T.forEach(function(e){t.log.apply(t,[t].concat(o(e)))}),window.onerror=function(e){t.error(e)}};window.addEventListener("DOMContentLoaded",function(){P(),function(){var e=window.document.createElement("link");e.rel="stylesheet",e.href="//htmlacademy.github.io/console.js/css/style.css",window.document.head.appendChild(e)}()})}();
//# sourceMappingURL=index-silent.js.map
