<template>
  <div
    class="today-bangumi-item"
    :class="{ 'is-skeleton': skeleton }"
    :data-id="bangumi._id"
    data-skeleton-animate
  >
    <router-link
      target="_blank"
      :title="bangumi.title"
      :to="{ name: 'AnimeWiki', params: { id: bangumi._id || '0' }, query: { app: 'otakutools' } }"
    >
      <a-card class="bangumi-card" hoverable :bordered="false">
        <template #cover>
          <acg-ratio-div class="skeleton-bg" :ratio="[4, 3]">
            <img v-if="!skeleton" :src="bangumi.coverMin" loading="lazy" />
          </acg-ratio-div>
        </template>
        <a-card-meta>
          <template #title>
            <a-space size="mini">
              <a-tag class="skeleton-bg">{{ onair.time || '??:??' }}</a-tag>
              <div class="title skeleton-bg">{{ bangumi.title }}</div>
            </a-space>
          </template>
        </a-card-meta>
      </a-card>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'TodayBangumiItem',
  props: {
    current: String,
    skeleton: Boolean,
    bangumi: {
      type: Object as PropType<BangumiBasicWithTime>,
      default: () => ({})
    }
  },

  computed: {
    onair(): FormatedAnimeDatetime | Record<string, any> {
      if (!this.bangumi.formatOnair) {
        return {}
      }
      return this.bangumi.formatOnair[this.hourSystem]
    }
  },

  methods: {
    handleOnairClick(url?: string) {
      if (url) window.open(url, '_blank')
    }
  }
})
</script>

<style lang="scss">
.today-bangumi-item {
  flex: 0 0 auto;
  padding-bottom: 20px;

  &:not(:first-child) {
    margin-left: 20px;
  }

  .bangumi-card {
    --acg-card-border-raduis: 8px;
    cursor: pointer;
    display: inline-block;
    width: 280px;
    transition-property: box-shadow, transform;

    .cover {
      width: 100%;
    }

    .title {
      line-height: 24px;
      height: 24px;
      min-width: 100px;
    }

    &:hover {
      transform: translateY(-4px);
    }
  }

  &.is-skeleton {
    .bangumi-card {
      cursor: default;
      margin-bottom: 30px;
      .title {
        border-radius: var(--border-radius-small);
      }

      .arco-tag {
        color: transparent;
      }
    }
  }
}
</style>
