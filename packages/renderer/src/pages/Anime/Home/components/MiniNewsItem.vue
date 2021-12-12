<template>
  <a-card class="mini-news-item"
    hoverable
    :bordered="false"
    :body-style="{padding:0}"
    @click="handleNewsClick">
    <div class="news-item-container">
      <div class="cover">
        <img :src="cover"
          loading="lazy" />
      </div>
      <div class="title">{{ title }}</div>
      <div class="content">{{ desc }}</div>
    </div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MiniNewsItem',
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
.mini-news-item {
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 30px;

  &.arco-card {
    transition-property: box-shadow, transform;
    &:hover {
      transform: translateY(-4px);
    }
  }

  .news-item-container {
    display: grid;
    height: 200px;
    grid-template-columns: 200px auto;
    grid-template-rows: 60px auto;

    * {
      box-sizing: border-box;
    }

    .cover {
      grid-row: 1/3;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .title {
      align-self: center;
      padding: 0 8px;
      font-weight: bold;
    }

    .content {
      padding: 8px;
      font-size: 14px;
    }
  }
}
</style>
