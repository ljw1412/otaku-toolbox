<template>
  <div class="video-watch" :class="{ 'only-player': isQueryLink }">
    <div class="watch-main">
      <div class="watch-player-wrap">
        <div
          v-show="status === 'NOT_FOUND'"
          class="not-found-resource layout-center"
        >
          <a-result status="error" title="本集暂无资源"></a-result>
        </div>
        <div
          v-show="status === 'LOADING'"
          class="loading-resource layout-center"
        >
          <a-result :status="null" title="加载中">
            <template #icon><icon-loading /></template>
          </a-result>
        </div>
        <div
          v-show="config.playerType === 'dplayer'"
          class="watch-player"
          ref="dplayer"
          id="dplayer"
        ></div>
        <iframe
          v-if="config.playerType === 'jsonplayer' && config.url"
          width="100%"
          height="100%"
          :src="`https://jx.jsonplayer.com/player/?url=${config.url}`"
          frameborder="0"
          border="0"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
          allowfullscreen
          mozallowfullscreen
          msallowfullscreen
          oallowfullscreen
          webkitallowfullscreen
        ></iframe>
      </div>
      <div class="watch-player-footer layout-lr">
        <div class="footer-left layout-lr">
          <a-select
            v-model="config.playerType"
            size="small"
            style="width: 130px"
            placeholder="播放器"
            @change="handlePlayerChange"
          >
            <a-option value="dplayer">DPlayer</a-option>
            <a-option value="jsonplayer">JSONPlayer</a-option>
          </a-select>
          <a-divider direction="vertical"></a-divider>
          <a-select
            v-model="currentResourceId"
            size="small"
            style="width: 120px"
            placeholder="播放线路"
            @change="handleRouteChange"
          >
            <a-option
              v-for="item of currentEpisode.resources"
              :key="item._id"
              :value="item._id"
              >{{ item.from }}线路</a-option
            >
          </a-select>
        </div>
        <div class="footer-right layout-lr">
          <a-button type="text" size="small">报错</a-button>
        </div>
      </div>
    </div>
    <aside class="watch-aside">
      <div class="info-header">
        <acg-ratio-div :ratio="[3, 4]" class="video-cover">
          <a-image
            :src="cover"
            loading="lazy"
            referrerpolicy="no-referrer"
            show-loader
            :preview="false"
          ></a-image>
        </acg-ratio-div>
        <div class="video-info">
          <div class="video-title">{{ videoInfo.title }}</div>
          <a-space size="mini" class="video-tags" wrap>
            <a-tag
              v-for="tag of videoInfo.tags"
              :key="tag._id"
              :color="tag.color || 'arcoblue'"
              size="small"
            >
              {{ tag.name }}
            </a-tag>
          </a-space>
          <div v-if="onair.fullDate" class="video-onair">
            首播：{{ onair.fullDate }}
          </div>
        </div>
      </div>

      <a-tabs
        default-active-key="episodes"
        type="rounded"
        class="watch-tabs"
        lazy-load
      >
        <a-tab-pane key="info" title="简介">
          <div class="video-desc" v-html="videoInfo.desc"></div>
        </a-tab-pane>

        <a-tab-pane key="episodes" title="分集">
          <a-grid :cols="5" :colGap="8" :rowGap="8" class="episodes-grid">
            <a-grid-item
              v-for="episode of episodeInfo.episodeList"
              :key="episode._id"
              class="episode-item"
            >
              <a-button
                size="large"
                class="episode-btn"
                :type="
                  episode._id === currentEpisode._id ? 'primary' : undefined
                "
                :disabled="!episode.resources.length"
                :title="!episode.resources.length ? '该集没有资源' : undefined"
                @click="switchEpisode(episode)"
              >
                {{ episode.ep }}
              </a-button>
            </a-grid-item>
          </a-grid>
        </a-tab-pane>

        <a-tab-pane key="comments" title="讨论">
          <app-comments
            :key="currentEpisodeId"
            :fetch-comments="fetchComments"
            :reply="saveComment"
            :delete="deleteComment"
          ></app-comments>
        </a-tab-pane>
      </a-tabs>
    </aside>
  </div>
</template>

