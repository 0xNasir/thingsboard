(self.webpackChunkthingsboard=self.webpackChunkthingsboard||[]).push([[6077],{16077:()=>{var l;(l=jQuery).plot.plugins.push({init:function P(i){var t={first:{x:-1,y:-1},second:{x:-1,y:-1},show:!1,active:!1,touch:!1},u={},d=null;function y(e){t.active&&(S(e),i.getPlaceholder().trigger("plotselecting",[v()]),!0===t.touch&&e.preventDefault())}function m(e){if("touchstart"===e.type&&2===e.originalEvent.touches.length)t.touch=!0;else if(1!==e.which||e.originalEvent.touches&&e.originalEvent.touches.length>1)return;document.body.focus(),void 0!==document.onselectstart&&null===u.onselectstart&&(u.onselectstart=document.onselectstart,document.onselectstart=function(){return!1}),void 0!==document.ondrag&&null===u.ondrag&&(u.ondrag=document.ondrag,document.ondrag=function(){return!1}),b(t.first,e),t.active=!0,d=function(n){!function k(e){return d=null,void 0!==document.onselectstart&&(document.onselectstart=u.onselectstart),void 0!==document.ondrag&&(document.ondrag=u.ondrag),t.active=!1,S(e),h()?x():(i.getPlaceholder().trigger("plotunselected",[]),i.getPlaceholder().trigger("plotselecting",[null])),t.touch=!1,!1}(n)},l(document).one(t.touch?"touchend":"mouseup",d)}function v(){if(!h()||!t.show)return null;var e={},n=t.first,o=t.second;return l.each(i.getAxes(),function(s,r){if(r.used){var c=r.c2p(n[r.direction]),a=r.c2p(o[r.direction]);e[s]={from:Math.min(c,a),to:Math.max(c,a)}}}),e}function x(){var e=v();i.getPlaceholder().trigger("plotselected",[e]),e.xaxis&&e.yaxis&&i.getPlaceholder().trigger("selected",[{x1:e.xaxis.from,y1:e.yaxis.from,x2:e.xaxis.to,y2:e.yaxis.to}])}function w(e,n,o){return n<e?e:n>o?o:n}function b(e,n){var o=i.getOptions(),s=i.getPlaceholder().offset(),r=i.getPlotOffset(),c=t.touch?n.originalEvent.changedTouches[0]:n;e.x=w(0,c.pageX-s.left-r.left,i.width()),e.y=w(0,c.pageY-s.top-r.top,i.height()),"y"===o.selection.mode&&(e.x=e===t.first?0:i.width()),"x"===o.selection.mode&&(e.y=e===t.first?0:i.height())}function S(e){null!==(t.touch?e.originalEvent.changedTouches[0]:e).pageX&&(b(t.second,e),h()?(t.show=!0,i.triggerRedrawOverlay()):O(!0))}function O(e){t.show&&(t.show=!1,i.triggerRedrawOverlay(),e||i.getPlaceholder().trigger("plotunselected",[]))}function M(e,n){var o,s,r,c,a=i.getAxes();for(var f in a)if(Object.prototype.hasOwnProperty.call(a,f)&&(o=a[f]).direction===n&&(!e[c=n+o.n+"axis"]&&1===o.n&&(c=n+"axis"),e[c])){s=e[c].from,r=e[c].to;break}if(e[c]||(o="x"===n?i.getXAxes()[0]:i.getYAxes()[0],s=e[n+"1"],r=e[n+"2"]),null!=s&&null!=r&&s>r){var g=s;s=r,r=g}return{from:s,to:r,axis:o}}function h(){var e=i.getOptions().selection.minSize;return Math.abs(t.second.x-t.first.x)>=e&&Math.abs(t.second.y-t.first.y)>=e}i.clearSelection=O,i.setSelection=function p(e,n){var o,s=i.getOptions();"y"===s.selection.mode?(t.first.x=0,t.second.x=i.width()):(o=M(e,"x"),t.first.x=o.axis.p2c(o.from),t.second.x=o.axis.p2c(o.to)),"x"===s.selection.mode?(t.first.y=0,t.second.y=i.height()):(o=M(e,"y"),t.first.y=o.axis.p2c(o.from),t.second.y=o.axis.p2c(o.to)),t.show=!0,i.triggerRedrawOverlay(),!n&&h()&&x()},i.getSelection=v,i.hooks.bindEvents.push(function(e,n){null!=e.getOptions().selection.mode&&(n.mousemove(y),n.mousedown(m),n.bind("touchstart",function(s){n.unbind("mousedown",m),m(s)}),n.bind("touchmove",y))}),i.hooks.drawOverlay.push(function(e,n){if(t.show&&h()){var r,c,a,f,g,o=e.getPlotOffset(),s=e.getOptions();n.save(),n.translate(o.left,o.top),r=l.color.parse(s.selection.color),n.strokeStyle=r.scale("a",.8).toString(),n.lineWidth=1,n.lineJoin=s.selection.shape,n.fillStyle=r.scale("a",.4).toString(),c=Math.min(t.first.x,t.second.x)+.5,a=Math.min(t.first.y,t.second.y)+.5,f=Math.abs(t.second.x-t.first.x)-1,g=Math.abs(t.second.y-t.first.y)-1,n.fillRect(c,a,f,g),n.strokeRect(c,a,f,g),n.restore()}}),i.hooks.shutdown.push(function(e,n){n.unbind("mousemove",y),n.unbind("mousedown",m),d&&l(document).unbind("mouseup",d)})},options:{selection:{mode:null,color:"#e8cfac",shape:"round",minSize:5}},name:"selection",version:"1.1"})}}]);