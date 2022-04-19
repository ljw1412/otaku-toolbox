<template>
  <div class="game-list">
    <a-page-header :title="mTitle" :show-back="false"></a-page-header>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GameList',

  props: {
    namespace: String
  },

  data() {
    return {
      title: '',
      list: [],
      page: { index: 1, size: 1, total: 0 }
    }
  },

  computed: {
    mTitle(): string {
      return (this.$route.query.title as string) || this.title || ''
    }
  },

  watch: {
    namespace() {
      this.fetchData()
    }
  },

  activated() {
    this.fetchData()
    console.log('!!')
  },

  methods: {
    async fetchData() {
      if (!this.namespace) return
      const rule = await this.$API.DataCenter.showRule('game-resource', this.namespace)
      if (rule) {
        const { list, count } = await this.$API.DataCenter.runRule(rule.pages[0])
        this.list = list
        this.page.total = count
      }
    }
  }
})
</script>

<style lang="scss">
</style>

