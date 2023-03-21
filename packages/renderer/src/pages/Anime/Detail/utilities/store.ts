import { reactive, nextTick } from 'vue'
import $API from '/@/apis'
import $global from '/@/global'

const store = reactive({
  isDisplayRatingDialog: false,
  isRatingLoading: true,
  isRatingModified: false,
  review: {
    score: 0,
    content: '',
    items: { art: 0, sound: 0, story: 0, characters: 0 }
  } as MediaReview
})

export default store

export async function fetchReview(bid: string, isModified = false) {
  if (!$global.user.isLogined) {
    store.isRatingLoading = false
    return
  }
  store.isRatingLoading = true
  const result = await $API.Review.show(bid)
  if (result.code !== -1) {
    store.review = result
  }
  if (isModified) {
    store.isRatingModified = false
    nextTick(() => {
      store.isRatingModified = true
    })
  }
  store.isRatingLoading = false
}

export function handleToRating() {
  if (!$global.user.isLogined) {
    $global.user.isDisplayLoginDialog = true
    return
  }

  store.isDisplayRatingDialog = true
}