<script lang="ts">
import { useScriptTag } from '@vueuse/core'
import type DPlayer from 'dplayer'
import { defineComponent } from 'vue'
import AppComments from '/@/components/AppComments.vue'

export default defineComponent({
  name: 'VideoWatch',

  components: { AppComments },

  props: { id: String },

  data() {
    return {
      isQueryLink: false,
      player: null as null | DPlayer,
      videoInfo: {} as FormatedBangumiBasic,
      episodeInfo: {} as EpisodesInfo,
      status: 'LOADING',
      currentEpisodeId: '',
      currentResourceId: '',
      config: {
        url: '',
        autoplay: true,
        playerType: 'dplayer'
      }
    }
  },

  computed: {
    cover() {
      return this.compressImage(this.videoInfo.coverMin, 'small')
    },

    onair(): FormatedAnimeDatetime {
      if (!this.videoInfo._id) return {} as FormatedAnimeDatetime
      return this.videoInfo.formatOnair[this.hourSystem]
    },

    currentEpisode() {
      if (!this.episodeInfo.episodeList) {
        return {} as Episode
      }
      return (this.episodeInfo.episodeList.find(
        (item) => item._id === this.currentEpisodeId
      ) || {}) as Episode
    },

    currentResource() {
      if (!this.currentEpisode._id) return {} as EpisodeResource
      return (
        this.currentEpisode.resources.find(
          (item) => item._id === this.currentResourceId
        ) || ({} as EpisodeResource)
      )
    }
  },

  created() {
    this.loadDPlayerScript()
    const {
      url = '',
      ep = '',
      route = '',
      player = 'dplayer'
    } = this.$route.query

    if (!this.id && url) {
      this.config.url = url as string
      this.isQueryLink = true
    }

    if (['dplayer', 'jsonplayer'].includes(player as string)) {
      this.config.playerType = player as string
    }
    this.currentEpisodeId = ep as string
    this.currentResourceId = route as string
    this.fetchVideoInfo()
    this.fetchEpisodes()
  },

  mounted() {
    // this.initPlayer()
  },

  methods: {
    loadDPlayerScript() {
      useScriptTag(
        'https://cdn.bootcdn.net/ajax/libs/hls.js/1.3.3/hls.min.js',
        () => {
          useScriptTag(
            'https://cdn.bootcdn.net/ajax/libs/dplayer/1.27.1/DPlayer.min.js',
            () => {
              this.initPlayer()
            }
          )
        }
      )
    },

    initPlayer() {
      this.player = new window.DPlayer({
        container: this.$refs.dplayer as HTMLElement,
        video: {
          url: this.config.url
        }
      })

      // @ts-ignore
      this.player.on('loadedmetadata', () => {
        this.status = ''
        if (this.player) {
          this.player.notice(
            '提醒：不要轻易相信视频中的广告，谨防上当受骗!',
            5000,
            0.75
          )
          if (this.config.autoplay) {
            this.player.play()
          }
        }
      })
    },

    updateRoute() {
      this.$router.replace({
        query: {
          ep: this.currentEpisodeId,
          route: this.currentResourceId,
          player: this.config.playerType
        }
      })
    },

    handleRouteChange() {
      this.updateRoute()
      this.switchVideo()
    },

    handlePlayerChange(type: any) {
      if (type === 'jsonplayer') {
        if (this.player) {
          this.player.pause()
        }
        this.status = ''
      } else if (type === 'dplayer') {
        this.switchVideo()
      }
      this.updateRoute()
    },

    switchEpisode(episode: Episode) {
      this.currentEpisodeId = episode._id
      this.currentResourceId = episode.resources.length
        ? episode.resources[0]._id || ''
        : ''
      this.updateRoute()
      this.switchVideo()
    },

    switchVideo() {
      this.$nextTick(() => {
        this.config.url = this.currentResource._id
          ? this.currentResource.url
          : ''
        this.status = this.currentResource._id ? '' : 'NOT_FOUND'
        if (this.config.playerType === 'dplayer') {
          if (this.player) {
            // @ts-ignore
            this.player.switchVideo({ url: this.config.url })
          }
        } else {
          this.status = ''
        }
      })
    },

    async fetchVideoInfo() {
      if (this.id) {
        this.videoInfo = await this.$API.Bangumi.showBangumi(this.id, {
          mode: 'simple',
          fields:
            'title,titleOriginal,coverMin,tags,status,episodes,type,ratingSite,desc,onair'
        })
      }
    },

    async fetchEpisodes() {
      if (this.id) {
        this.episodeInfo = await this.$API.Episode.showEpisodeInfo(this.id, {
          withResources: true
        })
        this.episodeInfo.episodeList.forEach((episode) => {
          episode.airDate = new Date(episode.airDate)
          if (!episode.resources) episode.resources = []
        })
        if (!this.currentEpisodeId && this.episodeInfo.episodeList.length) {
          this.switchEpisode(this.episodeInfo.episodeList[0])
        }

        this.switchVideo()
      }
    },

    fetchComments({ index, size }: { index: number; size: number }) {
      return this.$API.Episode.listOneEpisodeMessage(
        this.currentEpisodeId,
        'comments',
        index,
        size
      )
    },

    saveComment(comment: BaseComment) {
      return this.$API.Episode.saveComment(this.currentEpisodeId, comment)
    },

    deleteComment(comment: BaseComment) {
      return this.$API.Episode.delComment(this.currentEpisodeId, comment._id!)
    }
  }
})
</script>

