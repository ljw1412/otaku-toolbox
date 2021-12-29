<template>
  <div class="comic-history">
    <a-page-header title="历史记录"
      class="comic-header"
      :show-back="false">
      <template #extra>
        <a-button size="small"
          :loading="isLoading"
          @click="fetchHistory">刷新</a-button>
      </template>
    </a-page-header>

    <a-row class="history-list"
      :gutter="8">
      <a-col v-for="item of list"
        :key="item.key"
        :span="8">
        <history-card :history="item"></history-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { whenever } from '@vueuse/core'
import { defineComponent } from 'vue'
import HistoryCard from './components/HistoryCard.vue'

export default defineComponent({
  name: 'ComicHistory',

  components: { HistoryCard },

  data() {
    return { isLoading: true, list: [] as ComicHistory[] }
  },

  activated() {
    this.fetchHistory()
  },

  methods: {
    async fetchHistory() {
      this.isLoading = true
      if (this.$global.IDB.opend) {
        const list = await window.$db.history.readAll()
        list.forEach(item => {
          const [namespace, ppath] = item.key!.split('||')
          Object.assign(item, { namespace, ppath })
        })
        this.list = list
        this.isLoading = false
      } else {
        whenever(() => this.$global.IDB.opend, this.fetchHistory)
      }
    }
  }
})
</script>

<style lang="scss">
</style>
