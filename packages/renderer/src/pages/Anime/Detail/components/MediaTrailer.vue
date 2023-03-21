<script setup lang="ts">
import { ref, reactive, computed, watch, h, VNode } from 'vue'
import { useRoute } from 'vue-router'
import $global from '/@/global/index'
import $API from '/@/apis/index'
import { simpleCopy } from '/@/utils/assist'
import InfoGroup from './InfoGroup.vue'
import cache from '../utilities/cache'
import { only } from '/@/utils/object'

interface Trailer extends BangumiLink {
  iframeOptions?: Record<string, string>
  iframe?: VNode
  active?: boolean
}

const $route = useRoute()

const trailerListRef = ref<HTMLElement>()

const bangumi = computed(() => {
  const loader = cache.bangumi[$route.params.id as string]
  return loader ? loader.info : ({} as FormatedBangumiBasic)
})

const trailer = reactive({
  current: {} as Trailer,
  list: [] as Trailer[],
  activeIndex: 0
})

function createIframe(options: Record<string, string> = {}) {
  return h('iframe', options)
}

function appendAutoPlay(url: string, autoplay = '0') {
  return (url += (url.includes('?') ? '&' : '?') + 'autoplay=' + autoplay)
}

async function loadData(list: Trailer[]) {
  list.forEach((item) => {
    item.iframeOptions = Object.assign(
      { src: appendAutoPlay(item.url) },
      $global.dialog.defaultOptions
    )
    if (item.url.includes('.bilibili.com')) {
      item.from = 'BilibiliW'
    } else if (item.url.includes('.youtube.com')) {
      item.from = 'YouTubeW'
    }
    item.iframe = createIframe(item.iframeOptions)
    item.active = false
  })
  if (list.length) {
    list[0].active = true
  }
  trailer.list = list
}

function calcMovedIndex(index: number) {
  const len = trailer.list.length
  return (index - trailer.activeIndex + len) % len
}

function switchCard(item: Trailer, index: number) {
  trailer.list.forEach((el) => {
    el.active = false
  })
  item.active = true
  trailer.activeIndex = index
  trailerListRef.value?.scrollTo({ left: 0, behavior: 'smooth' })
}

function watchTrailer(item: Trailer) {
  trailer.current = item

  let { url } = item
  if ($global.config.bangumi.newOpenTrailer) {
    url = appendAutoPlay(url, '1')
    if (url.includes('.bilibili.com')) {
      const [, search] = url.split('?')
      url = `https://www.bilibili.com/blackboard/html5player.html?${search}`
    }
    window.open(url, '_blank')
    return
  }

  $global.dialog.showIframePlayer(url, {
    ...only(item, 'name from'),
    autoplay: true
  })
}

watch(
  () => bangumi.value,
  (bangumi: FormatedBangumiBasic) => {
    if (bangumi.links) {
      const links = simpleCopy(
        bangumi.links.filter((item) => item.type === 'trailer')
      )
      loadData(links)
    }
  },
  { immediate: true }
)
</script>

<template>
  <info-group v-if="trailer.list.length" class="media-trailer" title="预告片">
    <div ref="trailerListRef" class="trailer-list">
      <a-card
        v-for="(item, index) of trailer.list"
        :key="item._id"
        :bordered="false"
        :style="{
          transform: `translateX(calc(${calcMovedIndex(
            index
          )} * var(--handler-width)))`,
          zIndex: 100 - calcMovedIndex(index)
        }"
        :body-style="{ padding: '0', height: '100%' }"
        :data-from="item.from"
        class="trailer-card"
        :class="{ active: item.active }"
      >
        <div class="trailer-item" @click="switchCard(item, index)">
          <div
            v-if="item.iframe"
            v-show="item.active"
            class="video-container"
            @click="watchTrailer(item)"
          >
            <component :is="item.iframe"></component>
          </div>
          <div class="handler">
            <img
              v-if="getLogoIcon(item.from!)"
              :src="getLogoIcon(item.from!)"
              :title="item.from"
              referrerpolicy="no-referrer"
              class="website-icon"
            />
            <span class="trailer-name">
              <span v-for="(char, i) of item.name" :key="char + i">
                {{ char }}
              </span>
            </span>
          </div>
        </div>
      </a-card>
    </div>
  </info-group>
</template>

<style lang="scss">
.media-trailer {
  --player-width: 400px;
  --player-height: 225px;
  --player-out-padding: 2px;
  --name-font-size: 16px;
  --handler-width: 50px;
  --website-icon-width: 32px;
  --website-icon-margin: 8px 0;
  --trailer-name-padding: 0;

  width: 100%;

  [data-from='BilibiliW'] {
    background-color: #1296db;
  }

  [data-from='YouTubeW'] {
    background-color: #ff0000;
  }

  .trailer-list {
    position: relative;
    height: calc(var(--player-height) + var(--player-out-padding) * 2);
    overflow-y: hidden;
    overflow-x: auto;
    user-select: none;
    transition: height 0.2s;
  }

  .trailer-card {
    position: absolute;
    top: 0;
    height: 100%;
    box-shadow: 0 2px 5px #000;
    transition: transform 0.2s;

    &.active {
      left: 0 !important;
      z-index: 105 !important;
    }
  }

  .trailer-item {
    position: relative;
    height: 100%;
    padding-left: calc(var(--player-width) + var(--player-out-padding) * 2);
    cursor: pointer;
    transition: padding-left 0.2s;

    .video-container {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--player-width);
      height: var(--player-height);
      padding: var(--player-out-padding);
      background-color: rgba(255, 255, 255, 0.25);
      transition: width 0.2s, height 0.2s, padding 0.2s;

      iframe {
        pointer-events: none;
        width: 100%;
        height: 100%;
        border-radius: var(--border-radius-medium);
      }
    }

    .handler {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: var(--handler-width);
      height: 100%;
      color: #fff;
      .website-icon {
        width: var(--website-icon-width);
        margin: var(--website-icon-margin);
        object-fit: contain;
      }

      .trailer-name {
        font-size: var(--name-font-size);
        text-align: center;
        padding: var(--trailer-name-padding);

        > span {
          display: block;
        }
      }
    }
  }
}

@media (max-width: 1199.9px) {
  .media-trailer {
    --player-width: 320px;
    --player-height: 180px;
    --name-font-size: 14px;
    --handler-width: 40px;
    --website-icon-width: 28px;
    --website-icon-margin: 6px 0;
    --trailer-name-padding: 0;
  }
}

@media (max-width: 767.9px) {
  .media-trailer {
    --player-width: 240px;
    --player-height: 135px;
    --player-out-padding: 1px;
    --name-font-size: 12px;
    --handler-width: 32px;
    --website-icon-width: 20px;
    --website-icon-margin: 4px 0;
    --trailer-name-padding: 0 2px;
  }
}
</style>
