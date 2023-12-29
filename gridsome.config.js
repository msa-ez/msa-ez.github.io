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
            firstTitle: '소개',
            firstItem: '/started/',
          },
          {
            firstTitle: 'Quick Start',
            firstItem: '/tool/google-drive-examples/',
          },
          {
            firstTitle: '비즈니스 모델링',
            name:[
              {
                secondTitle: '이벤트스토밍',
                secondItem: '/business/'
              },
              {
                secondTitle: 'ChatGPT 기반 모델 생성',
                secondItem: '/tool/chat-gpt/'
              }
            ]
          },
          {
            firstTitle: 'MSA 코드 구현',
            name:[
              {
                secondTitle: '모델 기반 코드 자동 생성',
                secondItem: '/tool/model-driven/'
              },
              {
                secondTitle: '마켓플레이스',
                secondItem: '/tool/marketplace/'
              },
              {
                secondTitle: '테스트 자동화',
                secondItem: '/custom-template/unit-test/'
              },
              {
                secondTitle: 'ChatGPT 기반 코드 구현',
                secondItem: '/tool/si-gpt/'
              }
            ]
          },
          {
            firstTitle: '코드 구현 실습',
            name:[
              {
                secondTitle: '마이크로서비스 실행',
                secondItem: '/development/cna-start/'
              },
              {
                secondTitle: 'API Gateway',
                secondItem: '/development/gateway/'
              },
              {
                secondTitle: 'Req/Res방식 연계',
                secondItem: '/development/monolith-2-misvc/'
              },
              {
                secondTitle: 'Pub/Sub방식 연계',
                secondItem: '/development/pub-sub/'
              },
              {
                secondTitle: 'Orchestration Saga',
                secondItem: '/development/choreography-saga/'
              },
              {
                secondTitle: 'JWT Token 인증',
                secondItem: '/development/oauth2with-keycloak/'
              },
              {
                secondTitle: 'CQRS 데이터프로젝션',
                secondItem: '/development/dp-cqrs/'
              },
            ]
          },
          {
            firstTitle: 'K8s 배포 모델링',
          },
          {
            firstTitle: '배포 모델링 실습',
            name:[
              {
                secondTitle: '기본 배포 다이어그래밍',
                secondItem: '/operation/ops-deploy-diagramming-basic-objects/'
              },
              {
                secondTitle: 'Ingress Gateway',
                secondItem: '/operation/ops-deploy-diagramming-advanced-ingress/'
              },
              {
                secondTitle: '서비스 자동확장(HPA)',
                secondItem: '/operation/ops-deploy-diagramming-advanced-hpa/'
              },
              {
                secondTitle: '퍼시스턴스 볼륨(PV)',
                secondItem: '/operation/ops-deploy-diagramming-advanced-pvc/'
              },
              {
                secondTitle: 'Istio - Service Mesh',
                secondItem: '/operation/ops-deploy-diagramming-advanced-istio/'
              },
            ]
          },
          {
            firstTitle: '커스텀 템플릿',
            name:[
              {
                secondTitle: '템플릿 구조',
                secondItem: '/custom-template/template-structure/'
              },
              {
                secondTitle: '반복문',
                secondItem: '/custom-template/for-loop/'
              },
              {
                secondTitle: '조건문',
                secondItem: '/custom-template/conditional-statement/'
              },
              {
                secondTitle: 'Helper',
                secondItem: '/custom-template/helper/'
              },
              {
                secondTitle: 'Template Editor 사용법',
                secondItem: '/custom-template/template-editor/'
              },
            ]
          },
          // {
          //   firstTitle: '테스트',
          //   name:[
          //     {
          //       secondTitle: 'Unit 테스트',
          //       secondItem: '/custom-template/unit-test/'
          //     },
          //     {
          //       secondTitle: 'API 서비스 테스트',
          //       secondItem: '/custom-template/mock-server/'
          //     }
          //   ]
          // },

          {
            firstTitle: '예제 시나리오',
            name:[
              {
                secondTitle: '숙소 예약',
                secondItem: '/example-scenario/accommodation-reservation/'
              },
              {
                secondTitle: '음식 배달',
                secondItem: '/example-scenario/food-delivery/'
              },
              {
                secondTitle: '도서관 시스템',
                secondItem: '/example-scenario/library-system/'
              },
              {
                secondTitle: '동물병원 진료 시스템',
                secondItem: '/example-scenario/animal-hospital/'
              },
              {
                secondTitle: '인터넷 강의수강 시스템',
                secondItem: '/example-scenario/online-lecture/'
              },
            ]
          },
          {
            firstTitle: 'Support',
            name:[
              // {
              //   secondTitle: 'FAQ',
              //   thirdItems:
              //   [
                 
              //   ]
              // },
              {
                secondTitle: 'Q&A',
                secondLink:'https://github.com/msa-ez/platform/issues',
              },
              {
                secondTitle: 'Contact',
                secondItem: '/contact/question/',
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
