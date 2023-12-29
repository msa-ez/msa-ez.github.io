<template>
  <div
    ref="sidebar"
    v-if="showSidebar"
    class="pt-8"
  >
    <div
      v-for="(section, index) in sidebar.sections"
      :key="section.title"
    >
      <h3 style="margin-top: 3px; font-size: 16px;" v-if="section.firstTitle && !section.firstItem && !section.firstLink">
        {{ section.firstTitle }}
      </h3>
      <g-link
        v-if="section.firstTitle && section.firstItem && !section.firstLink"
        :to="`${section.firstItem}`"
        class="flex items-center py-1"
      >
        <h3 style="margin-bottom: 0px; font-size: 16px;">
          {{ section.firstTitle }}
        </h3>
      </g-link>
      <g-link
        v-if="section.firstTitle && !section.firstItem && section.firstLink"
        :to="`${section.firstLink}`"
        class="flex items-center py-1"
      >
        <h3 style="margin-bottom: 0px; font-size: 16px;">
          {{ section.firstTitle }}
        </h3>
      </g-link>
        <div
          v-for="secondSection in section.name"
          :key="secondSection.secondTitle"
          style="margin-top: -10px;"
        >
          <h4 style="margin-left: 10px; margin-top: 10px; font-size: 14px;" v-if="secondSection.secondTitle && !secondSection.secondItem && !secondSection.secondLink">
            {{ secondSection.secondTitle }}
          </h4>
          <g-link
            v-if="secondSection.secondTitle && secondSection.secondItem"
            :to="`${secondSection.secondItem}`"
            class="flex items-center py-1"
          >
            <h4 style="margin-left: 10px; margin-bottom: 0px; font-size: 14px;">
              {{ secondSection.secondTitle }}
            </h4>
          </g-link>
          <g-link
            v-if="secondSection.secondTitle && !secondSection.secondItem && secondSection.secondLink"
            :to="`${secondSection.secondLink}`"
            class="flex items-center py-1"
          >
            <h4 style="margin-left: 10px; margin-bottom: 0px; font-size: 14px;">
              {{ secondSection.secondTitle }}
            </h4>
          </g-link>
          <!-- <ul class="max-w-full pl-2 mb-0 text-sm" style="margin-top: 5px;">
            <li
              v-for="page in findPages(secondSection.thirdItems)"
              :id="page.path"
              :key="page.path"
              :class="getClassesForAnchor(page)"
              style="margin-top: -10px;"
              @mousedown="$emit('navigate')"
            >
              <g-link
                :to="`${page.path}`"
                class="flex items-center py-1"
              >
                <span
                  class="absolute opacity-0 bg-ui-primary transition transform scale-0 origin-center"
                  :class="{
                    'opacity-100 scale-100': currentPage.path === page.path
                  }"
                ></span>
                <span style="margin-top: 0px; margin-bottom: 7px;"  class="triangle"></span>
                <h6 style="margin-top: 0px; margin-bottom: 7px;"  v-if="page.title">
                  {{ page.title }}
                </h6>
              </g-link>
            </li>
          </ul> -->
        </div>
    </div>
  </div>
</template>

<static-query>
query Sidebar {
  metadata {
    settings {
      sidebar {
        name
        sections {
          firstTitle
          firstItem
          name {
            secondTitle
            secondLink
            secondItem
          }
        }
      }
    }
  }
}
</static-query>

<script>
export default {
  data() {
    return {
      expanded: []
    };
  },
  computed: {
    pages() {
      return this.$page.allMarkdownPage.edges.map(edge => edge.node);
    },
    sidebar() {
      return this.$static.metadata.settings.sidebar.find(
        sidebar => sidebar.name === this.$page.markdownPage.sidebar
      );
    },
    showSidebar() {
      return this.$page.markdownPage.sidebar
        && this.sidebar;
    },
    currentPage() {
      return this.$page.markdownPage;
    }
  },
  methods: {
    getClassesForAnchor({ path }) {
      return {
        "text-ui-primary": this.currentPage.path === path,
        "transition transform hover:translate-x-1 hover:text-ui-primary": ! this.currentPage.path === path
      };
    },
    findPages(links) {
      return links.map(link => this.pages.find(page => page.path === link));
    }
  },  
};
</script>
<style scoped>
  /* 삼각형 스타일 */
  .triangle {
    width: 0;
    height: 0;
    margin-left: 5px; 
    margin-right: 7px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 8px solid white; 
    transform: rotate(270deg); 
  }
  h4 {
    font-weight: normal;
  }
</style>