<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue'
import $global from '/@/global/index'
import $API from '/@/apis/index'
import Comment from '/@/components/AcgComment.vue'

const props = defineProps({
  episodeId: { type: String, default: '' }
})

const myReview = reactive({
  isEdit: false,
  isSaving: false,
  bak: {} as EpisodeReview,
  data: {} as EpisodeReview
})
const isReviewed = computed(() => {
  return !!myReview.data._id
})
const myScore = computed({
  get() {
    return myReview.data.score / 2
  },
  set(score: number) {
    myReview.data.score = score * 2
  }
})

const reviews = reactive({
  isLoading: false,
  isError: false,
  list: [] as EpisodeReview[],
  page: { index: 1, size: 20, total: 0 }
})

function formatDateTime(date: string | Date, formater = 'YYYY-MM-DD HH:mm') {
  return window.$dayjs(date).format(formater)
}

function toEdit() {
  if (!$global.user.isLogined) {
    $global.user.isDisplayLoginDialog = true
    return
  }
  myReview.bak = Object.assign({}, myReview.data)
  myReview.isEdit = true
}

function cancelEdit() {
  if (isReviewed.value) {
    myReview.data = Object.assign({}, myReview.bak)
  }
  myReview.isEdit = false
}

async function fetchReviews() {
  reviews.isLoading = true
  reviews.isError = false
  try {
    const { list, total } = await $API.Episode.listOneEpisodeMessage(
      props.episodeId,
      'reviews',
      reviews.page.index,
      reviews.page.size
    )
    list.forEach((item) => {
      item.relativeTime = window.$dayjs().to(window.$dayjs(item.date))
      item.date = formatDateTime(item.date)
    })
    reviews.list = list
    reviews.page.total = total
  } catch (error) {
    reviews.isError = true
  }
  reviews.isLoading = false
}

async function fetchMyReview() {
  try {
    const review = await $API.Episode.showMyReview(props.episodeId)
    review.relativeTime = window.$dayjs().to(window.$dayjs(review.date))
    review.date = formatDateTime(review.date)
    myReview.data = review
  } catch (error) {}
}

async function saveMyReview() {
  myReview.isSaving = true
  try {
    const result = await $API.Episode.saveMyReview(
      props.episodeId,
      myReview.data
    )
    myReview.isEdit = false
    fetchMyReview()
    reviews.page.index = 1
    fetchReviews()
  } catch (error) {}
  myReview.isSaving = false
}

onMounted(() => {
  fetchMyReview()
  reviews.page.index = 1
  fetchReviews()
})
</script>

<template>
  <div class="episode-reviews">
    <div class="my-review">
      <div v-if="!myReview.isEdit" style="margin-bottom: 8px">
        <a-button v-if="!myReview.data._id" long @click="toEdit"
          >我要评分</a-button
        >
        <a-card v-else>
          <div class="my-review-inner">
            <comment
              show-rate
              :score="myReview.data.score"
              :author="myReview.data.user.nickname"
              :content="myReview.data.content"
              :datetime="myReview.data.date"
              :avatar="myReview.data.user.avatar"
            >
            </comment>
            <a-button class="btn-review-modify" @click="toEdit">修改</a-button>
          </div>
        </a-card>
      </div>
      <a-card v-else :bordered="false" class="review-card">
        <header class="review-editor-header">
          <h5>单集评分</h5>
          <a-rate v-model="myScore" allow-half></a-rate>
        </header>
        <a-textarea
          v-model="myReview.data.content"
          show-word-limit
          :auto-size="{ minRows: 3, maxRows: 8 }"
          :max-length="140"
        >
        </a-textarea>
        <a-space fill style="justify-content: flex-end">
          <a-button :disabled="myReview.isSaving" @click="cancelEdit"
            >放弃</a-button
          >
          <a-button
            :loading="myReview.isSaving"
            :disabled="!myReview.data.score"
            type="primary"
            @click="saveMyReview"
          >
            {{ isReviewed ? '修改' : '发表' }}</a-button
          >
        </a-space>
      </a-card>
    </div>

    <div class="review-list">
      <comment
        v-for="review of reviews.list"
        :key="review._id"
        show-rate
        :score="review.score"
        :author="review.user.nickname"
        :content="review.content"
        :datetime="review.date"
        :avatar="review.user.avatar"
        :userid="review.user._id"
      ></comment>
    </div>
    <div class="page-pagination">
      <a-pagination
        v-model:current="reviews.page.index"
        v-model:page-size="reviews.page.size"
        :total="reviews.page.total"
        show-total
        simple
        size="small"
        @change="fetchReviews"
      ></a-pagination>
    </div>
  </div>
</template>

<style lang="scss">
.episode-reviews {
  .my-review {
    margin-bottom: 24px;

    .review-editor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .my-review-inner {
      display: flex;
      align-items: center;

      .acg-comment {
        flex-grow: 1;
      }

      .btn-review-modify {
        flex-shrink: 0;
      }
    }
  }

  .review-list {
    padding: 0 16px;
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
</style>
