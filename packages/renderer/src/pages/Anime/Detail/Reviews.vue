<template>
  <div class="detail-stats">
    <a-row class="grid-distribution" :gutter="{ md: 8 }">
      <a-col :xs="24" :sm="24" :xl="12">
        <media-status-distribution></media-status-distribution>
      </a-col>
      <a-col :xs="24" :sm="24" :xl="12">
        <media-score-distribution></media-score-distribution>
      </a-col>
    </a-row>

    <info-group class="review-list" title="评分列表">
      <template #header-append>
        <a-button
          v-if="page.total"
          size="mini"
          type="outline"
          :loading="reviewLoading"
          @click="handleToRating"
          >{{ reviewBtnText }}</a-button
        >
      </template>

      <acg-api-result
        :loading="isLoading"
        :error="isError"
        :empty="!page.total"
        empty-text="现在还没有人评论哦~"
        @retry="loadData"
      >
        <template #extra>
          <a-button
            v-if="!isLoading && !isError && !page.total"
            type="primary"
            @click="handleToRating"
          >
            {{ reviewBtnText }}
          </a-button>
        </template>
      </acg-api-result>

      <a-card v-for="review of reviewList" :key="review._id" :bordered="false">
        <comment
          show-rate
          :score="review.score"
          :author="review.user!.nickname"
          :content="review.content"
          :datetime="review.createTime"
          :avatar="review.user.avatar"
          :userid="review.user._id"
        ></comment>
      </a-card>

      <div class="page-pagination">
        <a-pagination
          v-model:current="page.index"
          v-model:page-size="page.size"
          :total="page.total"
          show-total
          simple
          size="small"
          @change="loadData"
        ></a-pagination>
      </div>
    </info-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MediaStatusDistribution from './components/MediaStatusDistribution.vue'
import MediaScoreDistribution from './components/MediaScoreDistribution.vue'
import InfoGroup from './components/InfoGroup.vue'
import Comment from '/@/components/AcgComment.vue'
import detailStore, { handleToRating } from './utilities/store'

export default defineComponent({
  name: 'AnimeDetailReviews',

  components: {
    MediaStatusDistribution,
    MediaScoreDistribution,
    InfoGroup,
    Comment
  },

  data() {
    return {
      isLoading: false,
      isError: false,
      reviewList: [] as MediaReview[],
      page: { index: 1, size: 20, total: 0 } as Common.PageWithTotal
    }
  },

  computed: {
    reviewBtnText() {
      return detailStore.review._id ? '我的点评' : '我要点评'
    },

    reviewLoading() {
      return detailStore.isRatingLoading
    },

    isRatingModified() {
      return detailStore.isRatingModified
    }
  },

  methods: {
    async loadData() {
      this.isLoading = true
      this.isError = false
      const bid = this.$route.params.id as string
      try {
        const { list, total } = await this.$API.Review.index(
          bid,
          this.page.index,
          this.page.size
        )
        list.forEach((item) => {
          item.createTime = this.formatDateTime(item.createTime!)
        })
        this.reviewList = list
        this.page.total = total
      } catch (error) {
        this.isError = true
      }
      this.isLoading = false
    },
    handleToRating
  },

  watch: {
    isRatingModified(val: boolean) {
      console.log('isRatingModified', val)
      if (val) {
        this.loadData()
        detailStore.isRatingModified = false
      }
    }
  },

  created() {
    this.loadData()
  }
})
</script>

<style lang="scss">
.detail-stats {
  .review-list {
    margin-top: 20px;

    .arco-card + .arco-card {
      margin-top: 8px;
    }

    .rate {
      margin-left: 4px;
      min-height: 16px;
      font-size: 16px;
      vertical-align: text-bottom;

      .arco-rate-character {
        margin-right: 0;
      }
    }
  }
}
</style>
