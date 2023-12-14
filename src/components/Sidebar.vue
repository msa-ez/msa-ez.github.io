<template>
  <div
    ref="sidebar"
    v-if="showSidebar"
    class="px-4 pt-8 lg:pt-12"
  >
    <div
      v-for="(section, index) in sidebar.sections"
      :key="section.title"
      class="pb-4 mb-4 border-ui-border"
      :class="{ 'border-b': index < sidebar.sections.length -1 }"
    >
      <h3 v-if="section.title">
        {{ section.title }}
      </h3>
        <ul class="max-w-full pl-2 mb-0">
          <li>
            <li
              v-for="secondSection in section.name"
              :key="secondSection.subTitle"
              style="margin-top: 15px;"
            >
              <h4 style="margin-left: 10px;" v-if="secondSection.subTitle">
                {{ secondSection.subTitle }}
              </h4>
              <ul class="max-w-full pl-2 mb-0">
                
                <li
                  v-for="page in findPages(secondSection.subItems)"
                  :id="page.path"
                  :key="page.path"
                  :class="getClassesForAnchor(page)"
                  style="margin-top: -5px;"
                  @mousedown="$emit('navigate')"
                >
                  <g-link
                    :to="`${page.path}`"
                    class="flex items-center py-1 font-semibold"
                  >
                    <span
                      class="absolute opacity-0 bg-ui-primary transition transform scale-0 origin-center"
                      :class="{
                        'opacity-100 scale-100': currentPage.path === page.path
                      }"
                    ></span>
                    <span class="triangle"></span>
                    <h5 style="margin-top: 3px;" v-if="page.title">
                      {{ page.title }}
                    </h5>
                  </g-link>
                </li>
              </ul>
            </li>
          </li>
        </ul>
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
          title
          name {
            subTitle
            subItems
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
    margin-right: 7px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 8px solid white; /* 조절 가능한 높이와 색상 */
    transform: rotate(270deg); /* 90도 회전 */
    margin-left: 5px; /* 조절 가능한 여백 */
  }
</style>
