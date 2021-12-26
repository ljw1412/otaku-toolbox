<template>
  <div class="comic-favourite">
    <a-page-header title="我的收藏"
      class="comic-header"
      :show-back="false">
      <template #extra>
        <a-button size="small"
          :loading="isLoading"
          @click="fetchFavourites">刷新</a-button>
      </template>
    </a-page-header>

    <div class="comic-list">
      <comic-card v-for="item of list"
        :key="item.id"
        :info="item"></comic-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { whenever } from '@vueuse/core'
import ComicCard from '../components/ComicCard.vue'

export default defineComponent({
  name: 'ComicFavourite',

  components: {
    ComicCard
  },

  data() {
    return {
      isLoading: true,
      list: [] as ComicItem[]
    }
  },

  activated() {
    this.fetchFavourites()
  },

  methods: {
    async fetchFavourites() {
      this.isLoading = true
      if (this.$global.IDB.opend) {
        const list = await window.$db.favorites.readAll()
        list.forEach(item => {
          const [namespace, path] = item.key!.split('||')
          Object.assign(item, { namespace, path })
        })
        this.list = list
        this.isLoading = false
      } else {
        whenever(() => this.$global.IDB.opend, this.fetchFavourites)
      }
    }
  }
})
</script>

<style lang="scss">
.comic-favourite {
  --comic-card-gap: 6px;
  --comic-card-width: calc(20% - var(--comic-card-gap));
  .comic-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 12px;
    .comic-card-wrap {
      flex: 0 0 auto;
      width: var(--comic-card-width);
      margin-right: var(--comic-card-gap);
      margin-bottom: var(--comic-card-gap);
    }
  }
}
</style>
