<template>
  <div
    ref="sidebar"
    v-if="showSidebar"
    class="pt-8"
  >
    <div style="margin-top:5px;"
      v-for="(section, index) in sidebar.sections"
      :key="section.title"
    >
      <div class="sidebar-title" style="font-weight:700; font-size:14px; margin-bottom:5px;" v-if="section.firstTitle && !section.firstItem && !section.firstLink">
        {{ section.firstTitle }}
      </div>
      <g-link
        v-if="section.firstTitle && section.firstItem && !section.firstLink"
        :to="`${section.firstItem}`"
        class="flex items-center py-1"
      >
        <h3 style="margin:-5px 0px 0px 0px; font-size: 16px;" :class="getClassesForAnchor(section)" @mousedown="$emit('navigate')">
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
            <div style="padding:2px 0px; margin-left:15px; font-size: 14px;" :class="getClassesForAnchor(secondSection)" @mousedown="$emit('navigate')">
              {{ secondSection.secondTitle }}
            </div>
          </g-link>
          <g-link
            v-if="secondSection.secondTitle && !secondSection.secondItem && secondSection.secondLink"
            :to="`${secondSection.secondLink}`"
            class="flex items-center py-1"
          >
            <h4 style="margin-left: 15px; margin-bottom: 0px; font-size: 14px;">
              {{ secondSection.secondTitle }}
            </h4>
          </g-link>
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
      expanded: [],
      currentPath: String
    };
  },
  watch: {
    '$route'(to) {
      // 라우트가 변경될 때마다 실행될 로직
      this.currentPath = to.path
    }
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
    getClassesForAnchor(path) {
      return {
        active: this.currentPath === path.secondItem || this.currentPath === path.firstItem
      }
    },
    findPages(links) {
      return links.map(link => this.pages.find(page => page.path === link));
    }
  },  
};
</script>
<style scoped>
.active {
  color:#5A67D8;
  font-weight: 900;
}
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