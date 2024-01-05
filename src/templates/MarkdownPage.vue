<template>
  <Layout>
      <div class="flex flex-wrap items-start justify-start">
        <div class="order-2 w-full md:w-1/3 sm:pl-4 md:pl-6 lg:pl-8 sticky" style="top: 4rem">
          <OnThisPage />
        </div>
        <div class="order-1 w-full md:w-2/3">
          <div class="content" v-html="$page.markdownPage.content" />
          <div class="mt-8 pt-8 lg:mt-12 lg:pt-12 border-t border-ui-border">
            <NextPrevLinks />
          </div>
        </div>
      </div>
  </Layout>
</template>

<page-query>
query ($id: ID!) {
  markdownPage(id: $id) {
    id
    title
    description
    path
    timeToRead
    content
    sidebar
    next
    prev
    headings {
      depth
      value
      anchor
    }
  }
  allMarkdownPage{
    edges {
      node {
        path
        title
      }
    }
  }
}
</page-query>

<script>
import OnThisPage from '@/components/OnThisPage.vue';
import NextPrevLinks from '@/components/NextPrevLinks.vue';
import { ArrowRightCircleIcon, ZapIcon, CodeIcon, MoonIcon, SearchIcon } from 'vue-feather-icons';


export default {
  components: {
    OnThisPage,
    NextPrevLinks,
    ArrowRightCircleIcon
  },
  metaInfo: {
    title: 'msaez',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
  },
  mounted() {
    this.wrapTables();
  },
  
  watch: {
    "$page.markdownPage.content":function(newvalue){
      this.track()
    },
    "$page.markdownPage.content"() {
      this.track();
      this.$nextTick(function () {
        this.wrapTables();
      });
    }
  },
  methods: {
    track() {
      var getTitle = this.$page.markdownPage && this.$page.markdownPage.title ?
          this.$page.markdownPage.title : this.$route.path
      var location = window.location.hostname
      if (location && location != 'localhost') {
          getTitle = `${location}_${getTitle}`
      }
      this.$ga.page({
          page: this.$route.path,
          title: getTitle
      })
    },
    wrapTables() {
      // 페이지의 모든 테이블을 찾아 각각을 overflow 스타일이 적용된 div로 감쌉니다.
      const tables = this.$el.querySelectorAll('.content table');
      tables.forEach((table) => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'auto';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      });
    }
},



  metaInfo() {
    const title = this.$page.markdownPage.title;
    const description = this.$page.markdownPage.description || this.$page.markdownPage.excerpt;

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
      ]
    }
  }
}
</script>

<style>
@import 'prism-themes/themes/prism-material-oceanic.css';
</style>