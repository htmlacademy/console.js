!function(){"use strict";var r=function(e){var t=document.createElement("div");return t.innerHTML=e,t.firstElementChild},o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},t=function(){function i(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}}(),n=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},l=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},a=function(){function e(){s(this,e)}return t(e,[{key:"render",value:function(){return r(this.template)}},{key:"bind",value:function(){}},{key:"template",get:function(){}},{key:"el",get:function(){return this._el||(this._el=this.render(),this.bind(this._el)),this._el}}]),e}(),i="log",d="dir",h="preview",p="prop",c="error",u={FUNCTION:"function",OBJECT:"object",ARRAY:"array",PRIMITIVE:"primitive"},_=function(e,t,n){return void 0===n?e.classList.toggle(t):n?(e.classList.add(t),!0):(e.classList.remove(t),!1)},v=function(e){function i(e,t){s(this,i);var n=l(this,(i.__proto__||Object.getPrototypeOf(i)).call(this));return e.parentView&&(n._parentView=e.parentView,n._rootViewType=e.parentView._rootViewType),n._viewType=null,n._console=t,n._value=e.val,n._mode=e.mode,n._type=e.type,n._isOpened=!1,n._currentDepth="number"==typeof e.depth?e.depth:1,n._templateParams={},n}return n(i,a),t(i,[{key:"afterRender",value:function(){}},{key:"bind",value:function(){this._headEl=this.el.querySelector(".item__head"),this._headContentEl=this._headEl.querySelector(".item__head-content"),this._headInfoEl=this._headEl.querySelector(".item__head-info"),this._templateParams.withHeadContentlength&&(this._headContentLengthEl=this._headEl.querySelector(".item__head-content-length")),this._contentEl=this.el.querySelector(".item__content"),this.afterRender()}},{key:"_getStateProxyObject",value:function(){return{}}},{key:"_getStateCommonProxyObject",value:function(){var t=this;return{set isShowInfo(e){t.toggleInfoShowed(e)},set isShowLength(e){t.toggleContentLengthShowed(e)},set isHeadContentShowed(e){t.toggleHeadContentShowed(e)},set isOpeningDisabled(e){t._mode!==h&&t._isOpeningDisabled!==e&&(t.togglePointer(!e),t._addOrRemoveHeadClickHandler(!e),t.state.isContentShowed=!e&&t._isAutoExpandNeeded,t._isOpeningDisabled=e)},get isOpeningDisabled(){return t._isOpeningDisabled},set isContentShowed(e){t.toggleArrowBottom(e),t._isContentShowed=t.toggleContentShowed(e),t._isContentShowed&&0===t._contentEl.childElementCount&&t._contentEl.appendChild(t.createContent(t.value,!1).fragment)},get isContentShowed(){return t._isContentShowed}}}},{key:"toggleHeadContentBraced",value:function(e){return _(this._headContentEl,"entry-container--braced",e)}},{key:"toggleHeadContentOversized",value:function(e){return _(this._headContentEl,"entry-container--oversize",e)}},{key:"toggleInfoShowed",value:function(e){return!_(this._headInfoEl,"hidden",!e)}},{key:"toggleContentLengthShowed",value:function(e){return!_(this._headContentLengthEl,"hidden",!e)}},{key:"toggleHeadContentShowed",value:function(e){return!_(this._headContentEl,"hidden",!e)}},{key:"toggleContentShowed",value:function(e){return!_(this._contentEl,"hidden",!e)}},{key:"toggleError",value:function(e){return _(this.el,c,e)}},{key:"toggleItalic",value:function(e){return _(this._headEl,"item__head--italic",e)}},{key:"togglePointer",value:function(e){return _(this._headEl,"item__head--pointer",e)}},{key:"toggleArrowBottom",value:function(e){return _(this._headEl,"item__head--arrow-bottom",e)}},{key:"_additionHeadClickHandler",value:function(){}},{key:"_headClickHandler",value:function(e){e.preventDefault(),this.toggleArrowBottom(),this.state.isContentShowed=!this.state.isContentShowed,this._additionHeadClickHandler()}},{key:"_addOrRemoveHeadClickHandler",value:function(e){this._bindedHeadClickHandler||(this._bindedHeadClickHandler=this._headClickHandler.bind(this)),e?this._headEl.addEventListener("click",this._bindedHeadClickHandler):this._headEl.removeEventListener("click",this._bindedHeadClickHandler)}},{key:"template",get:function(){return'<div class="console__item item item--'+this._viewType+'">  <div class="item__head">    <span class="item__head-info hidden"></span>    '+(this._templateParams.withHeadContentlength?'<span class="item__head-content-length hidden">'+this.value.length+"</span>":"")+'    <div class="item__head-content entry-container entry-container--head entry-container--'+this._viewType+' hidden"></div>  </div>  <div class="item__content entry-container entry-container--'+this._viewType+' hidden"></div></div>'}},{key:"state",set:function(e){for(var t in this._state||(this._state={},Object.defineProperties(this._state,Object.getOwnPropertyDescriptors(this._getStateCommonProxyObject())),Object.defineProperties(this._state,Object.getOwnPropertyDescriptors(this._getStateProxyObject())),Object.seal(this._state)),e)this._state[t]=e[t]},get:function(){return this._state}},{key:"value",get:function(){return this._value}},{key:"mode",get:function(){return this._mode}},{key:"nextNestingLevel",get:function(){return this._currentDepth+1}},{key:"_isAutoExpandNeeded",get:function(){if(!this._isAutoExpandNeededProxied){if(this._isAutoExpandNeededProxied=!1,null===this._viewType||this._currentDepth>this._console.params[this._rootViewType].expandDepth)return this._isAutoExpandNeededProxied;var e=!1;this._parentView&&this._parentView._isAutoExpandNeeded?e=!0:Object.keys(this.value).length>=this._console.params[this._rootViewType].minFieldsToExpand&&(e=!0),e&&!this._console.params[this._rootViewType].exclude.includes(this._viewType)&&(this._isAutoExpandNeededProxied=!0)}return this._isAutoExpandNeededProxied}}],[{key:"createEntryEl",value:function(e,t,n){var i=r('<span class="entry-container__entry">  '+(n?"":'<span class="entry-container__key">'+e+"</span>")+'<span class="entry-container__value-container"></span></span>');return i.querySelector(".entry-container__value-container").appendChild(t),i}}]),i}(),f=function(e){function r(e,t){s(this,r);var n=l(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,e,t));n._viewType=u.OBJECT,e.parentView||(n._rootViewType=n._viewType);var i=Object.prototype.toString.call(n.value);return n._stringTagName=i.substring(8,i.length-1),n._constructorName=n.value.constructor.name,n}return n(r,v),t(r,[{key:"afterRender",value:function(){var e=this._getHeadContent(),t=e.elOrStr,n=e.stateParams,i=e.headContentClassName;this._headContent=t,i&&this._headContentEl.classList.add(i),"Object"===this._constructorName&&"Object"!==this._stringTagName?this._headInfoEl.textContent=this._stringTagName:this._headInfoEl.textContent=this._constructorName,this.state=n,window.consoleViews.set(this.el,this)}},{key:"_getStateProxyObject",value:function(){var t=this;return{set isShowInfo(e){t.toggleInfoShowed(e)},set isHeadContentShowed(e){t._headContentEl.innerHTML||(t._headContent instanceof HTMLElement||t._headContent instanceof DocumentFragment?t._headContentEl.appendChild(t._headContent):t._headContentEl.innerHTML=t._headContent),t.toggleHeadContentShowed(e)},set isBraced(e){t.toggleHeadContentBraced(e)},set isOversized(e){t.toggleHeadContentOversized(e)},set isStringified(e){e||t._mode!==i&&t._mode!==c||t._parentView||t.toggleItalic(e),e&&t._mode===c&&t.toggleError(e)}}}},{key:"_getHeadContent",value:function(){var e=void 0;return this._mode===d?e=this._getHeadDirContent():this._mode===i||this._mode===p||this._mode===c?e=this._getHeadLogContent():this._mode===h&&(e=this._getHeadPreviewContent()),e}},{key:"_getHeadPreviewContent",value:function(){return"Object"===this._stringTagName?{elOrStr:"...",stateParams:{isShowInfo:!1,isHeadContentShowed:!0,isBraced:!0}}:this._getHeadDirContent()}},{key:"_getHeadLogContent",value:function(){var e=void 0,t=!1,n=!0,i=!1,r=!1,a=!1,o=void 0;if(this.value instanceof HTMLElement&&Object.getPrototypeOf(this.value).constructor!==HTMLElement)return this._getHeadDirContent();if(this.value instanceof Error)n=!1,e=this.value.toString(),a=!0;else if(this.value instanceof Number){e=this._console.createTypedView(Number.parseInt(this.value,10),h,this.nextNestingLevel,this).el,t=!0}else if(this.value instanceof String){e=this._console.createTypedView(this.value.toString(),h,this.nextNestingLevel,this).el,t=!0}else if(this.value instanceof Date)e=this.value.toString(),a=!0,n=!1;else if(this.value instanceof RegExp)e="/"+this.value.source+"/"+this.value.flags,o="regexp",i=!0,n=!1;else{var s=this.createContent(this.value,!0);e=s.fragment,r=s.isOversized,"Object"===this._stringTagName&&"Object"===this._constructorName||(t=!0)}return{elOrStr:e,headContentClassName:o,stateParams:{isShowInfo:t,isHeadContentShowed:!0,isBraced:n,isOpeningDisabled:i,isOversized:r,isStringified:a}}}},{key:"_getHeadDirContent",value:function(){var e=void 0,t=!1,n=!0;if(this.value instanceof HTMLElement){var i=this.value.tagName.toLowerCase();i+=this.value.id,this.value.classList.length&&(i+="."+Array.prototype.join.call(this.value.classList,".")),e=i}else this.value instanceof Date?e=this.value.toString():this.value instanceof RegExp?e="/"+this.value.source+"/"+this.value.flags:this.value instanceof Error?e=this.value.toString():(e=this.value,t=!0,n=!1);return{elOrStr:e,stateParams:{isShowInfo:t,isHeadContentShowed:n,isBraced:!1,isOpeningDisabled:!1}}}},{key:"createContent",value:function(e,t){var n=document.createDocumentFragment(),i=new Set;for(var r in e)if(!t||e.hasOwnProperty(r)){if(t&&i.size===this._console.params[this._viewType].maxFieldsInHead)return{fragment:n,isOversized:!0};try{var a=e[r];n.appendChild(this._createObjectEntryEl(r,a,t)),i.add(r)}catch(e){}}var o=Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e)),s=!0,l=!1,d=void 0;try{for(var h,c=o[Symbol.iterator]();!(s=(h=c.next()).done);s=!0){var u=h.value;if(!i.has(u)){if(t&&i.size===this._console.params[this._viewType].maxFieldsInHead)return{fragment:n,isOversized:!0};try{var _=e[u];n.appendChild(this._createObjectEntryEl(u,_,t)),i.add(u)}catch(e){}}}}catch(e){l=!0,d=e}finally{try{!s&&c.return&&c.return()}finally{if(l)throw d}}return{fragment:n,isOversized:!1}}},{key:"_createObjectEntryEl",value:function(e,t,n){var i=this._console.createTypedView(t,n?h:p,this.nextNestingLevel,this);return r.createEntryEl(e.toString(),i.el)}}]),r}(),y=function(e){function a(e,t){s(this,a);var n=l(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,e,t));return n._viewType=u.ARRAY,e.parentView||(n._rootViewType=n._viewType),n._templateParams.withHeadContentlength=!0,n}return n(a,v),t(a,[{key:"afterRender",value:function(){this.toggleHeadContentBraced(),this._headInfoEl.textContent=this.value.constructor.name,this.state=this._getStateParams(),this._mode!==i&&this._mode!==c||this._parentView||this.toggleItalic(!0)}},{key:"_getStateProxyObject",value:function(){var t=this;return{set isHeadContentShowed(e){e&&0===t._headContentEl.childElementCount&&t._headContentEl.appendChild(t.createContent(t.value,!0).fragment),t.toggleHeadContentShowed(e)}}}},{key:"_additionHeadClickHandler",value:function(){this._mode===p&&(this.state.isShowInfo=this._isContentShowed,this.state.isHeadContentShowed=!this._isContentShowed,this.state.isShowLength=this._isContentShowed||1<this.value.length)}},{key:"_getStateParams",value:function(){var e=!1,t=!0,n=1<this.value.length;return this._mode===d?(t=!1,n=e=!0):this._mode===h?(t=!1,n=e=!0):this._mode===p&&(e=!1,t=!0),{isShowInfo:e,isHeadContentShowed:t,isShowLength:n,isOpeningDisabled:!1}}},{key:"createContent",value:function(e,t){var n=Object.keys(e),i=new Set,r=document.createDocumentFragment(),a=!0,o=!1,s=void 0;try{for(var l,d=n[Symbol.iterator]();!(a=(l=d.next()).done);a=!0){var h=l.value;i.add(h);var c=e[h];r.appendChild(this._createArrayEntryEl(h,c,t))}}catch(e){o=!0,s=e}finally{try{!a&&d.return&&d.return()}finally{if(o)throw s}}var u=!0,_=!1,p=void 0;try{for(var v,f=Object.getOwnPropertyNames(e)[Symbol.iterator]();!(u=(v=f.next()).done);u=!0){var y=v.value;if(!i.has(y)&&(!t||-1!==n.indexOf(y))){c=e[y];r.appendChild(this._createArrayEntryEl(y,c,t))}}}catch(e){_=!0,p=e}finally{try{!u&&f.return&&f.return()}finally{if(_)throw p}}return{fragment:r}}},{key:"_createArrayEntryEl",value:function(e,t,n){var i=Number.isNaN(Number.parseInt(e,10)),r=this._console.createTypedView(t,n?h:p,this.nextNestingLevel,this);return a.createEntryEl(e.toString(),r.el,n?!i:n)}}]),a}(),m="plain",g="arrow",w="class",b=function(e){function _(e,t){s(this,_);var n=l(this,(_.__proto__||Object.getPrototypeOf(_)).call(this,e,t));return n._viewType=u.FUNCTION,e.parentView||(n._rootViewType=n._viewType),n._fnType=_.checkFnType(n.value),n}return n(_,v),t(_,[{key:"afterRender",value:function(){switch(this._headEl.classList.add("item__head--italic"),this._headInfoEl.classList.add("item__head-info--function"),this._fnType){case w:this._headInfoEl.textContent="class";break;case m:case g:this._headInfoEl.textContent="f"}var e=!1;switch(this._fnType!==g&&(e=!0),this._mode){case p:this._headContentEl.innerHTML=this._getHeadPropMarkup();break;case d:this._headContentEl.innerHTML=this._getHeadDirMarkup();break;case i:case c:this._headContentEl.innerHTML=this._getHeadLogMarkup();break;case h:e=!0}var t={isOpeningDisabled:!1,isShowInfo:e,isHeadContentShowed:this._mode!==h};this._mode!==d&&this._mode!==p&&(t.isOpeningDisabled=!0),this.state=t}},{key:"_getHeadPropMarkup",value:function(){var e=this._parseBody(),t=this._parseParams(),n=e.join("\n"),i="<span>"+(this.value.name?this.value.name:"")+(this._fnType!==w?"("+t.join(", ")+")":"")+(this._fnType===g?" => ":" ");return this._fnType===g&&(i+=""+(n.length<=43?n:"{...}")),i+="</span>"}},{key:"_getHeadDirMarkup",value:function(){var e=this._parseParams();return(this.value.name?this.value.name:"")+(this._fnType===m?"("+e.join(", ")+")":"")+(this._fnType===g?"()":"")}},{key:"_getHeadLogMarkup",value:function(){var e=this._parseBody(),t=this._parseParams();return"<pre>"+(this.value.name&&this._fnType!==g?this.value.name+" ":"")+(this._fnType!==w?"("+t.join(", ")+")":"")+(this._fnType===g?" => ":" ")+e.join("\n")+"</pre>"}},{key:"_parseParams",value:function(){var e=this.value.toString(),t=e.indexOf("("),n=e.indexOf(")"),i=e.substring(t+1,n).trim();return i?i.split(",").map(function(e){return e.trim()}):[]}},{key:"_parseBody",value:function(){var e=this.value.toString(),t=void 0;if(this._fnType===g){var n=e.indexOf("=>");t=e.substring(n+2).trim()}else{var i=e.indexOf("{"),r=e.lastIndexOf("}");t=e.substring(i,r+1).trim()}return t?t.split("\n"):[]}},{key:"createContent",value:function(e){var t=document.createDocumentFragment(),n=Object.keys(e).concat(["name","prototype","length","__proto__"]),i=!0,r=!1,a=void 0;try{for(var o,s=n[Symbol.iterator]();!(i=(o=s.next()).done);i=!0){var l=o.value,d=void 0;try{var h=e[l];if(void 0===h)continue;d=h}catch(e){continue}var c=this._console.createTypedView(d,p,this.nextNestingLevel,this),u=_.createEntryEl(l.toString(),c.el);t.appendChild(u)}}catch(e){r=!0,a=e}finally{try{!i&&s.return&&s.return()}finally{if(r)throw a}}return{fragment:t}}}],[{key:"checkFnType",value:function(e){var t=e.toString(),n=t.indexOf("("),i=t.indexOf("class"),r=t.indexOf("=>");return-1!==i&&(-1===n||i<n)?w:-1!==r&&n<r?g:m}}]),_}(),C=function(e){function i(e,t){s(this,i);var n=l(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,e,t));return n._viewType=u.PRIMITIVE,n}return n(i,v),t(i,[{key:"bind",value:function(){var t=this;this._mode===p&&"string"===this._type&&this.el.addEventListener("click",function(e){e.preventDefault(),t.el.classList.toggle("string--nowrap")})}},{key:"escapeHtml",value:function(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}},{key:"template",get:function(){var e=this._type,t=this.value,n="";switch("string"!==e&&"symbol"!==e||("symbol"===e&&(t=t.toString()),t=this.escapeHtml(t)),e){case"undefined":case"null":case"boolean":n='<div class="console__item item item--primitive '+e+'">'+t+"</div>";break;case"number":n=Number.isNaN(t)?'<div class="console__item item item--primitive NaN">NaN</div>':t===1/0||t===-1/0?'<div class="console__item item item--primitive number">'+(t===-1/0?"-":"")+"Infinity</div>":'<div class="console__item item item--primitive '+e+'">'+t+"</div>";break;case"string":var i=void 0;i=this._mode===h&&100<t.length?t.substr(0,50)+"..."+t.substr(-50):t,n='<pre class="console__item item item--primitive string '+(this._mode===p||this._mode===h?"string--nowrap":"")+" "+(this._mode===p?"pointer":"")+" "+(this._mode===c?""+this._mode:"")+'">'+i+"</pre>";break;case"symbol":n='<div class="console__item item item--primitive symbol">'+t+"</div>";break;case"object":if(null===t){n='<div class="console__item item item--primitive null">'+t+"</div>";break}}return n}}]),i}(),E=function(){function n(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};if(s(this,n),!e)throw new Error("Console is not inited!");window.consoleViews=new Map,this._container=e,this.params={object:this._parseParams(t.object,"object"),array:this._parseParams(t.array,"array"),function:this._parseParams(t.function,"function")}}return t(n,[{key:"_parseParams",value:function(e,t){if(e?("number"==typeof e.expandDepth&&0<e.expandDepth&&(e.minFieldsToExpand="number"==typeof e.minFieldsToExpand&&0<e.minFieldsToExpand?e.minFieldsToExpand:0),e.maxFieldsInHead="number"==typeof e.maxFieldsInHead&&0<e.maxFieldsInHead?e.maxFieldsInHead:5):(e={},"object"===t&&(e.maxFieldsInHead=5)),Array.isArray(e.exclude)){var n=[];for(var i in u)if(u.hasOwnProperty(i)){var r=u[i];n.push(r)}if(!e.exclude.every(function(e){return n.includes(e)}))throw new Error("Provided type to exclude is not in available types")}else e.exclude=[];return e}},{key:"onlog",value:function(){}},{key:"ondir",value:function(){}},{key:"onerror",value:function(){}},{key:"log",value:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];this._container.appendChild(this._getRowEl(t,i)),this.onlog()}},{key:"error",value:function(e){var t=r('<div class="console__row console__row--error"></div>');t.appendChild(this.createTypedView(e,c).el),this._container.appendChild(t),this.onerror()}},{key:"dir",value:function(e){var t=r('<div class="console__row"></div>');t.appendChild(this.createTypedView(e,d).el),this._container.appendChild(t),this.ondir()}},{key:"clean",value:function(){this._container.innerHTML=""}},{key:"createTypedView",value:function(e,t,n,i){var r={val:e,mode:t,depth:n,parentView:i,type:void 0===e?"undefined":o(e)},a=void 0;switch(r.type){case"function":a=new b(r,this);break;case"object":a=null!==e?Array.isArray(e)?new y(r,this):new f(r,this):new C(r,this);break;default:a=new C(r,this)}return a}},{key:"_getRowEl",value:function(e,t){var n=this,i=r('<div class="console__row"></div>');return e.forEach(function(e){i.appendChild(n.createTypedView(e,t).el)}),i}},{key:"extend",value:function(e){return e.log=this.log.bind(this),e.info=this.log.bind(this),e.error=this.error.bind(this),e.warn=this.error.bind(this),e.dir=this.dir.bind(this),e}},{key:"sourceLog",get:function(){return this._container.innerHTML}}]),n}(),k=[],e=function(e){k.push(e.error)};window.addEventListener("error",e),window.console.warn=e,window.console.error=e;var O=[],S=function(){O.push.apply(O,arguments)},H=[];window.console.info=S,window.console.log=S,window.console.dir=function(e){H.push(e)};window.addEventListener("DOMContentLoaded",function(){var e;!function(){var e=window.document.createElement("div");e.classList.add("console");var t=new E(e);window.document.body.appendChild(e),t.extend(window.console),k.forEach(function(e){t.error(e)}),O.forEach(function(e){t.log(e)}),H.forEach(function(e){t.dir(e)}),window.addEventListener("error",function(e){t.error(e.error)})}(),(e=window.document.createElement("link")).rel="stylesheet",e.href="//htmlacademy.github.io/console.js/css/style.min.css",window.document.head.appendChild(e)})}();
//# sourceMappingURL=index-silent.js.map