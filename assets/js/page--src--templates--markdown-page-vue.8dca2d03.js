(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{"3tDo":function(t,e,n){},TeQF:function(t,e,n){"use strict";var r=n("I+eb"),i=n("tycR").filter,a=n("Hd5f"),o=n("rkAj"),s=a("filter"),c=o("filter");r({target:"Array",proto:!0,forced:!s||!c},{filter:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}})},UEP3:function(t,e,n){"use strict";var r=n("3tDo");n.n(r).a},zwLt:function(t,e,n){"use strict";n.r(e);n("pNMO"),n("4Brf"),n("ma9I"),n("QWBl"),n("FZtP");var r=n("rePB"),i=(n("TeQF"),{data:function(){return{activeAnchor:"",observer:null}},computed:{page:function(){return this.$page.markdownPage},headings:function(){return this.page.headings.filter((function(t){return t.depth>1}))}},watch:{$route:function(){window.location.hash&&(this.activeAnchor=window.location.hash),this.observer.disconnect(),this.$nextTick(this.initObserver)}},methods:{observerCallback:function(t,e){if(!(t.length>1)){var n=t[0].target.id;n&&(this.activeAnchor="#"+n,history.replaceState&&history.replaceState(null,null,"#"+n))}},initObserver:function(){this.observer=new IntersectionObserver(this.observerCallback,{rootMargin:"0px 0px 99999px",threshold:1});for(var t=document.querySelectorAll(".content h2, .content h3, .content h4, .content h5, .content h6"),e=0;e<t.length;e++)this.observer.observe(t[e])}},mounted:function(){window.location.hash&&(this.activeAnchor=window.location.hash),this.$nextTick(this.initObserver)}}),a=n("KHd+"),o=Object(a.a)(i,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"mt-8 sm:pl-4 md:pl-6 md:pt-12 lg:pl-8 sm:pb-16 sm:border-l border-ui-border md:mt-0"},[n("h3",{staticClass:"pt-0 mt-0 text-sm tracking-wide uppercase border-none"},[t._v("On this page")]),n("div",[n("ul",t._l(t.headings,(function(e,r){var i;return n("li",{key:""+t.page.path+e.anchor,class:(i={"border-t border-dashed border-ui-border pt-2 mt-2":r>0&&2===e.depth,"font-semibold":2===e.depth},i["depth-"+e.depth]=!0,i)},[n("g-link",{staticClass:"relative flex items-center py-1 text-sm transition transform hover:translate-x-1",class:{"pl-2":3===e.depth,"pl-3":4===e.depth,"pl-4":5===e.depth,"pl-5":6===e.depth,"font-bold text-ui-primary":t.activeAnchor===e.anchor},attrs:{to:""+t.page.path+e.anchor}},[n("span",{staticClass:"absolute w-2 h-2 -ml-3 rounded-full opacity-0 bg-ui-primary transition transform scale-0 origin-center",class:{"opacity-100 scale-100":t.activeAnchor===e.anchor}}),t._v("\n          "+t._s(e.value)+"\n        ")])],1)})),0)])])}),[],!1,null,null,null).exports,s=(n("fbCW"),n("2B1R"),n("CjXH")),c={components:{ArrowLeftIcon:s.a,ArrowRightIcon:s.c},computed:{page:function(){return this.$page.markdownPage},pages:function(){return this.$page.allMarkdownPage.edges.map((function(t){return t.node}))},next:function(){var t=this;return!(this.pages&&!this.page.next)&&this.pages.find((function(e){return e.path===t.page.next}))},prev:function(){var t=this;return!(this.pages&&!this.page.prev)&&this.pages.find((function(e){return e.path===t.page.prev}))}}},l=Object(a.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{staticClass:"flex flex-col sm:flex-row justify-between items-center"},[t.prev?n("g-link",{staticClass:"mb-4 sm:mb-0 flex items-center mr-auto text-ui-primary font-bold px-4 py-2 border border-ui-border rounded-lg hover:bg-ui-primary hover:text-white transition-colors",attrs:{to:t.prev.path}},[n("ArrowLeftIcon",{staticClass:"mr-2",attrs:{size:"1x"}}),t._v("\n      "+t._s(t.prev.title)+"\n    ")],1):t._e(),t.next?n("g-link",{staticClass:"flex items-center ml-auto text-ui-primary font-bold px-4 py-2 border border-ui-border rounded-lg hover:bg-ui-primary hover:text-white transition-colors",attrs:{to:t.next.path}},[t._v("\n      "+t._s(t.next.title)+"\n      "),n("ArrowRightIcon",{staticClass:"ml-2",attrs:{size:"1x"}})],1):t._e()],1)])}),[],!1,null,null,null).exports,h=Object(r.a)({components:{OnThisPage:o,NextPrevLinks:l,ArrowRightCircleIcon:s.b},metaInfo:{title:"msaez",meta:[{charset:"utf-8"},{name:"viewport",content:"width=device-width, initial-scale=1"}]},mounted:function(){this.wrapTables()},watch:Object(r.a)({"$page.markdownPage.content":function(t){this.track()}},"$page.markdownPage.content",(function(){this.track(),this.$nextTick((function(){this.wrapTables()}))})),methods:{track:function(){var t=this.$page.markdownPage&&this.$page.markdownPage.title?this.$page.markdownPage.title:this.$route.path,e=window.location.hostname;e&&"localhost"!=e&&(t="".concat(e,"_").concat(t)),this.$ga.page({page:this.$route.path,title:t})},wrapTables:function(){this.$el.querySelectorAll(".content table").forEach((function(t){var e=document.createElement("div");e.style.overflow="auto",t.parentNode.insertBefore(e,t),e.appendChild(t)}))}}},"metaInfo",(function(){var t=this.$page.markdownPage.title,e=this.$page.markdownPage.description||this.$page.markdownPage.excerpt;return{title:t,meta:[{name:"description",content:e},{key:"og:title",name:"og:title",content:t},{key:"twitter:title",name:"twitter:title",content:t},{key:"og:description",name:"og:description",content:e},{key:"twitter:description",name:"twitter:description",content:e}]}})),p=(n("UEP3"),null),d=Object(a.a)(h,(function(){var t=this.$createElement,e=this._self._c||t;return e("Layout",[e("div",{staticClass:"flex flex-wrap items-start justify-start"},[e("div",{staticClass:"order-2 w-full md:w-1/4 sm:pl-4 md:pl-6 lg:pl-8 sticky",staticStyle:{top:"4rem"}},[e("OnThisPage")],1),e("div",{staticClass:"order-1 w-full md:w-3/4"},[e("div",{directives:[{name:"g-image",rawName:"v-g-image"}],staticClass:"content",domProps:{innerHTML:this._s(this.$page.markdownPage.content)}}),e("div",{staticClass:"mt-8 pt-8 lg:mt-12 lg:pt-12 border-t border-ui-border"},[e("NextPrevLinks")],1)])])])}),[],!1,null,null,null);"function"==typeof p&&p(d);e.default=d.exports}}]);