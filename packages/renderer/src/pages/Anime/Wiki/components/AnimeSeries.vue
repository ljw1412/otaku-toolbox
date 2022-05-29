<template>
  <div v-for="series of seriesList" :key="series._id" class="anime-series">
    <h3 class="series-title">{{ series.title ? (`《${series.title}》系列`) : '关联作品' }}</h3>
    <div class="series-bangumi">
      <AnimeCard v-for="item of series.bangumis" :key="item._id" :anime="item"></AnimeCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AnimeCard from '/@/pages/Anime/Index/components/AnimeCard.vue'

export default defineComponent({
  name: 'AnimeSeries',

  components: { AnimeCard },

  props: { id: { type: String, default: '' } },

  data() {
    return {
      seriesList: [] as Series[]
    }
  },


  watch: {
    id: {
      immediate: true,
      handler(id: string) {
        if (id) {
          this.fetchSeriesList()
        }
      }
    }
  },

  methods: {
    async fetchSeriesList() {
      this.seriesList = await this.$API.Series.showSeries(this.id)
    }
  }

})
</script>

<style lang="scss">
.anime-series {
  --index-anime-item-width: 16.66%;
  --index-anime-item-gutter: 16px;

  .series-bangumi {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-content: stretch;
  }

  .series-title {
    margin-bottom: 16px;
  }
}

@media (max-width: 767.9px) {
  .anime-series {
    --index-anime-item-width: 33.33%;
    --index-anime-item-gutter: 8px;
  }
}
</style>
