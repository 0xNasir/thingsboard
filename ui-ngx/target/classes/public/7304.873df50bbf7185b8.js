(self.webpackChunkthingsboard=self.webpackChunkthingsboard||[]).push([[7304],{92347:u=>{u.exports={DIFF_EQUAL:0,DIFF_DELETE:-1,DIFF_INSERT:1,EDITOR_RIGHT:"right",EDITOR_LEFT:"left",RTL:"rtl",LTR:"ltr",SVG_NS:"http://www.w3.org/2000/svg",DIFF_GRANULARITY_SPECIFIC:"specific",DIFF_GRANULARITY_BROAD:"broad"}},17357:u=>{u.exports=function(r,h){const l=`js-${h}-${Math.random().toString(36).substr(2,5)}`,L=r.querySelector(`.${h}`);if(L)return L.id=L.id||l,L.id;const m=document.createElement("div");return r.appendChild(m),m.className=h,m.id=l,m.id}},7461:u=>{u.exports={on:function S(r,h,d,l){const L="document"===r?document:document.querySelector(r);L.addEventListener(h,m=>{const y=L.querySelectorAll(d),{target:D}=m;for(let v=0,$=y.length;v<$;v+=1){let R=D;const F=y[v];for(;R&&R!==L;)R===F&&l.call(F,m),R=R.parentNode}})}}},54059:u=>{u.exports=function(r,h){let d;return(...l)=>{const L=this;clearTimeout(d),d=setTimeout(()=>r.apply(L,l),h)}}},77939:u=>{function S(r){return r&&"object"==typeof r&&!Array.isArray(r)&&null!==r}u.exports=function r(h,d){return S(h)&&S(d)&&Object.keys(d).forEach(l=>{S(d[l])?((!h[l]||!S(h[l]))&&(h[l]=d[l]),r(h[l],d[l])):Object.assign(h,{[l]:d[l]})}),h}},7650:u=>{u.exports=function(r=""){return r.replace(/\r\n/g,"\n")}},7782:u=>{u.exports=function(r,h,d=!1){let l=null,L=!0;return(...m)=>{const D=()=>{r.apply(this,m),l=null};d&&L&&(L=!1,D()),l||(l=setTimeout(D,h))}}},77304:(u,S,r)=>{const h=r(53716),d=r(77939),l=r(7782),L=r(54059),m=r(7650),y=r(47636),D=r(40878),v=r(50935),$=r(3656),R=r(51190),F=r(17598),M=r(17357),k=r(7461),E=r(92347);let A;function b(t={}){if(!(this instanceof b))return new b(t);const e=this;e.options=d({ace:window?window.ace:void 0,mode:null,theme:null,element:null,diffGranularity:E.DIFF_GRANULARITY_BROAD,lockScrolling:!1,showDiffs:!0,showConnectors:!0,maxDiffs:5e3,left:{id:null,content:null,mode:null,theme:null,editable:!0,copyLinkEnabled:!0},right:{id:null,content:null,mode:null,theme:null,editable:!0,copyLinkEnabled:!0},classes:{gutterID:"acediff__gutter",diff:"acediff__diffLine",connector:"acediff__connector",newCodeConnectorLink:"acediff__newCodeConnector",newCodeConnectorLinkContent:"&#8594;",deletedCodeConnectorLink:"acediff__deletedCodeConnector",deletedCodeConnectorLinkContent:"&#8592;",copyRightContainer:"acediff__copy--right",copyLeftContainer:"acediff__copy--left"},connectorYOffset:0},t);const{ace:o}=e.options;if(!o){const i="No ace editor found nor supplied - `options.ace` or `window.ace` is missing";return console.error(i),new Error(i)}if(A=function Z(t){if(t.Range)return t.Range;const e=t.acequire||t.require;return!!e&&e("ace/range")}(o),!A){const i="Could not require Range module for Ace. Depends on your bundling strategy, but it usually comes with Ace itself. See https://ace.c9.io/api/range.html, open an issue on GitHub ace-diff/ace-diff";return console.error(i),new Error(i)}if(null===e.options.element){const i="You need to specify an element for Ace-diff - `options.element` is missing";return console.error(i),new Error(i)}if(e.options.element instanceof HTMLElement?e.el=e.options.element:e.el=document.body.querySelector(e.options.element),!e.el){const i=`Can't find the specified element ${e.options.element}`;return console.error(i),new Error(i)}e.options.left.id=M(e.el,"acediff__left"),e.options.classes.gutterID=M(e.el,"acediff__gutter"),e.options.right.id=M(e.el,"acediff__right"),e.el.innerHTML=`<div class="acediff__wrap">${e.el.innerHTML}</div>`,e.editors={left:{ace:o.edit(e.options.left.id),markers:[],lineLengths:[]},right:{ace:o.edit(e.options.right.id),markers:[],lineLengths:[]},editorHeight:null},e.editors.left.ace.getSession().setMode(D(e,E.EDITOR_LEFT)),e.editors.right.ace.getSession().setMode(D(e,E.EDITOR_RIGHT)),e.editors.left.ace.setReadOnly(!e.options.left.editable),e.editors.right.ace.setReadOnly(!e.options.right.editable),e.editors.left.ace.setTheme(v(e,E.EDITOR_LEFT)),e.editors.right.ace.setTheme(v(e,E.EDITOR_RIGHT)),e.editors.left.ace.setValue(m(e.options.left.content),-1),e.editors.right.ace.setValue(m(e.options.right.content),-1),e.editors.editorHeight=R(e),setTimeout(()=>{e.lineHeight=e.editors.left.ace.renderer.lineHeight,function X(t){t.editors.left.ace.getSession().on("changeScrollTop",l(()=>{z(t)},16)),t.editors.right.ace.getSession().on("changeScrollTop",l(()=>{z(t)},16));const e=t.diff.bind(t);t.editors.left.ace.on("change",e),t.editors.right.ace.on("change",e),t.options.left.copyLinkEnabled&&k.on(`#${t.options.classes.gutterID}`,"click",`.${t.options.classes.newCodeConnectorLink}`,o=>{_(t,o,E.LTR)}),t.options.right.copyLinkEnabled&&k.on(`#${t.options.classes.gutterID}`,"click",`.${t.options.classes.deletedCodeConnectorLink}`,o=>{_(t,o,E.RTL)});const n=L(()=>{t.editors.availableHeight=document.getElementById(t.options.left.id).offsetHeight,t.diff()},250);window.addEventListener("resize",n),V=()=>{window.removeEventListener("resize",n)}}(e),function nt(t){t.copyRightContainer=document.createElement("div"),t.copyRightContainer.setAttribute("class",t.options.classes.copyRightContainer),t.copyLeftContainer=document.createElement("div"),t.copyLeftContainer.setAttribute("class",t.options.classes.copyLeftContainer),document.getElementById(t.options.classes.gutterID).appendChild(t.copyRightContainer),document.getElementById(t.options.classes.gutterID).appendChild(t.copyLeftContainer)}(e),Q(e),e.diff()},1)}b.prototype={setOptions(t){d(this.options,t),this.diff()},getNumDiffs(){return this.diffs.length},getEditors(){return{left:this.editors.left.ace,right:this.editors.right.ace}},diff(){const t=new h,e=this.editors.left.ace.getSession().getValue(),n=this.editors.right.ace.getSession().getValue(),o=t.diff_main(n,e);t.diff_cleanupSemantic(o),this.editors.left.lineLengths=B(this.editors.left),this.editors.right.lineLengths=B(this.editors.right);const i=[],s={left:0,right:0};o.forEach((g,c,a)=>{const C=g[0];let p=g[1];a[c+1]&&p.endsWith("\n")&&a[c+1][1].startsWith("\n")&&(p+="\n",o[c][1]=p,o[c+1][1]=o[c+1][1].replace(/^\n/,"")),0!==p.length&&(C===E.DIFF_EQUAL?(s.left+=p.length,s.right+=p.length):C===E.DIFF_DELETE?(i.push(U(this,E.DIFF_DELETE,s.left,s.right,p)),s.right+=p.length):C===E.DIFF_INSERT&&(i.push(U(this,E.DIFF_INSERT,s.left,s.right,p)),s.left+=p.length))},this),this.diffs=function rt(t,e){const n=[];function o(s){return t.options.diffGranularity===E.DIFF_GRANULARITY_SPECIFIC?s<1:s<=1}e.forEach((s,g)=>{if(0===g)return void n.push(s);let c=!1;for(let a=0;a<n.length;a+=1)if(o(Math.abs(s.leftStartLine-n[a].leftEndLine))&&o(Math.abs(s.rightStartLine-n[a].rightEndLine))){n[a].leftStartLine=Math.min(s.leftStartLine,n[a].leftStartLine),n[a].rightStartLine=Math.min(s.rightStartLine,n[a].rightStartLine),n[a].leftEndLine=Math.max(s.leftEndLine,n[a].leftEndLine),n[a].rightEndLine=Math.max(s.rightEndLine,n[a].rightEndLine),c=!0;break}c||n.push(s)});const i=[];return n.forEach(s=>{s.leftStartLine===s.leftEndLine&&s.rightStartLine===s.rightEndLine||i.push(s)}),i}(this,i),!(this.diffs.length>this.options.maxDiffs)&&(Y(this),K(this))},destroy(){const t=this.editors.left.ace.getValue();this.editors.left.ace.destroy();let e=this.editors.left.ace.container,n=e.cloneNode(!1);n.textContent=t,e.parentNode.replaceChild(n,e);const o=this.editors.right.ace.getValue();this.editors.right.ace.destroy(),e=this.editors.right.ace.container,n=e.cloneNode(!1),n.textContent=o,e.parentNode.replaceChild(n,e),document.getElementById(this.options.classes.gutterID).innerHTML="",V()}};let V=()=>{};function _(t,e,n){const o=parseInt(e.target.getAttribute("data-diff-index"),10),i=t.diffs[o];let s,g,c,a,C,p;n===E.LTR?(s=t.editors.left,g=t.editors.right,c=i.leftStartLine,a=i.leftEndLine,C=i.rightStartLine,p=i.rightEndLine):(s=t.editors.right,g=t.editors.left,c=i.rightStartLine,a=i.rightEndLine,C=i.leftStartLine,p=i.leftEndLine);let I="";for(let f=c;f<a;f+=1)I+=`${$(s,f)}\n`;const T=g.ace.getSession().getScrollTop();g.ace.getSession().replace(new A(C,0,p,0),I),g.ace.getSession().setScrollTop(parseInt(T,10)),t.diff()}function B(t){const e=t.ace.getSession().doc.getAllLines(),n=[];return e.forEach(o=>{n.push(o.length+1)}),n}function W(t,e,n,o,i){const s=t.editors[e];o<n&&(o=n);const g=`${i} ${o>n?"lines":"targetOnly"}`;s.markers.push(s.ace.session.addMarker(new A(n,0,o-1,1),g,"fullLine"))}function z(t){Y(t),K(t),function et(t){const e=t.editors.left.ace.getSession().getScrollTop(),n=t.editors.right.ace.getSession().getScrollTop();t.copyRightContainer.style.cssText=`top: ${-e}px`,t.copyLeftContainer.style.cssText=`top: ${-n}px`}(t)}function Y(t){t.editors.left.markers.forEach(e=>{t.editors.left.ace.getSession().removeMarker(e)},t),t.editors.right.markers.forEach(e=>{t.editors.right.ace.getSession().removeMarker(e)},t)}function U(t,e,n,o,i){let s={},g=/^\n/.test(i);if(e===E.DIFF_INSERT){var c=j(t.editors.left,n,i),a=P(t.editors.right,o),C=w(t.editors.right,a);const f=w(t.editors.left,c.startLine);let H=a;0===w(t.editors.left,c.startLine)&&g&&(g=!1),0===c.startChar&&N(t.editors.right,o,g)&&(H=a+1);var I=c.startLine===c.endLine,T=0;(c.startChar>0||I&&i.length<f)&&C>0&&c.startChar<f&&T++,s={leftStartLine:c.startLine,leftEndLine:c.endLine+1,rightStartLine:H,rightEndLine:H+T}}else{c=j(t.editors.right,o,i),a=P(t.editors.left,n),C=w(t.editors.left,a);const x=w(t.editors.right,c.startLine);let O=a;0===w(t.editors.right,c.startLine)&&g&&(g=!1),0===c.startChar&&N(t.editors.left,n,g)&&(O=a+1);I=c.startLine===c.endLine,T=0;(c.startChar>0||I&&i.length<x)&&C>0&&c.startChar<x&&T++,s={leftStartLine:O,leftEndLine:O+T,rightStartLine:c.startLine,rightEndLine:c.endLine+1}}return s}function j(t,e,n){const o={startLine:0,startChar:0,endLine:0,endChar:0},i=e+n.length;let s=0,g=!1,c=!1;t.lineLengths.forEach((C,p)=>{s+=C,!g&&e<s&&(o.startLine=p,o.startChar=e-s+C,g=!0),!c&&i<=s&&(o.endLine=p,o.endChar=i-s+C,c=!0)}),o.startChar>0&&w(t,o.startLine)===o.startChar&&(o.startLine++,o.startChar=0),0===o.endChar&&o.endLine--;const a=/\n$/.test(n);return o.startChar>0&&a&&o.endLine++,o}function w(t,e){return $(t,e).length}function P(t,e){const n=t.ace.getSession().doc.getAllLines();let o=0,i=0;for(let s=0;s<n.length;s+=1)if(i+=n[s].length+1,e<=i){o=s;break}return o}function N(t,e,n){const o=t.ace.getSession().doc.getAllLines();let i=0;for(let s=0;s<o.length;s+=1){i+=o[s].length+1;let g=i;if(n&&(g-=1),e===g)break}return N}function Q(t){t.gutterHeight=document.getElementById(t.options.classes.gutterID).clientHeight,t.gutterWidth=document.getElementById(t.options.classes.gutterID).clientWidth;const e=J(t,E.EDITOR_LEFT),n=J(t,E.EDITOR_RIGHT),o=Math.max(e,n,t.gutterHeight);t.gutterSVG=document.createElementNS(E.SVG_NS,"svg"),t.gutterSVG.setAttribute("width",t.gutterWidth),t.gutterSVG.setAttribute("height",o),document.getElementById(t.options.classes.gutterID).appendChild(t.gutterSVG)}function J(t,e){return(e===E.EDITOR_LEFT?t.editors.left:t.editors.right).ace.getSession().getLength()*t.lineHeight}function K(t){(function ot(t){document.getElementById(t.options.classes.gutterID).removeChild(t.gutterSVG),Q(t)})(t),function st(t){t.copyLeftContainer.innerHTML="",t.copyRightContainer.innerHTML=""}(t),t.diffs.forEach((e,n)=>{t.options.showDiffs&&(W(t,E.EDITOR_LEFT,e.leftStartLine,e.leftEndLine,t.options.classes.diff),W(t,E.EDITOR_RIGHT,e.rightStartLine,e.rightEndLine,t.options.classes.diff),t.options.showConnectors&&function q(t,e,n,o,i){const s=t.editors.left.ace.getSession().getScrollTop(),g=t.editors.right.ace.getSession().getScrollTop();t.connectorYOffset=1;const a=e*t.lineHeight-s+.5,C=t.gutterWidth+1,p=o*t.lineHeight-g+.5,T=n*t.lineHeight-s+t.connectorYOffset+.5,f=t.gutterWidth+1,H=i*t.lineHeight-g+t.connectorYOffset+.5,ct=`${y(-1,a,C,p)} L${C},${p} ${f},${H} ${y(f,H,-1,T)} L-1,${T} -1,${a}`,G=document.createElementNS(E.SVG_NS,"path");G.setAttribute("d",ct),G.setAttribute("class",t.options.classes.connector),t.gutterSVG.appendChild(G)}(t,e.leftStartLine,e.leftEndLine,e.rightStartLine,e.rightEndLine),function tt(t,e,n){if(e.leftEndLine>e.leftStartLine&&t.options.left.copyLinkEnabled){const o=F({className:t.options.classes.newCodeConnectorLink,topOffset:e.leftStartLine*t.lineHeight,tooltip:"Copy to right",diffIndex:n,arrowContent:t.options.classes.newCodeConnectorLinkContent});t.copyRightContainer.appendChild(o)}if(e.rightEndLine>e.rightStartLine&&t.options.right.copyLinkEnabled){const o=F({className:t.options.classes.deletedCodeConnectorLink,topOffset:e.rightStartLine*t.lineHeight,tooltip:"Copy to left",diffIndex:n,arrowContent:t.options.classes.deletedCodeConnectorLinkContent});t.copyLeftContainer.appendChild(o)}}(t,e,n))},t)}u.exports=b},17598:u=>{u.exports=function(r){const h=document.createElement("div"),d={class:r.className,style:`top:${r.topOffset}px`,title:r.tooltip,"data-diff-index":r.diffIndex};for(const l in d)h.setAttribute(l,d[l]);return h.innerHTML=r.arrowContent,h}},47636:u=>{u.exports=function(r,h,d,l){const m=r+(d-r)/2;return`M ${r} ${h} C ${m},${h} ${m},${l} ${d},${l}`}},51190:u=>{u.exports=function(r){return document.getElementById(r.options.left.id).offsetHeight}},3656:u=>{u.exports=function(r,h){return r.ace.getSession().doc.getLine(h)}},40878:(u,S,r)=>{const h=r(92347);u.exports=function(l,L){let{mode:m}=l.options;return L===h.EDITOR_LEFT&&null!==l.options.left.mode&&(m=l.options.left.mode),L===h.EDITOR_RIGHT&&null!==l.options.right.mode&&(m=l.options.right.mode),m}},50935:(u,S,r)=>{const h=r(92347);u.exports=function(l,L){let{theme:m}=l.options;return L===h.EDITOR_LEFT&&null!==l.options.left.theme&&(m=l.options.left.theme),L===h.EDITOR_RIGHT&&null!==l.options.right.theme&&(m=l.options.right.theme),m}}}]);