<template>
  <a-modal
    v-model:visible="mVisiable"
    modal-class="detail-rating-dialog"
    width="calc(100% - 24px)"
    simple
    :ok-text="isReviewed ? '修改' : '发表'"
    :on-before-ok="handleBeforeOk"
    :ok-button-props="{ disabled: !mScore }"
    :modal-style="{ padding: '24px' }"
    :footer="!isReviewed || isEditing"
    @before-open="handleBeforeOpen"
    @close="handleClose"
  >
    <template v-if="isReviewed && !isEditing">
      <div class="info reviewed">
        <acg-ratio-div :ratio="[3, 4]" class="info-l">
          <img
            :src="
              compressImage(bangumi.coverMin, { w: 100, h: 133, ext: 'png' })
            "
            referrerpolicy="no-referrer"
          />
        </acg-ratio-div>

        <div class="info-r">
          <h5 class="media-title multi-text-truncate" data-line="2">
            {{ bangumi.title }}
          </h5>
          <a-space class="score">
            <span class="text-color-2"
              >我的评分：<span class="score-text">{{
                review.score
              }}</span></span
            >
            <span class="score-text">{{ rateText }}</span>
            <a-button type="text" @click="isEditing = true" size="small"
              ><template #icon><icon-edit /></template
            ></a-button>
          </a-space>
          <div class="content">{{ review.content }}</div>
        </div>
      </div>

      <a-collapse :default-active-key="['1']" :bordered="false">
        <a-collapse-item header="评分细化" key="1">
          <a-grid
            direction="vertical"
            class="scores"
            :cols="2"
            :colGap="5"
            :rowGap="4"
          >
            <a-grid-item
              v-for="(value, key) of review.items"
              :key="key"
              class="score-item"
            >
              <label>
                {{ itemNames[key] }}
                <span v-if="review.items[key]" class="score-item-text">{{
                  value
                }}</span>
              </label>
              <div>
                <a-rate
                  :model-value="review.items[key] / 2"
                  allow-half
                  :disabled="true"
                ></a-rate>
              </div>
            </a-grid-item>
          </a-grid>
        </a-collapse-item>
      </a-collapse>
    </template>
    <template v-else>
      <div class="info">
        <acg-ratio-div :ratio="[3, 4]" class="info-l">
          <img
            :src="
              compressImage(bangumi.coverMin, { w: 100, h: 133, ext: 'png' })
            "
            referrerpolicy="no-referrer"
          />
        </acg-ratio-div>

        <div class="info-r">
          <p style="margin-bottom: 2px">请发表你对这部作品的评分</p>
          <h5 class="media-title multi-text-truncate" data-line="2">
            {{ bangumi.title }}
          </h5>
          <a-space class="total-score">
            <a-rate
              v-model="mScore"
              allow-half
              @hover-change="rateHoverChange"
            ></a-rate>
            <span class="score-text">{{ rateText }}</span>
          </a-space>
        </div>
      </div>

      <a-textarea
        v-model="myReview.content"
        show-word-limit
        :max-length="140"
        :auto-size="{ minRows: 4 }"
      >
      </a-textarea>

      <a-card class="info-extra" :body-style="{ padding: '8px' }">
        <a-grid
          direction="vertical"
          class="scores"
          :cols="2"
          :col-gap="5"
          :row-gap="4"
        >
          <a-grid-item :span="2"><b>评分细化(选填)</b></a-grid-item>
          <a-grid-item
            v-for="(value, key) of reviewItems"
            :key="key"
            class="score-item"
          >
            <label>
              {{ itemNames[key] }}
              <span v-if="reviewItems[key]" class="score-item-text">{{
                value
              }}</span>
            </label>
            <div>
              <a-rate
                :model-value="reviewItems[key] / 2"
                allow-half
                @change="handleItemRateChange(key, $event)"
              ></a-rate>
              <icon-close-circle-fill
                v-if="reviewItems[key]"
                class="score-clear"
                @click="reviewItems[key] = 0"
              />
            </div>
          </a-grid-item>
        </a-grid>
      </a-card>
    </template>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { fetchReview } from '../utilities/store'
