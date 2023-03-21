<script setup lang="ts">
import { ref, computed, watch, h, VNode } from 'vue'
import $global from '/@/global/index'

const iframePlayer = computed(() => $global.dialog.$iframePlayer)
const iframe = ref<VNode>()

function createIframe(options: Record<string, string> = {}) {
  return h('iframe', options)
}

watch(
  () => iframePlayer.value.isDisplay,
  (visible: boolean) => {
    if (visible) {
      let src = iframePlayer.value.src
      if (iframePlayer.value.autoplay) {
        src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1'
      }
      const options = Object.assign({ src }, iframePlayer.value.options)
      iframe.value = createIframe(options)
    }
  }
)
</script>

<template>
  <div v-if="iframePlayer.isDisplay" class="app-iframe-player">
    <div class="player-wrapper">
      <div class="player-header" :data-from="iframePlayer.from">
        <div class="player-title">
          <img
            v-if="getLogoIcon(iframePlayer.from)"
            :src="getLogoIcon(iframePlayer.from)"
            referrerpolicy="no-referrer"
            class="website-icon"
          />
          <span class="trailer-name">{{ iframePlayer.name }}</span>
        </div>
        <div class="btn-close" @click="iframePlayer.isDisplay = false">
          <icon-close :size="20" />
        </div>
      </div>
      <acg-ratio-div class="iframe-player" :ratio="[16, 9]">
        <component :is="iframe"></component>
      </acg-ratio-div>
    </div>
  </div>
</template>

<style lang="scss">
.app-iframe-player {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 505;
  display: flex;
  overflow-y: auto;
  background-color: var(--color-mask-bg);
  backdrop-filter: blur(3px);

  .player-wrapper {
    display: inline-block;
    width: 100%;
    max-width: 1080px;
    margin: auto;
    padding: 8px;
  }

  .player-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    width: 100%;
    height: 36px;
    border-top-left-radius: var(--border-radius-medium);
    border-top-right-radius: var(--border-radius-medium);
    background-color: var(--app-color-common);

    &[data-from='BilibiliW'] {
      background-color: #1296db;
    }

    &[data-from='YouTubeW'] {
      background-color: #ff0000;
    }
  }

  .player-title {
    display: flex;
    align-items: center;
    .website-icon {
      width: 24px;
      margin: 0 6px;
    }

    .trailer-name {
      margin-left: 8px;
      font-size: 16px;
    }
  }

  .btn-close {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    cursor: pointer;
    margin-right: 4px;
    color: #fff;
    z-index: 5;
    transition: opacity 0.15s;

    &:hover {
      opacity: 0.5;
    }
  }

  .iframe-player {
    background-color: #000;
  }

  iframe {
    width: 100%;
    height: 100%;
    background-color: #000;
  }
}
</style>
