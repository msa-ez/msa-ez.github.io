<template>
  <div class="py-2 border-t-2 border-ui-primary">
    <div class="container">

      <div class="flex items-center justify-between -mx-2 sm:-mx-4">
        <div class="flex flex-col items-center px-2 mr-auto sm:px-4 sm:flex-row">
          <g-link
            to="/"
            class="flex items-center text-ui-primary"
            title="Home"
          >
            <g-image src = "~/img/logo.png" width="120" class="text-ui-primary" />
          </g-link>

          <!-- <div v-if="settings.nav.links.length > 0" class="hidden ml-2 mr-5 sm:block sm:ml-8">
            <g-link
              v-for="link in settings.nav.links"
              :key="link.path"
              :to="link.path"
              class="block p-1 font-medium nav-link text-ui-typo hover:text-ui-primary"
            >
              {{ link.title }}
            </g-link>
          </div> -->
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

          <div class=".clearfix" style="width:250px;">
            <div style="width:55px; height:50px; text-align:center; line-height:50px; font-weight:700; float:left;">
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

            <div style="width:130px; height:50px; text-align:center; line-height:50px; float:left;">
              <g-link
                to="http://labs.msaez.io/"
                class="px-4 py-2 ml-auto font-bold leading-none text-white rounded-lg shadow-lg bg-ui-primary"
              >
                Try MSA-Ez
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
    }
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
</style>
