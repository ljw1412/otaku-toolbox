<template>
  <acg-card class="bangumi-list-item"
    fill
    no-border
    shadow="never"
    :data-anime-id="anime.id">
    <div class="anime-header">
      <div class="anime-names">
        <div class="localized-name">{{ anime.title }}</div>
        <div class="original-name">{{ anime.titleJP }}</div>
      </div>
      <div class="anime-specs">
        <div class="anime-tags">
          <span v-for="tag of anime.tags"
            :key="tag"
            class="tag">{{tag}}</span>
        </div>
        <div class="anime-onair">播出时间:7月6日起／每週二／23時0分</div>
      </div>
    </div>

    <div class="anime-gallery">
      <div class="gallery">
        <div class="image">
          <img :src="currentImage"
            loading="lazy" />
        </div>
        <div class="image-list">
          <div v-for="image of anime.cover"
            :key="image"
            class="image-item"
            :class="{active:image === currentImage}"
            @click="changeImage(image)">
            <img :src="image"
              loading="lazy">
          </div>
        </div>
      </div>
    </div>

    <div class="anime-info">
      <div v-show="animeTitleMore"
        class="anime-name-more info-block">
        <h4>其它名称</h4>
        <p>{{ animeTitleMore }}</p>
      </div>
      <div v-show="anime.desc"
        class="anime-desc info-block">
        <h4>故事简介</h4>
        <p>{{ anime.desc }}</p>
      </div>
      <div v-show="anime.copyright"
        class="anime-copyright info-block">
        <i>{{ anime.copyright }}</i>
      </div>
      <div v-show="anime.links.length"
        class="anime-links info-block">
        <h4>相关链接</h4>
        <p>
          <a v-for="link of anime.links"
            :key="link.name"
            :href="link.url"
            class="anime-link"
            :title="link.message || link.name"
            target="_blank">{{ link.name }}</a>
        </p>
      </div>
      <div v-show="anime.streamingPlatforms.length"
        class="info-block">
        <h4>网络播放</h4>
        <p>
          <a v-for="link of anime.streamingPlatforms"
            :key="link.name"
            :href="link.url"
            class="anime-link"
            :title="link.message || link.name"
            target="_blank">{{ link.name }}</a>
        </p>
      </div>
    </div>

    <div class="anime-info">
      <div>
        <h4>Cast</h4>
      </div>
      <div>
        <h4>Staff</h4>
      </div>
    </div>
  </acg-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'AnimeBangumiListItem',

  props: {
    anime: { type: Object as PropType<AnimeOfBangumi>, default: () => ({}) }
  },

  data() {
    return {
      currentImage: ''
    }
  },

  computed: {
    animeTitleMore(): string {
      return (this.anime.titleMore || []).join('、')
    }
  },

  mounted() {
    if (this.anime && this.anime.cover) {
      this.currentImage = this.anime.cover[0]
    }
  },

  methods: {
    changeImage(image: string) {
      this.currentImage = image
    }
  }
})
</script>

<style lang="scss">
.bangumi-list-item {
  overflow: initial !important;
  .acg-card__body {
    user-select: text;
    display: grid;
    height: 100%;
    grid-template-columns: 30% 35% 35%;

    > .anime-header {
      box-sizing: border-box;
      position: sticky;
      top: 0;
      display: flex;
      height: var(--list-item-header-height);
      padding: 0 8px;
      grid-column: 1/4;
      background-color: var(--acg-card-background-color);
      z-index: 10;
      align-items: center;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-color: rgba(255, 255, 255, 0.05);
      }

      .anime-names {
        flex-shrink: 0;
        box-sizing: border-box;
        width: 65%;
      }

      .anime-specs {
        flex-shrink: 0;
        box-sizing: border-box;
        width: 35%;
      }

      .localized-name {
        font-size: 24px;
        line-height: 28px;
        font-weight: 700;
      }

      .original-name {
        font-size: 18px;
        line-height: 20px;
        font-weight: 400;
      }

      .anime-tags .tag {
        display: inline-block;
        margin-right: 4px;
        padding: 2px 4px;
        border: 1px solid currentColor;
        border-radius: 4px;
      }
    }

    > .anime-gallery {
      position: relative;
      font-size: 0;
      background-color: rgba(0, 0, 0, 0.15);

      .gallery {
        position: sticky;
        top: var(--list-item-header-height);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image {
        width: 100%;
        height: calc(var(--list-item-height) - 80px);
      }

      .image-list {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        .image-item {
          cursor: pointer;
          width: 64px;
          height: 64px;
          border: 3px solid #ffffff;
          opacity: 0.5;

          & + .image-item {
            margin-left: 2px;
          }

          &.active {
            opacity: 1;
            border-color: var(--app-theme);
          }

          &:hover {
            opacity: 1;
          }
        }
      }
    }

    > .anime-info {
      padding: 8px 8px 0 8px;

      h4 {
        font-size: var(--list-item-info-min-font-size);
        border-bottom: 1px solid var(--border-color);
        opacity: 0.5;
      }

      p {
        padding: 2px 0;
      }

      a.anime-link {
        display: inline-block;
        color: #5f8dc7;
        font-size: var(--list-item-info-min-font-size);
        margin-right: 6px;
      }

      .info-block {
        margin-bottom: 6px;
        font-size: var(--list-item-info-font-size);
      }

      .anime-copyright {
        font-size: var(--list-item-info-min-font-size);
        font-weight: 300;
      }
    }
  }

  & + & {
    margin-top: 12px;
  }
}
</style>
