// This is where project configuration and plugin options are located. 
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'msaez',
  icon: {
    favicon: './src/img/favicon.png',
    touchicon: './src/img/favicon.png',
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
            firstTitle: 'Introduction',
            firstItem: '/started/',
          },
          {
            firstTitle: 'Quick Start',
            firstItem: '/tool/google-drive-examples/',
          },
          {
            firstTitle: 'Business Modeling',
            name:[
              {
                secondTitle: 'Eventstorming',
                secondItem: '/business/'
              },
              {
                secondTitle: 'Creating Models with ChatGPT',
                secondItem: '/tool/chat-gpt/'
              }
            ]
          },
          {
            firstTitle: 'MSA Code Implementation',
            name:[
              {
                secondTitle: 'Automatic Code Generation',
                secondItem: '/tool/model-driven/'
              },
              {
                secondTitle: 'Marketplace',
                secondItem: '/tool/marketplace/'
              },
              {
                secondTitle: 'Test Automation',
                secondItem: '/custom-template/unit-test/'
              },
              {
                secondTitle: 'Code Implementation with ChatGPT',
                secondItem: '/tool/si-gpt/'
              }
            ]
          },
          {
            firstTitle: 'Code Implementation Practice',
            name:[
              {
                secondTitle: 'Running Microservices',
                secondItem: '/development/cna-start/'
              },
              {
                secondTitle: 'API Gateway',
                secondItem: '/development/gateway/'
              },
              {
                secondTitle: 'Req/Res Integration',
                secondItem: '/development/monolith-2-misvc/'
              },
              {
                secondTitle: 'Pub/Sub Integration',
                secondItem: '/development/pub-sub/'
              },
              {
                secondTitle: 'Orchestration Saga',
                secondItem: '/development/choreography-saga/'
              },
              {
                secondTitle: 'JWT Token Authentication',
                secondItem: '/development/oauth2with-keycloak/'
              },
              {
                secondTitle: 'CQRS Data Projection',
                secondItem: '/development/dp-cqrs/'
              },
            ]
          },
          {
            firstTitle: 'K8s Deployment Modeling',
            firstItem: '/tool/k8s-modeling/'
          },
          {
            firstTitle: 'Deployment Modeling Practice',
            name:[
              {
                secondTitle: 'K8s Deployment Modeling',
                secondItem: '/tool/k8s-modeling/'
              },
              {
                secondTitle: 'Basic Deployment Diagramming',
                secondItem: '/operation/ops-deploy-diagramming-basic-objects/'
              },
              {
                secondTitle: 'Ingress Gateway',
                secondItem: '/operation/ops-deploy-diagramming-advanced-ingress/'
              },
              {
                secondTitle: 'Service Auto-Scaling (HPA)',
                secondItem: '/operation/ops-deploy-diagramming-advanced-hpa/'
              },
              {
                secondTitle: 'Persistence Volume (PV)',
                secondItem: '/operation/ops-deploy-diagramming-advanced-pvc/'
              },
              {
                secondTitle: 'Istio - Service Mesh',
                secondItem: '/operation/ops-deploy-diagramming-advanced-istio/'
              },
            ]
          },
          {
            firstTitle: 'Custom Template',
            name:[
              {
                secondTitle: 'Creating Custom Template',
                secondItem: '/custom-template/template-editor-custom-template/'
              },
              {
                secondTitle: 'Template Structure',
                secondItem: '/custom-template/template-structure/'
              },
              {
                secondTitle: 'Loop & Conditional Statement',
                secondItem: '/custom-template/loop-conditional-statement/'
              },
              {
                secondTitle: 'Helper',
                secondItem: '/custom-template/helper/'
              },
              {
                secondTitle: 'Global Helper',
                secondItem: '/custom-template/global-helper/'
              },
              {
                secondTitle: 'Template Editor',
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
            firstTitle: 'Example Scenarios',
            name:[
              {
                secondTitle: 'Hotel Reservation',
                secondItem: '/example-scenario/accommodation-reservation/'
              },
              {
                secondTitle: 'Food Delivery',
                secondItem: '/example-scenario/food-delivery/'
              },
              {
                secondTitle: 'Library System',
                secondItem: '/example-scenario/library-system/'
              },
              {
                secondTitle: 'Animal Hospital System',
                secondItem: '/example-scenario/animal-hospital/'
              },
              {
                secondTitle: 'Online Lecture System',
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