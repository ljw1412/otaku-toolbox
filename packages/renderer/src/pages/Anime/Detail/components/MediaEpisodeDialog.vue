<template>
  <a-modal
    v-model:visible="mVisiable"
    modal-class="media-episode-dialog"
    width="calc(100% - 24px)"
    title-align="start"
    :closable="false"
    :mask-closable="false"
    :modal-style="{ maxHeight: 'calc(100% - 36px)' }"
    :body-style="{
      padding: '0 20px 24px 20px',
      marginLeft: 'var(--scroll-bar-width)',
      maxHeight: 'calc(100% - 24px)',
      boxSizing: 'border-box',
      overflowY: 'scroll'
    }"
    :footer="false"
    :render-to-body="false"
    @close="handleAfterClose"
    unmount-on-close
  >
    <template #title>
      <div
        class="episode-title"
        style="width: 100%; margin-left: var(--scroll-bar-width)"
      >
        <div class="ep">
          <a-skeleton v-if="isInfoLoading" animation style="width: 28px">
            <a-skeleton-line :rows="1" :line-height="14" />
          </a-skeleton>
          <span v-else>EP.{{ episode.ep }}</span>
        </div>
        <a-divider direction="vertical" />
        <a-skeleton v-if="isInfoLoading" animation style="width: 100%">
          <a-space direction="vertical" style="width: 100%" size="mini">
            <a-skeleton-line :rows="1" :line-height="20" :widths="['50%']" />
            <a-skeleton-line :rows="1" :line-height="12" :widths="['30%']" />
          </a-space>
        </a-skeleton>
        <div v-else class="titles">
          <h3 class="title multi-text-truncate" data-line="2">
            {{ episode.title || episode.oTitle }}
          </h3>
          <i
            v-if="episode.oTitle && episode.title"
            class="o-title text-truncate"
            >{{ episode.oTitle }}</i
          >
        </div>
      </div>
      <div v-if="episode.state" v-show="!isMobileSize" class="rating">
        <div class="score">{{ episode.state.score }}分</div>
        <div class="review-count">{{ episode.state.review }} 人评</div>
      </div>

      <div class="btn-close" @click="mVisiable = false">
        <icon-close />
      </div>
    </template>

    <div class="episode-info">
      <a-skeleton animation :loading="isInfoLoading">
        <a-space direction="vertical" style="width: 100%" size="mini">
          <a-skeleton-line :rows="1" :line-height="16" :widths="['40%']" />
          <a-skeleton-line :rows="1" :line-height="128" />
        </a-space>
      </a-skeleton>
      <template v-if="!isInfoLoading">
        <p v-show="episode.airDate" class="air-date">
          <span class="text-color-3">播出时间：</span>
          <span class="text-color-2">{{
            formatDateTime(episode.airDate, 'YYYY-MM-DD')
          }}</span>
        </p>
        <p v-if="episode.state" v-show="isMobileSize" class="line-rating">
          <span class="text-color-3">本话评分：</span>
          <span class="score text-color-common"
            >{{ episode.state.score }}分</span
          >
          <span class="review-count text-color-2"
            >（{{ episode.state.review }}人评）</span
          >
        </p>
        <p class="desc">{{ episode.desc }}</p>
      </template>
    </div>

    <a-tabs v-model:active-key="tab" lazy-load>
      <a-tab-pane
        key="comments"
        :title="
          '讨论' +
          (episode.state && episode.state.comment
            ? `(${episode.state.comment})`
            : '')
        "
      >
        <app-comments
          :fetch-comments="fetchComments"
          :reply="saveComment"
          :delete="deleteComment"
        ></app-comments>
      </a-tab-pane>

      <a-tab-pane
        key="reviews"
        :title="
          '评分' +
          (episode.state && episode.state.review
            ? `(${episode.state.review})`
            : '')
        "
      >
        <episode-reviews :episode-id="episodeId"></episode-reviews>
      </a-tab-pane>

      <a-tab-pane
        v-if="isSecretMode && episode.resources && episode.resources.length"
        key="resources"
        :title="`在线观看(${episode.resources.length})`"
      >
        <a-space wrap>
          <router-link
            v-for="item of episode.resources"
            :key="item._id"
            :to="{
              name: 'VideoWatch',
              params: { id: $route.params.id },
              query: { ep: episodeId, route: item._id }
            }"
            target="_blank"
          >
            <a-button> {{ item.from }}线路</a-button>
          </router-link>
        </a-space>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { fetchOneEpisode } from '../utilities/cache'
