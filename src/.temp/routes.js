const c1 = () => import(/* webpackChunkName: "page--src--templates--markdown-page-vue" */ "/Users/kibum0405/Desktop/msa-ez.github.io/src/templates/MarkdownPage.vue")
const c2 = () => import(/* webpackChunkName: "page--src--pages--404-vue" */ "/Users/kibum0405/Desktop/msa-ez.github.io/src/pages/404.vue")
const c3 = () => import(/* webpackChunkName: "page--src--pages--index-vue" */ "/Users/kibum0405/Desktop/msa-ez.github.io/src/pages/Index.vue")

export default [
  {
    path: "/started/writing-content/",
    component: c1
  },
  {
    path: "/started/settings/",
    component: c1
  },
  {
    path: "/started/sidebar/",
    component: c1
  },
  {
    path: "/started/installation/",
    component: c1
  },
  {
    path: "/started/deploying/",
    component: c1
  },
  {
    path: "/started/",
    component: c1
  },
  {
    name: "404",
    path: "/404/",
    component: c2
  },
  {
    name: "home",
    path: "/",
    component: c3
  },
  {
    name: "*",
    path: "*",
    component: c2
  }
]
