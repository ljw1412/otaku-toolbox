<template>
  <div class="index-anime-item">
    <router-link target="_blank"
      :title="anime.title"
      :to="{name:'AnimeWiki',params:{id:anime._id},query:{app:'otakutools'}}">
      <a-card class="anime-card"
        hoverable
        :bordered="false"
        :body-style="{padding: '8px 6px'}">
        <template #cover>
          <acg-ratio-div :ratio="[3,4]"
            class="anime-cover">
            <img :src="cover"
              loading="lazy">
            <div v-if="showOnair"
              class="anime-onair">{{onairStr}}</div>
          </acg-ratio-div>
        </template>
        <a-card-meta :title="anime.title"></a-card-meta>
      </a-card>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { compressImage } from '/@/utils/image'

export default defineComponent({
  name: 'IndexAnimeCard',

  props: {
    anime: { type: Object, default: () => ({}) },
    showOnair: Boolean
  },

  computed: {
    cover() {
      return compressImage(this.anime.coverMin)
    },
    onair(): FormatedAnimeDatetime {
      return this.anime.formatOnair[this.hourSystem]
    },
    onairStr() {
      if (!this.onair.unix) return '敬请期待'
      return this.onair.fullDateCH + '开播'
    }
  }
})
</script>

<style lang="scss">
.index-anime-item {
  width: calc(var(--index-anime-item-width) - var(--index-anime-item-gutter));
  margin-right: var(--index-anime-item-gutter);
  margin-bottom: var(--index-anime-item-gutter);
  box-sizing: border-box;

  > a {
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  .anime-card {
    border-radius: 4px;
    overflow: hidden;
    transition-property: box-shadow, transform;

    &:hover {
      transform: translateY(-4px);
    }
  }

  .anime-onair {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 36px;
    line-height: 36px;
    padding: 28px 10px 0;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0, rgba(0, 0, 0, 0));
  }
}
</style>