import EpisodeReviews from './EpisodeReviews.vue'
import AppComments from '/@/components/AppComments.vue'

export default defineComponent({
  name: 'EpisodeDialog',

  components: {
    AppComments,
    EpisodeReviews
  },

  emits: ['update:modelValue'],

  props: {
    modelValue: Boolean,
    type: { type: String, default: 'comments' },
    episodeId: { type: String, default: '' }
  },

  data() {
    return {
      isInfoLoading: false,
      isInfoError: false,
      episode: {} as Episode,
      tab: 'comments'
    }
  },

  computed: {
    mVisiable: {
      get() {
        return this.modelValue
      },
      set(val: boolean) {
        this.$emit('update:modelValue', val)
      }
    }
  },

  methods: {
    async loadEpisodeInfo() {
      if (!this.episodeId) return
      this.isInfoError = false
      this.isInfoLoading = true
      try {
        const info = await fetchOneEpisode(this.episodeId)
        this.episode = info
      } catch (error) {
        this.isInfoError = true
      }
      this.isInfoLoading = false
    },

    fetchComments({ index, size }: { index: number; size: number }) {
      return this.$API.Episode.listOneEpisodeMessage(
        this.episodeId,
        'comments',
        index,
        size
      )
    },

    saveComment(comment: BaseComment) {
      return this.$API.Episode.saveComment(this.episodeId, comment)
    },

    deleteComment(comment: BaseComment) {
      return this.$API.Episode.delComment(this.episodeId, comment._id!)
    },

    handleAfterClose() {
      this.episode = {} as Episode
    }
  },

  watch: {
    mVisiable(visiable: boolean) {
      if (visiable) {
        this.tab = this.type || 'comments'
        this.loadEpisodeInfo()
      }
    }
  }
})
</script>

<style lang="scss">
.arco-modal.media-episode-dialog {
  box-sizing: border-box;
  max-width: 740px;
  display: inline-flex;
  flex-direction: column;

  .arco-modal-header {
    position: relative;
    flex-shrink: 0;
    height: 64px;
    border: none;
    background-color: var(--app-color-common);
    border-radius: var(--border-radius-medium);

    .rating {
      position: absolute;
      right: 68px;
      top: 50%;
      transform: translateY(-50%);
      line-height: 1.2;
      text-align: center;
      color: #ffffff;

      .score {
        font-size: 22px;
        border-bottom: 1px solid currentColor;
      }

      .review-count {
        font-size: 14px;
        opacity: 0.75;
      }
    }

    .btn-close {
      position: absolute;
      right: 8px;
      top: 8px;
      display: flex;
      width: 48px;
      height: 48px;
      background-color: rgb(var(--red-5));
      border-radius: var(--border-radius-medium);
      font-size: 28px;
      color: #ffffff;
      z-index: 1;
      cursor: pointer;

      .arco-icon-close {
        margin: auto;
      }

      &:hover {
        background-color: rgb(var(--red-6));
      }

      &:active {
        background-color: rgb(var(--red-4));
      }
    }
  }

  .episode-title {
    display: flex;
    align-items: center;
    line-height: 1.2;
    color: #ffffff;

    .ep {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      height: 30px;
      font-weight: bold;
      font-size: 13px;
      line-height: 14px;
    }

    .titles {
      width: 0;
      flex-grow: 1;
      margin-right: 44px;
    }

    .title {
      font-size: 16px;
    }

    .o-title {
      display: inline-block;
      width: 100%;
      font-size: 12px;
    }

    .arco-divider {
      border-color: #ffffff;
    }
  }

  .episode-info {
    margin-top: 4px;
  }

  .air-date {
    font-size: 13px;
    margin-bottom: 4px;
  }

  .desc {
    font-size: 12px;
    white-space: pre-line;
    font-family: inherit;
  }

  .arco-tabs,
  .arco-tabs-nav {
    overflow: iniratetial;
  }

  .arco-tabs-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--color-bg-3);
  }

  .arco-avatar-image img {
    object-fit: cover;
  }
}
</style>
