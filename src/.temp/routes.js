const c1 = () => import(/* webpackChunkName: "page--src--templates--markdown-page-vue" */ "/Users/user/Desktop/Intro/msa-ez.github.io/src/templates/MarkdownPage.vue")
const c2 = () => import(/* webpackChunkName: "page--src--pages--404-vue" */ "/Users/user/Desktop/Intro/msa-ez.github.io/src/pages/404.vue")
const c3 = () => import(/* webpackChunkName: "page--src--pages--index-vue" */ "/Users/user/Desktop/Intro/msa-ez.github.io/src/pages/Index.vue")

export default [
  {
    path: "/templates-language/springboot-java-template/",
    component: c1
  },
  {
    path: "/tool/si-gpt/",
    component: c1
  },
  {
    path: "/templates-language/python-template/",
    component: c1
  },
  {
    path: "/tool/on-prem-inst/",
    component: c1
  },
  {
    path: "/operation/ops-deploy-diagramming-advanced-hpa/",
    component: c1
  },
  {
    path: "/operation/ops-deploy-diagramming-advanced-ingress/",
    component: c1
  },
  {
    path: "/operation/ops-deploy-diagramming-advanced-istio/",
    component: c1
  },
  {
    path: "/operation/ops-deploy-diagramming-advanced-pvc/",
    component: c1
  },
  {
    path: "/operation/ops-deploy-diagramming-basic-objects/",
    component: c1
  },
  {
    path: "/tool/model-driven/",
    component: c1
  },
  {
    path: "/tool/marketplace/",
    component: c1
  },
  {
    path: "/tool/k8s-modeling/",
    component: c1
  },
  {
    path: "/started/key-features/",
    component: c1
  },
  {
    path: "/tool/infrastructure-modeling/",
    component: c1
  },
  {
    path: "/templates-language/go-template/",
    component: c1
  },
  {
    path: "/tool/google-drive-examples/",
    component: c1
  },
  {
    path: "/tool/event-storming-tool/",
    component: c1
  },
  {
    path: "/custom-template/unit-test/",
    component: c1
  },
  {
    path: "/started/event-storming-learning/",
    component: c1
  },
  {
    path: "/custom-template/template-editor/",
    component: c1
  },
  {
    path: "/custom-template/template-structure/",
    component: c1
  },
  {
    path: "/tool/cloud-ide-tool/",
    component: c1
  },
  {
    path: "/tool/development-practice/",
    component: c1
  },
  {
    path: "/custom-template/tutorial/",
    component: c1
  },
  {
    path: "/started/domain-driven/",
    component: c1
  },
  {
    path: "/tool/chat-gpt/",
    component: c1
  },
  {
    path: "/example-scenario/online-lecture/",
    component: c1
  },
  {
    path: "/tool/attending-lectures/",
    component: c1
  },
  {
    path: "/development/pub-sub/",
    component: c1
  },
  {
    path: "/contact/question/",
    component: c1
  },
  {
    path: "/development/oauth2with-keycloak/",
    component: c1
  },
  {
    path: "/development/monolith-2-misvc/",
    component: c1
  },
  {
    path: "/example-scenario/library-system/",
    component: c1
  },
  {
    path: "/custom-template/mock-server/",
    component: c1
  },
  {
    path: "/example-scenario/food-delivery/",
    component: c1
  },
  {
    path: "/custom-template/helper/",
    component: c1
  },
  {
    path: "/custom-template/for-loop/",
    component: c1
  },
  {
    path: "/development/gateway/",
    component: c1
  },
  {
    path: "/custom-template/designing-template/",
    component: c1
  },
  {
    path: "/development/dp-cqrs/",
    component: c1
  },
  {
    path: "/business/ddd-google-drive/",
    component: c1
  },
  {
    path: "/business/eventstorming-fooddelivery/",
    component: c1
  },
  {
    path: "/custom-template/conditional-statement/",
    component: c1
  },
  {
    path: "/custom-template/custom-template/",
    component: c1
  },
  {
    path: "/development/choreography-saga/",
    component: c1
  },
  {
    path: "/development/cna-start/",
    component: c1
  },
  {
    path: "/example-scenario/accommodation-reservation/",
    component: c1
  },
  {
    path: "/example-scenario/animal-hospital/",
    component: c1
  },
  {
    path: "/started/",
    component: c1
  },
  {
    path: "/business/",
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
