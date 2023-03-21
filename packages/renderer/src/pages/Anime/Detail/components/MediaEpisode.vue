<template>
  <info-group
    v-if="episodeInfo.episodeList.length"
    class="media-episode"
    title="剧集列表"
  >
    <a-space wrap>
      <a-popover
        v-for="episode of episodeInfo.episodeList"
        :key="episode._id"
        :content-style="{ padding: 0 }"
        class="media-episode-popover"
        content-class="media-episode-popover"
      >
        <a-button
          size="small"
          :type="episode.airDate < now ? 'primary' : 'secondary'"
          :status="getEpBtnType(episode.airDate)"
          @click="showOneEpDialog('base', episode)"
        >
          <template #icon>{{ episode.ep }}</template>
        </a-button>
        <template #title>
          <div class="pop-title">EP.{{ episode.ep }} {{ episode.title }}</div>
        </template>
        <template #content>
          <div class="pop-content">
            <div class="info">
              <p v-show="episode.oTitle" class="info-item">
                <span class="text-color-2">原标题：</span>
                <span class="text-color-1">{{ episode.oTitle }}</span>
              </p>
              <p v-show="episode.airDate">
                <span class="text-color-2">播出时间：</span>
                <span class="text-color-1">{{
                  formatDateTime(episode.airDate, 'YYYY-MM-DD')
                }}</span>
              </p>
            </div>
            <p class="footer">
              <a-link
                class="comment"
                @click="showOneEpDialog('comments', episode)"
              >
                <icon-message />
                <span style="margin-left: 4px">讨论</span>
                <span class="count">({{ episode.state.comment }})</span>
              </a-link>
              <a-link
                class="rating"
                :title="
                  episode.state.score
                    ? `${episode.state.review}人参与评分，当前集数平均分为${episode.state.score}分`
                    : ''
                "
                @click="showOneEpDialog('reviews', episode)"
              >
                <icon-star-fill />
                <span style="margin-left: 4px"
                  >{{ episode.state.score || '暂无评' }}分</span
                >
              </a-link>
            </p>
          </div>
        </template>
      </a-popover>
    </a-space>

    <media-episode-dialog
      v-model="epDialog.isDisplay"
      :type="epDialog.type"
      :episode-id="epDialog.episodeId"
    >
    </media-episode-dialog>
  </info-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InfoGroup from './InfoGroup.vue'
import MediaEpisodeDialog from './MediaEpisodeDialog.vue'
import { fetchEpisodeInfo } from '../utilities/cache'

export default defineComponent({
  name: 'MediaEpisode',

  components: { InfoGroup, MediaEpisodeDialog },

  data() {
    return {
      now: new Date(),
      loading: false,
      isMobile: false,
      epDialog: {
        isDisplay: false,
        type: 'comment',
        episodeId: ''
      },
      episodeInfo: {
        totalCount: 0,
        episodeList: []
      } as EpisodesInfo
    }
  },

  created() {
    this.fetchMediaEpisode()
    this.isMobile = document.documentElement.classList.contains('mobile')
  },

  methods: {
    getEpBtnType(
      date: string | Date
    ): 'success' | 'normal' | 'warning' | 'danger' | undefined {
      const diff = this.$dayjs(date).diff(this.now, 'h')
      if (diff > 0 && diff < 12) return 'success'
      return 'normal'
    },

    async fetchMediaEpisode() {
      this.loading = true
      const bid = this.$route.params.id as string
      const info = await fetchEpisodeInfo(bid)
      this.episodeInfo = info
      this.loading = false
    },

    showOneEpDialog(type: 'base' | 'comments' | 'reviews', item: Episode) {
      if (type === 'base') {
        if (this.isMobile) return
        type = 'comments'
      }
      this.epDialog.episodeId = item._id
      this.epDialog.type = type
      this.epDialog.isDisplay = true
    }
  }
})
</script>

<style lang="scss">
.media-episode-popover {
  &[trigger-placement='bottom'] {
    .arco-popover-popup-arrow {
      background-color: var(--app-color-common);
    }
  }

  .pop-title {
    font-weight: bold;
    padding: 4px;
    font-size: 14px;
    background-color: var(--app-color-common);
    color: #ffffff;
  }

  .pop-content {
    min-width: 240px;
    font-size: 12px;

    .info {
      padding: 8px 6px;
      padding-top: 2px;
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--color-fill-3);
      padding: 2px 4px;
    }

    .comment,
    .rating {
      font-size: 12px;
    }
  }
}
</style>
