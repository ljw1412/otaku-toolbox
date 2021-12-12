<template>
  <div class="index-admin-item">
    <router-link target="_blank"
      :title="anime.title"
      :to="{name:'AnimeWiki',params:{id:anime._id},query:{app:'otakutools'}}">
      <a-card class="anime-card"
        hoverable
        :bordered="false"
        :body-style="{padding: '4px'}">
        <template #cover>
          <div class="acg-image">
            <img :src="cover"
              loading="lazy">
          </div>
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

  props: { anime: { type: Object, default: () => ({}) } },

  computed: {
    cover(): string {
      return compressImage(this.anime.coverMin)
    }
  }
})
</script>

<style lang="scss">
.index-admin-item {
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
    .acg-image {
      position: relative;
      padding-bottom: calc(4 / 3 * 100%);
      overflow: hidden;
      transform: translateZ(0);
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }

    &:hover {
      transform: translateY(-4px);
    }
  }
}
</style>
