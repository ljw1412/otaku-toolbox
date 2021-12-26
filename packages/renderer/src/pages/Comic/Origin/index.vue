<template>
  <div class="comic-origin">
    <a-page-header :title="rule.name"
      class="comic-header"
      :show-back="false">
      <template #extra>
        <a-radio-group v-model="tab"
          type="button">
          <a-radio v-for="page of rule.pages"
            :key="page.name"
            :value="page.name">{{ page.name }}</a-radio>
        </a-radio-group>
      </template>
    </a-page-header>

    <tab-page v-for="page of loadedTabPageList"
      v-show="page.name === tab"
      :key="page.name"
      :rule="page"></tab-page>

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
      tab: ''
    }
  },

  computed: {
    tabPageList() {
      return this.rule.pages || []
    },

    loadedTabPageList() {
      return this.tabPageList.filter(page => page.loaded)
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

  methods: {
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
