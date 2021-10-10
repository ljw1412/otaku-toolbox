<template>
  <div class="today-bangumi-item"
    :class="{ 'is-skeleton': skeleton }"
    data-skeleton-animate>
    <acg-card class="bangumi-card"
      fill
      no-border
      :hover-up="!skeleton"
      :shadow="skeleton ? 'never' : 'hover'">
      <div class="cover skeleton-bg">
        <img v-if="!skeleton"
          :src="bangumi.cover"
          loading="lazy">
      </div>
      <div class="info">
        <h4 class="title text-truncate skeleton-bg">
          <template v-if="!skeleton">{{ bangumi.title }}</template>
        </h4>
      </div>
    </acg-card>
    <div class="onair-list">
      <div v-for="onair of (bangumi.onairList || [])"
        :key="onair.url"
        class="onair-item">
        <acg-card :title="onair.message || `${onair.name}@${onair.time}`"
          fill
          no-border
          shadow="never"
          class="onair-item-card skeleton-bg"
          :class="{disabled:!onair.url}"
          @click="handleOnairClick(onair.url)">
          <template v-if="!skeleton">
            <img v-if="getLogoIcon(onair.from)"
              :src="getLogoIcon(onair.from)"
              class="onair-item-icon">
            <span class="onair-item-time">{{ onair.time }}</span>
          </template>
        </acg-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { getLogoIcon } from '/@/utils/icons'

export default defineComponent({
  name: 'TodayBangumiItem',
  props: {
    skeleton: Boolean,
    bangumi: { type: Object as PropType<TodayBangumiItem>, default: () => ({}) }
  },

  methods: {
    getLogoIcon,
    handleOnairClick(url?: string) {
      if (url) window.open(url, '_blank')
    }
  }
})
</script>

<style lang="scss">
.today-bangumi-item {
  position: relative;
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

    .cover {
      height: 200px;
      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .info {
      padding: 10px 16px;
      .title {
        font-size: 16px;
        height: 22px;
        line-height: 22px;
      }
    }
  }

  .onair-list {
    position: absolute;
    bottom: 10px;
    .onair-item {
      display: inline-block;
      height: 28px;
      width: 76px;

      &:not(:first-child) {
        margin-left: 4px;
      }

      &-card {
        cursor: pointer;
        padding: 0 10px;
        font-size: 14px;
        line-height: 16px;
        width: 100%;
        height: 100%;
      }

      .acg-card__body {
        display: flex;
        align-items: center;
        height: 100%;
      }

      .onair-item-icon,
      .onair-item-time {
        flex: 0 0 auto;
      }

      .onair-item-icon {
        width: 16px;

        & + .onair-item-time {
          margin-left: 4px;
        }
      }
    }
  }

  &:not(.is-skeleton) {
    .onair-item-card:not(.disabled) {
      &:hover {
        opacity: 0.85;
      }
      &:active {
        transform: scale(0.9);
      }
    }
  }

  &.is-skeleton {
    .bangumi-card {
      cursor: default;
      margin-bottom: 30px;
      .title {
        width: 60%;
        border-radius: 4px;
      }
    }
    .onair-list {
      .onair-item-card {
        cursor: default;
      }
    }
  }
}
</style>
