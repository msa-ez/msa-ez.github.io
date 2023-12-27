// This is where project configuration and plugin options are located. 
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'msaez',
  icon: {
    favicon: './src/assets/favicon.png',
    touchicon: './src/assets/favicon.png'
  },
  siteUrl: (process.env.SITE_URL ? process.env.SITE_URL : 'https://example.com'),
  settings: {
    web: process.env.URL_WEB || false,
    twitter: process.env.URL_TWITTER || false,
    github: process.env.URL_GITHUB || false,
    nav: {
      links: [
        { path: '/started/', title: 'Docs' }
      ]
    },
    sidebar: [
      {
        name: 'started',
        sections: [
          {
            firstTitle: 'Getting Started',
            firstItem: '/started/',
          },
          {
            firstTitle: 'Key features',
            firstItem: '/started/key-features',
            name: [
              {
                thirdItems:
                [
                ]
              },
            ]
          },
          {
            firstTitle: 'Tutorial',
            name: [
              {
                secondTitle: 'Concepts',
                thirdItems:
                [
                  '/started/domain-driven/',
                  '/started/event-storming-learning/',
                ]
              },
              {
                secondTitle: 'SetUp',
                thirdItems:
                [
                  
                ]
              },
              {
                secondTitle: 'Biz Modeling',
                thirdItems:
                [
                  '/tool/event-storming-tool/',
                  '/tool/google-drive-examples/',
                  '/tool/chat-gpt/'
                ]
              },
              {
                secondTitle: 'Code Generation',
                thirdItems:
                [
                  '/tool/marketplace/',
                  '/templates-language/go-template/',
                  '/templates-language/python-template/',
                  '/templates-language/springboot-java-template/',
                  '/custom-template/designing-template/',
                  '/custom-template/custom-template/'
                ]
              },
              {
                secondTitle: 'Test Design',
                thirdItems:
                [
                  '/custom-template/unit-test/',
                  '/custom-template/mock-server/',
                ]
              },
              {
                secondTitle: 'Infra(K8s) Modeling',
                thirdItems:
                [
                  '/tool/infrastructure-modeling/'
                ]
              },
              {
                secondTitle: 'Online lecture platform',
                thirdItems:
                [
                  '/tool/development-practice/',
                  // '/tool/attending-lectures/'
                ]
              },
              {
                secondTitle: 'Guide labs for Analysis/Design',
                thirdItems:
                [
                ]
              },
              {
                secondTitle: 'Guide labs for Implementation',
                thirdItems:
                [
                  '/business/',
                  '/business/ddd-google-drive/',
                  '/business/eventstorming-fooddelivery/',
                  // '/development/understanding-jpa-based-single-microservice/',
                  '/development/cna-start/',
                  '/development/monolith-2-misvc/',
                  '/development/circuit-breaker/',
                  '/development/kafka-basic/',
                  '/development/pub-sub/',
                  '/development/compensation-correlation/',
                  // '/development/pubsub-idempotency/',
                  // '/development/pubsub-deadline/',
                  '/development/kafka-scaling/',
                  // '/development/kafka-scaling-concurrenty-handling/',
                  '/development/kafka-retry-dlq/',
                  // '/development/kafka-connect/',
                  // '/development/choreography-saga/',
                  '/development/orchestration-saga/',
                  '/development/gateway/',
                  '/development/token-based-auth/',
                  '/development/oauth2with-keycloak/',
                  '/development/dp-frontend/',
                  '/development/dp-graphql/',
                  '/development/dp-cqrs/',
                  '/development/contract-test/',
                  // '/development/conteact-messaging/',
                  // '/development/ops-docker/',
                ]
              },
              // {
              //   secondTitle: 'Guide labs for Ops',
              //   thirdItems:
              //   [
                  // gcp추가
                  // '/operations/ops-aws-setting/',
                  // '/operations/ops-aws-csi-setting/',
                  // '/operations/azure/',
                  // '/operations/ops-kubernetes/',
                  // '/operations/ops-deploy-my-app/',
                  // '/operations/end-to-end/',
                  // '/operations/ops-pod-status/',
                  // '/operations/ops-label-annotation/',
                  // '/operations/ops-autoscale/',
                  // '/operations/service/',
                  // '/operations/ops-readiness/',
                  // '/operations/ops-persistence-volume-efs/',
                  // '/operations/ops-persistence-volume-azure/',
                  // '/operations/ops-persistence-volume-gcp/',
                  // '/operations/ops-configmap/',
                  // '/operations/ops-persistence-volume/',
                  // '/operations/ops-ingress/',
                  // '/operations/ops-ingress-virtualhost/',
                  // '/operations/ops-service-mesh-istio-2/',
                  // '/operations/istio-traffic/',
                  // '/operations/istio-resiliency-part1/',
                  // '/operations/istio-resiliency-part2/',
                  // '/operations/istio-metric-based-hpa/',
                  // '/operations/istio-msa-telemetry/',
                  // '/operations/istio-sre-monitoring/',
                  // '/operations/microservice-logging/',
                  // '/operations/microservice-logging2/',
                  // '/operations/apply-security-to-12st-mall/',
                  // '/operations/ops-argo-rollout-canary-istio/',
                  // '/operations/service-mesh-ab-testing/',
                  // '/operations/gitops-argo-cd/',
                  // '/operations/ops-anatomy-kubernetes/',
                  // '/operations/ops-utility/',
              //   ]
              // },
            ]
          },
          {
            firstTitle: 'Case Studies',
            name:[
              {
                secondTitle: 'Example Scenario',
                thirdItems:
                [
                  '/example-scenario/accommodation-reservation/',
                  '/example-scenario/food-delivery/',
                  '/example-scenario/library-system/',
                  '/example-scenario/animal-hospital/',
                  '/example-scenario/online-lecture/',
                ]
              },
              {
                secondTitle: 'Customers',
                thirdItems:
                [
                 
                ]
              }
            ]
          },
          {
            firstTitle: 'Support',
            name:[
              {
                secondTitle: 'FAQ',
                thirdItems:
                [
                 
                ]
              },
              {
                secondTitle: 'Q&A',
                thirdItems:
                [
                 
                ]
              },
              {
                secondTitle: 'Contact',
                secondItem: '/contact/question/',
                thirdItems:
                [
                ]
              }
              
            ]
          },
        ]
      }
    ]
  },
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        baseDir: './content',
        path: '**/*.md',
        typeName: 'MarkdownPage',
        remark: {
          externalLinksTarget: '_blank',
          externalLinksRel: ['noopener', 'noreferrer'],
          plugins: [
            '@gridsome/remark-prismjs'
          ]
        }
      }
    },

    {
      use: 'gridsome-plugin-tailwindcss',
      options: {
        tailwindConfig: './tailwind.config.js',
        purgeConfig: {
          // Prevent purging of prism classes.
          whitelistPatternsChildren: [
            /token$/
          ]
        }
      }
    },

    {
      use: '@gridsome/plugin-google-analytics',
      options: {
        id: 'UA-153107610-3'
      }
    },

    {
      use: '@gridsome/plugin-sitemap',
      options: {  
      }
    }

  ]
}



