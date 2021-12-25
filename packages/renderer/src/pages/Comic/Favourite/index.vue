<template>
  <div class="comic-favourite">
    <a-page-header title="我的收藏"
      class="comic-header"
      :show-back="false"></a-page-header>

    <div class="comic-list">
      <comic-card v-for="item of list"
        :key="item.id"
        :info="item"
        :namespace="item.origin"></comic-card>
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
      list: [] as ComicItem[]
    }
  },

  activated() {
    console.log('activated')

    this.fetchFavourites()
  },

  methods: {
    async fetchFavourites() {
      if (this.$global.IDB.opend) {
        this.list = await window.$db.favorites.readAll()
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
