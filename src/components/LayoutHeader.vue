<template>
  <div class="py-2 border-t-2 border-ui-primary">
    <div class="container">

      <!-- PC 환경 -->
      <div class="flex items-center justify-between -mx-2 sm:-mx-4 is-not-mobile">
        <div class="">
          <g-link
            to="/"
            class="flex items-center text-ui-primary"
            title="Home"
          >
            <g-image src = "~/img/logo.png" width="120" class="text-ui-primary" />
          </g-link>
        </div>
        <div class="w-full px-2 sm:px-4 max-w-screen-xs">
          <ClientOnly>
            <Search />
          </ClientOnly>
        </div>
        <div class="flex items-center justify-end px-2 sm:px-4">
          <a v-if="settings.web" :href="settings.web" class="hidden ml-3 sm:block" target="_blank" rel="noopener noreferrer" title="Website" name="Website">
            <GlobeIcon size="1.5x" />
          </a>
          <a v-if="settings.twitter" :href="settings.twitter" class="hidden ml-3 sm:block" target="_blank" rel="noopener noreferrer" title="Twitter" name="Twitter">
            <TwitterIcon size="1.5x" />
          </a>
          <a v-if="settings.github" :href="settings.github" class="sm:ml-3" target="_blank" rel="noopener noreferrer" title="Github" name="Github">
            <GithubIcon size="1.5x" />
          </a>
          <div class=".clearfix" style="min-width:280px;">
            <a style="display:block; width:50px; height:50px; line-height:50px; float:left; padding-top: 13px;"
              href="https://github.com/msa-ez/platform?tab=readme-ov-file#running-on-docker-compose-with-github" target="_blank"
            >
              <GithubIcon size="1.5x" style="margin:0 auto; "/>
            </a>
            <div style="width:60px; height:50px; text-align:center; line-height:50px; font-weight:700; float:left;">
              <a @click="languageExchange()" style="cursor:pointer;">English</a>
            </div>
            <div style="width:50px; height:50px; text-align:center; line-height:50px; float:left; padding-top: 5px;">
              <ToggleDarkMode>
                <template slot="default" slot-scope="{ dark }">
                  <MoonIcon v-if="dark" size="1.5x" />
                  <SunIcon v-else size="1.5x" />
                </template>
              </ToggleDarkMode>
            </div>
            <div style="text-align:center; line-height:50px; float:left;">
              <g-link
                to="http://labs.msaez.io/"
                class="px-4 py-2 ml-auto font-bold leading-none text-white rounded-lg shadow-lg bg-ui-primary"
              >
                Try MSAEZ
              </g-link>
            </div>
          </div>
        </div>
      </div>


      <!-- 모바일 환경 -->
      <div class="flex items-center justify-between -mx-2 sm:-mx-4 is-mobile">
        <div class="flex">
          <g-link
            to="/"
            class="flex items-center text-ui-primary"
            title="Home"
          >
            <g-image src = "~/img/logo.png" width="120" class="text-ui-primary" />
          </g-link>
          <div class="w-full px-2 sm:px-4 max-w-screen-xs">
            <ClientOnly>
              <Search />
            </ClientOnly>
        </div>
        </div>
        <div class="flex items-center justify-end px-2 sm:px-4">
          <a v-if="settings.web" :href="settings.web" class="hidden ml-3 sm:block" target="_blank" rel="noopener noreferrer" title="Website" name="Website">
            <GlobeIcon size="1.5x" />
          </a>
          <a v-if="settings.twitter" :href="settings.twitter" class="hidden ml-3 sm:block" target="_blank" rel="noopener noreferrer" title="Twitter" name="Twitter">
            <TwitterIcon size="1.5x" />
          </a>
          <a v-if="settings.github" :href="settings.github" class="sm:ml-3" target="_blank" rel="noopener noreferrer" title="Github" name="Github">
            <GithubIcon size="1.5x" />
          </a>
          <div class=".clearfix">
            <a style="display:block; width:50px; height:50px; line-height:50px; float:left; padding-top: 13px;"
              href="https://github.com/msa-ez/platform?tab=readme-ov-file#running-on-docker-compose-with-github" target="_blank"
            >
              <GithubIcon size="1.5x" style="margin:0 auto; "/>
            </a>
            <div style="width:60px; height:50px; text-align:center; line-height:50px; font-weight:700; float:left;">
              <a @click="languageExchange()" style="cursor:pointer;">English</a>
            </div>
            <div style="width:50px; height:50px; text-align:center; line-height:50px; float:left; padding-top: 5px;">
              <ToggleDarkMode>
                <template slot="default" slot-scope="{ dark }">
                  <MoonIcon v-if="dark" size="1.5x" />
                  <SunIcon v-else size="1.5x" />
                </template>
              </ToggleDarkMode>
            </div>

            <div style="text-align:center; line-height:50px; float:left;">
              <g-link
                to="http://labs.msaez.io/"
                class="px-4 py-2 ml-auto font-bold leading-none text-white rounded-lg shadow-lg bg-ui-primary"
              >
                Try MSAEZ
              </g-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
    settings {
      web
      github
      twitter
      nav {
        links {
          path
          title
        }
      }
    }
  }
}
</static-query>

<script>
import ToggleDarkMode from "@/components/ToggleDarkMode";
import Logo from '@/components/Logo';
import { SunIcon, MoonIcon, GlobeIcon, GithubIcon, TwitterIcon } from "vue-feather-icons";

const Search = () => import(/* webpackChunkName: "search" */ "@/components/Search").catch(error => console.warn(error));

export default {
  components: {
    Logo,
    Search,
    ToggleDarkMode,
    SunIcon,
    MoonIcon,
    GlobeIcon,
    GithubIcon,
    TwitterIcon
  },
  data: {
    currentUrl: null,
    currentPath: null,
    currentPathTwo: null
  },

  computed: {
    meta() {
      return this.$static.metadata;
    },
    settings() {
      return this.meta.settings;
    },
  },

  methods: {
    languageExchange() {
      var me = this
      
      me.currentUrl = window.location.pathname;
      me.currentPath = me.currentUrl.split("/")[1];
      me.currentPathTwo = me.currentUrl.split("/")[2];
      
      if(me.currentPath != null && me.currentPathTwo != null) {
        window.location.href="https://intro-kor.msaez.io/" + me.currentPath + "/" + me.currentPathTwo;
      }else {
        window.location.href="https://intro-kor.msaez.io/";
      }
    }
  }
};
</script>

<style lang="scss">
.is-mobile {
  display: none;
}



header {
  svg:not(.feather-search) {
    &:hover {
      @apply text-ui-primary;
    }
  }
}

.clearfix::after{content:""; display:block; clear:both;}

.nav-link {
  &.active {
    @apply text-ui-primary font-bold border-ui-primary;
  }
}


@media only screen and (max-width:607px){
  .is-mobile {
    display: block;
  }
  .is-not-mobile {
    display: none;
  }
}
</style>