import detailMixin from '../utilities/mixin'
const rateTextList = [
  '',
  '不忍直视',
  '很差',
  '差',
  '较差',
  '好坏参半',
  '中规中矩',
  '推荐',
  '力荐',
  '神作',
  '超神'
]

export default defineComponent({
  name: 'DetailRatingDialog',

  emits: ['update:modelValue'],

  mixins: [detailMixin],

  props: {
    modelValue: Boolean,
    review: {
      type: Object as PropType<MediaReview>,
      default: () => ({})
    }
  },

  data() {
    return {
      isLoading: false,
      isError: false,
      isEditing: false,
      myReview: {
        score: 0,
        content: '',
        items: { art: 0, sound: 0, story: 0, characters: 0 }
      } as MediaReview,
      itemNames: {
        art: '制作',
        sound: '音乐',
        story: '剧情',
        characters: '角色'
      },
      rateHoverScore: 0
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
    },

    isReviewed() {
      return !!this.myReview._id
    },

    mScore: {
      get() {
        return this.myReview.score / 2
      },
      set(score: number) {
        this.myReview.score = score * 2
      }
    },

    reviewItems() {
      return this.myReview.items
    },

    rateText() {
      return rateTextList[this.rateHoverScore * 2 || this.myReview.score]
    }
  },

  methods: {
    rateHoverChange(v: number) {
      this.rateHoverScore = v
    },

    handleBeforeOpen() {
      this.myReview = JSON.parse(JSON.stringify(this.review))
    },

    handleClose() {
      this.isEditing = false
    },

    handleItemRateChange(key: string, value: number) {
      this.myReview.items[key as keyof MediaReviewItems] = value * 2
    },

    async handleBeforeOk(done: (done: boolean) => void) {
      try {
        if (this.isReviewed) {
          const result = await this.$API.Review.update(this.myReview)
          this.$message.success('评分修改成功')
        } else {
          const result = await this.$API.Review.save(
            this.bangumi._id,
            this.myReview
          )
          this.$message.success('评分成功')
        }
        fetchReview(this.bangumi._id, true)
        done(true)
      } catch (error) {
        done(false)
      }
    }
  }
})
</script>

<style lang="scss">
.detail-rating-dialog {
  max-width: 600px;
  box-sizing: border-box;

  .arco-modal-header {
    display: none;
  }

  .info {
    display: flex;
    margin-bottom: 8px;

    &.reviewed {
      .info-r {
        .score {
          font-size: 12px;
        }

        .content {
          font-size: 13px;
        }
      }
    }

    .info-l {
      display: inline-block;
      flex: 0 0 auto;
      width: 80px;
    }

    .info-r {
      flex: 1 0 auto;
      margin-left: 12px;
      width: 0;

      position: relative;
    }

    .media-title {
      margin-bottom: 4px;
      line-height: 1.2;
    }

    .total-score {
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }

  .score-text {
    font-size: 12px;
    font-weight: bold;
    color: #f9cc44;
  }

  .score-item-text {
    display: inline-block;
    font-weight: bold;
    color: #f9cc44;
    vertical-align: bottom;
    margin-left: 8px;
  }

  .info-extra {
    margin-top: 8px;
  }

  .scores {
    font-size: 12px;
    width: 100%;

    .score-item {
      .arco-rate {
        font-size: 22px;
      }

      label {
        display: block;
        opacity: 0.8;
      }

      .score-clear {
        cursor: pointer;
        margin-left: 8px;
        font-size: 16px;
        vertical-align: baseline;
      }
    }
  }
}

@media (max-width: 575.9px) {
  .detail-rating-dialog {
    .score-item {
      .arco-rate {
        font-size: 20px !important;
      }

      .arco-rate-character:not(:last-child) {
        margin-right: 4px;
      }

      // display: flex;
      // align-items: center;

      // label {
      //   margin-right: 6px;
      // }
    }
  }
}
</style>