// // This is where project configuration and plugin options are located. 
// // Learn more: https://gridsome.org/docs/config

// // Changes here require a server restart.
// // To restart press CTRL + C in terminal and run `gridsome develop`

// module.exports = {
//   siteName: 'msaez',
//   icon: {
//     favicon: './src/assets/favicon.png',
//     touchicon: './src/assets/favicon.png'
//   },
//   siteUrl: (process.env.SITE_URL ? process.env.SITE_URL : 'https://example.com'),
//   settings: {
//     web: process.env.URL_WEB || false,
//     twitter: process.env.URL_TWITTER || false,
//     github: process.env.URL_GITHUB || false,
//     nav: {
//       links: [
//         { path: '/started/', title: 'Docs' }
//       ]
//     },
//     sidebar: [
//       {
//         name: 'started',
//         sections: [
//           {
//             title: 'Getting Started',
//             items: [
//               '/started/',
//               '/started/domain-driven/',
//               '/started/event-storming-learning/',
//             ]
//           },
//           {
//             title: 'How to use the tool',
//             items: [
//               '/tool/google-drive-examples/',
//               '/tool/chat-gpt/',
//               '/tool/market-place/',
//               '/tool/event-storming-tool/',
//               '/tool/cloud-ide-tool/',
//               '/tool/infrastructure-modeling/',
//               '/tool/development-practice/',
//               '/tool/on-prem-inst/',
//             ]
//           },
//           {
//             title: 'Language-specific templates',
//             items: [
//               '/templates-language/python-template/',
//               '/templates-language/springboot-java-template/',
//               '/templates-language/go-template/',
//             ]
//           },
//           {
//             title: 'Custom templates',
//             items: [
//               '/custom-template/tutorial/',
//               '/custom-template/designing-template/',
//               '/custom-template/custom-template/',
//               '/custom-template/mock-server/',
//               '/custom-template/unit-test/',
//             ]
//           },
//           {
//             title: 'Example scenario',
//             items: [
//               '/example-scenario/accommodation-reservation/',
//               '/example-scenario/food-delivery/',
//               '/example-scenario/library-system/',
//               '/example-scenario/animal-hospital/',
//               '/example-scenario/online-lecture/',
//             ]
//           },
//           {
//             title: 'Contact',
//             items: [
//               '/contact/question/'
//             ]
//           },
//         ]
//       }
//     ]
//   },
//   plugins: [
//     {
//       use: '@gridsome/source-filesystem',
//       options: {
//         baseDir: './content',
//         path: '**/*.md',
//         typeName: 'MarkdownPage',
//         remark: {
//           externalLinksTarget: '_blank',
//           externalLinksRel: ['noopener', 'noreferrer'],
//           plugins: [
//             '@gridsome/remark-prismjs'
//           ]
//         }
//       }
//     },

//     {
//       use: 'gridsome-plugin-tailwindcss',
//       options: {
//         tailwindConfig: './tailwind.config.js',
//         purgeConfig: {
//           // Prevent purging of prism classes.
//           whitelistPatternsChildren: [
//             /token$/
//           ]
//         }
//       }
//     },

//     {
//       use: '@gridsome/plugin-google-analytics',
//       options: {
//         id: 'UA-153107610-3'
//       }
//     },

//     {
//       use: '@gridsome/plugin-sitemap',
//       options: {  
//       }
//     }

//   ]
// }