<style lang="scss">
.video-watch {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100%;
  min-height: 484px;
  min-width: 1200px;

  &,
  * {
    box-sizing: border-box;
  }

  &.only-player {
    .watch-aside {
      display: none;
    }
  }

  .watch-main {
    flex: 1 0 auto;
    width: 0;
    height: 100%;
    min-height: 400px;
    background-color: var(--color-bg-2);
  }

  .watch-player-wrap {
    position: relative;
    height: calc(100% - 48px);

    .not-found-resource,
    .loading-resource {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      z-index: 200;
      background-color: #000;
    }

    .watch-player {
      height: 100%;
    }
  }

  .watch-player-footer {
    padding: 0 16px;
    box-sizing: border-box;
    height: 48px;
  }

  .watch-aside {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    width: 400px;
    margin: 18px 20px;
    overflow: hidden;
  }

  .info-header {
    flex-shrink: 0;
    display: flex;
    margin-bottom: 12px;

    .video-cover {
      flex: 0 0 100px;
      border-radius: 8px;
      overflow: hidden;
    }

    .video-info {
      flex: 1 0 auto;
      width: 0;
      margin-left: 12px;
    }

    .video-title {
      font-size: 24px;
      margin-bottom: 6px;
    }

    .video-tags {
      margin-bottom: 4px;
    }

    .video-onair {
    }
  }

  .video-desc {
    font-size: 16px;
    padding: 0 8px;
  }

  .episodes-grid {
    padding: 0 4px;

    .episode-btn {
      width: 100%;
      padding: 0;
    }
  }
}

@media (max-width: 1280px) {
  .video-watch {
    .watch-aside {
      width: 340px;
    }
  }
}

@media (min-width: 992px) {
  .video-watch {
    .watch-aside {
      .arco-tabs {
        flex-grow: 1;
        height: 0;
        display: flex;
        flex-direction: column;
      }

      .arco-tabs-content {
        height: 100%;

        .arco-tabs-content-list {
          height: 100%;
        }

        .arco-tabs-pane {
          height: 100%;
          overflow-y: scroll;
          padding-left: 6px;

          &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          &::-webkit-scrollbar-thumb {
            background: var(--color-fill-4);
          }

          &::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover-bg);
          }

          &:vertical {
            margin-top: 100px;
          }
        }
      }
    }
  }
}

@media (max-width: 991.9px) {
  .video-watch {
    padding: 0;
    flex-direction: column;
    min-width: 100%;

    .watch-main {
      width: 100%;
      height: 56.25vw;
      min-height: initial;
      position: initial;
      top: initial;
    }

    .watch-aside {
      width: 100%;
      margin-top: 24px;
      margin-left: 0;
      flex-basis: auto;
      padding: 0;
    }

    .info-header {
      padding: 0 12px;
    }

    .watch-tabs .arco-tabs-content {
      padding: 16px 18px;
    }
  }
}
</style>
