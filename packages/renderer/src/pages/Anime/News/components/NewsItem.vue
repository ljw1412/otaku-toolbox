<template>
  <a-card class="news-item"
    hoverable
    :bordered="false"
    :body-style="{padding:0}"
    @click="handleNewsClick">
    <div class="news-item-container">
      <div class="cover">
        <img :src="cover"
          loading="lazy" />
      </div>

      <div class="title text-truncate">
        {{ title }}
      </div>

      <div class="content"
        :ellipsis="{ rows:3 }">
        {{ desc }}
      </div>

      <p class="update-time">{{ updateTime }}</p>
    </div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NewsItem',
  props: {
    cover: { type: String, default: '' },
    title: { type: String, default: '' },
    desc: { type: String, default: '' },
    from: { type: String, default: '' },
    url: { type: String, default: '' },
    updateTime: { type: String, default: '' }
  },

  methods: {
    handleNewsClick() {
      if (this.url) {
        window.open(this.url)
      }
    }
  }
})
</script>

<style lang="scss">
@import '../../../../styles/scss/index';
.news-item {
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 30px;

  &.arco-card {
    transition-property: box-shadow, transform;
    &:hover {
      transform: translateY(-4px);
      .news-item-container {
        color: var(--color-text-1);
      }
    }
  }

  .news-item-container {
    display: grid;
    height: 150px;
    grid-template-columns: 200px auto;
    grid-template-rows: 48px 76px auto;
    transition: color 0.2s;

    * {
      box-sizing: border-box;
    }

    .cover {
      grid-row: 1/4;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .title {
      font-size: 20px;
      line-height: 1.4;
      padding: 8px;
    }

    .content {
      padding: 0 8px;
      font-size: 14px;
      line-height: 1.5715;
      height: 68px;
      word-break: break-all;
      @include multi-text-truncate(3);
    }

    .update-time {
      text-align: right;
      padding: 0 8px;
    }
  }
}
</style>
