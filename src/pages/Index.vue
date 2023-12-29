<template>
  <div>
    <Layout>
      <div class="pt-8 md:pt-16">
        <div class="flex flex-col items-center">
          <div class="flex flex-col items-center mb-2 text-ui-primary">
            <h2 class="text-3xl text-6xl font-black tracking-tighter border-none">
              MSAEZ
            </h2>
          </div>
          <h1 class=" text-center">
            The fastest way to build event-driven microservices
          </h1>

          <div class="flex justify-center mt-8">
            <g-link
              to="/started/"
              class="flex items-center px-6 py-4 ml-auto text-2xl font-bold leading-none text-white border rounded-lg shadow-lg bg-ui-primary border-ui-primary transition-all duration-200 ease-out transform hover:shadow-xl hover:-translate-y-1"
            >
              Get started
              <ArrowRightCircleIcon class="ml-4" size="1x" />
            </g-link>
          </div>
        </div>

        <div class=" mx-auto mt-8 md:mt-16 max-w-screen-sm"></div>

        <div class="flex flex-wrap justify-center -mx-4">
          <div class="flex flex-col items-center w-full px-4 mb-8 text-center md:w-1/3">
            <h3 class="font-bold tracking-wide uppercase text-ui-primary">
              Collective EventStorming
            </h3>
            <g-image style = "width:100%;" src="~/img/img_1.png"  />
            <p class="text-lg text-left">
              <br>
              MSAEZ is a tool that supports from building Microservices to operation by providing analysis, design, implementation,
              and monitoring required. It analyzes and designs domains through event-storming-based collaboration and automatically generates MSA source codes from the designed domain model.
              In the analysis and design phase, MSAEZ is used to identify the boundaries of the target domain and define the contract.
            </p>
          </div>

          <div class="flex flex-col items-center w-full px-4 mb-8 text-center md:w-1/3">
            
            <h3 class="font-bold tracking-wide uppercase text-ui-primary">
              Model 2 Code 2 Cloud
            </h3>
            <g-image style = "width:100%;" src="~/img/img_2.png"  />
            <p class="text-lg text-left">
              <br>
              The designed model is converted to source codes for Microservices according to the Model-driven Design (MDD) pattern.
              In addition to source codes for Microservices, it automatically generates contract test code,
              Docker image creation script, and CI/CD pipeline script that can be deployed immediately to the cloud (GCP, AWS, Azure, etc.).
            </p>
          </div>

          <div class="flex flex-col items-center w-full px-4 mb-8 text-center md:w-1/3">
            <h3 class="font-bold tracking-wide uppercase text-ui-primary">
              Polyglot & Custom Template
            </h3>
            <g-image style = "width:100%;" src="~/img/img_3.png"  />
            <p class="text-lg text-left">
              <br>
              One of the greatest strengths of MSA is the polyglot architecture that can apply the optimal technology for each service.
              MSAEZ is capable of generating code for each microservice identified as a result of event storming,
              and supports extension to various languages and information engineering Notation through ‘user-defined templates’.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  </div>
</template>

<script>
import Logo from '@/components/Logo';
import { ArrowRightCircleIcon, ZapIcon, CodeIcon, MoonIcon, SearchIcon } from 'vue-feather-icons';
import Footer from '@/components/Footer';

export default {
  components: {
    Logo,
    ArrowRightCircleIcon,
    ZapIcon,
    CodeIcon,
    MoonIcon,
    SearchIcon,
    Footer
  },

  metaInfo() {
    const title = 'msaeasy';
    const description = 'Event Storming,EventStorming,msaeasy,MSA design,MSA training,MSA lecture,MSA,CNA,Microphone service,Spring boot,SpringBoot,kubernetes,container,intromsaez,Event storming design,microservice education,aquanetis education,springboot education,springbooteducation,CNAlecture,CNAeducation,object-oriented lecture,object-oriented education,CNA implementation,CNA implementation,kubernetes,kubernetes lecture,kubernetes education';

    return {
      title: title,
      meta: [
        {
          name: 'description',
          content: description
        },
        {
          key: 'og:title',
          name: 'og:title',
          content: title,
        },
        {
          key: 'twitter:title',
          name: 'twitter:title',
          content: title,
        },
        {
          key: 'og:description',
          name: 'og:description',
          content: description,
        },
        {
          key: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
        {
          key: 'keywords',
          name: 'keywords',
          content: 'Event Storming,EventStorming,msaeasy,MSA design,MSA training,MSA lecture,MSA,CNA,Microphone service,Spring boot,SpringBoot,kubernetes,container,intromsaez,Event storming design,microservice education,aquanetis education,springboot education,springbooteducation,CNAlecture,CNAeducation,object-oriented lecture,object-oriented education,CNA implementation,CNA implementation,kubernetes,kubernetes lecture,kubernetes education',
        }
      ]
    }
  }
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
