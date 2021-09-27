<template>
  <div class="bangumi-grid">
    <app-area-header title="新番导览"></app-area-header>
    <div class="anime-grid">
      <div v-for="anime of animes"
        :key="anime.title"
        class="anime-item"
        @click="onAnimeItemClick(anime)">
        <div class="anime-cover">
          <img :src="anime.coverMin">
        </div>
        <div class="anime-title">{{ anime.title }}</div>
        <div class="anime-airdate">{{anime.airdate}}首播</div>
        <div class="anime-airtime">
          <div class="day">{{anime.airday}}</div>
          <div class="time">{{anime.airtime}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'AnimeBangumiGrid',

  props: {
    animes: { type: Array as PropType<AnimeOfBangumi[]>, default: () => [] }
  },

  methods: {
    onAnimeItemClick(anime: AnimeOfBangumi) {
      const query = `.bangumi-list-item[data-anime-id="${anime.id}"]`
      const el = document.querySelector(query)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }
})
</script>

<style lang="scss">
.bangumi-grid {
  .anime-grid {
    display: grid;
    justify-content: space-between;
    grid-row-gap: 5px;
    grid-template-columns: repeat(auto-fill, var(--grid-item-size));
    .anime-item {
      cursor: pointer;
      position: relative;
      box-sizing: border-box;
      border-radius: 4px;
      height: var(--grid-item-size);
      overflow: hidden;
      box-shadow: 1px 2px 3px 0 rgb(255 255 255 / 23%);

      .anime-cover {
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .anime-title {
        font-size: 18px;
        line-height: 20px;
        position: absolute;
        bottom: 0;
        color: #fff;
        padding: 0 5px 5px;
        text-shadow: 0 0 3px #000;
        background: rgba(0, 0, 0, 0)
          linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4))
          repeat scroll 0 0;
      }

      .anime-airdate {
        position: absolute;
        top: 0;
        box-sizing: border-box;
        background: #37474f;
        width: 100%;
        height: 28px;
        border-radius: 4px 4px 0 0;
        padding-right: 42px;
        line-height: 28px;
        font-size: 15px;
        color: #eee;
        background-color: rgba(0, 0, 0, 0.35);
        text-align: center;
      }

      .anime-airtime {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #fff;
        width: 42px;
        height: 42px;
        border-bottom-left-radius: 6px;
        text-align: center;
        box-shadow: 0 0 5px 0 rgb(0 0 0 / 50%);
        > .day {
          line-height: 26px;
          font-size: 18px;
        }
        > .time {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
