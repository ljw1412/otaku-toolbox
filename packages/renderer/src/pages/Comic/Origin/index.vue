<template>
  <div class="comic-origin">
    <a-page-header :title="rule.name" class="comic-header" :show-back="false">
      <template v-if="tab === '搜索'" #subtitle>搜索：{{ searchKeyword }}</template>
      <template #extra>
        <a-space>
          <a-input-search
            v-if="rule.search"
            v-model="keyword"
            style="width: 140px;"
            size="small"
            placeholder="关键词搜索"
            @press-enter="search"
            @search="search"
          ></a-input-search>
          <a-radio-group v-model="tab" type="button">
            <a-radio v-for="page of rule.pages" :key="page.name" :value="page.name">{{ page.name }}</a-radio>
          </a-radio-group>
          <a-button title="刷新" :loading="isTabPageLoading" @click="refresh">
            <template #icon>
              <icon-refresh />
            </template>
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <tab-page
      v-for="page of loadedTabPageList"
      v-show="page.name === tab"
      :key="page.name"
      :ref="setItemRef"
      :name="page.name"
      :rule="page"
      :keyword="searchKeyword"
    ></tab-page>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TabPage from './components/TabPage.vue'
import ComicMixin from '/@/mixins/comic'

export default defineComponent({
  name: 'ComicOrigin',

  components: { TabPage },

  mixins: [ComicMixin],

  data() {
    return {
      tab: '',
      tabPageRefs: [] as typeof TabPage[],
      keyword: '',
      searchKeyword: ''
    }
  },

  computed: {
    tabPageList(): DataCenter.RulePageParams[] {
      const list = [] as DataCenter.RulePageParams[]
      if (this.rule.pages) {
        list.push(...(this.rule.pages || []))
      }
      if (this.rule.search) {
        list.push(this.rule.search)
      }
      return list
    },

    loadedTabPageList() {
      return this.tabPageList.filter(page => page.loaded)
    },

    currentTabPageRef() {
      return this.tabPageRefs.find(item => item.name === this.tab)
    },

    isTabPageLoading() {
      return this.currentTabPageRef ? this.currentTabPageRef.isLoading : false
    }
  },

  watch: {
    rule() {
      this.initTab()
    },
    tab(val: string) {
      const page = this.tabPageList.find(page => page.name === val)
      if (page && !page.loaded) {
        page.loaded = true
      }
    }
  },

  beforeUpdate() {
    this.tabPageRefs = []
  },

  methods: {
    setItemRef(el: any) {
      if (el) {
        this.tabPageRefs.push(el)
      }
    },

    initTab() {
      this.$nextTick(() => {
        this.tabPageList.forEach(page => {
          page.loaded = false
        })
        if (this.tabPageList.length) {
          this.tab = this.tabPageList[0].name
          this.tabPageList[0].loaded = true
        }
      })
    },

    search() {
      if (this.keyword.trim()) {
        this.searchKeyword = this.keyword
        this.tab = '搜索'
      }
    },

    refresh() {
      if (this.currentTabPageRef) {
        this.currentTabPageRef.runRule()
      }
    }
  }
})
</script>

<style lang="scss">
.comic-origin {
  position: relative;
  min-height: 100%;
}
</style>
