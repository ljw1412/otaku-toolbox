<template>
  <div class="detail-header-wrap">
    <div class="banner">
      <transition name="fade">
        <img
          v-show="cover"
          class="bg"
          :class="{ blur: !isMobileSize }"
          :src="cover"
          :key="cover"
          referrerpolicy="no-referrer"
        />
      </transition>
      <div v-show="!isMobileSize" class="mask"></div>
    </div>

    <div class="header">
      <div class="container">
        <div class="cover-wrap">
          <acg-gallery
            mini
            :images="bangumi.cover"
            :default-image="bangumi.coverMin"
            @image-change="handleImageChange"
          >
          </acg-gallery>
          <div class="action">
            <a-dropdown-button
              class="btn-add-list"
              size="large"
              type="dashed"
              :button-props="{
                style: { 'flex-grow': 1 },
                status: favouriteBtnStatus,
                disabled: favourite.status !== -99
              }"
              @click="saveFavouriteState()"
              @select="saveFavouriteState"
            >
              {{ favouriteStatusStr }}
              <template #icon>
                <icon-down />
              </template>
              <template #content>
                <a-doption
                  v-for="item of statusOptionList"
                  :key="item.status"
                  :value="item.status"
                  :disabled="favourite.status === item.status"
                >
                  <span>标记为</span>
                  <span
                    :style="{
                      color: item.color,
                      opacity:
                        favourite.status === item.status ? 0.5 : undefined
                    }"
                    >{{ item.name }}</span
                  >
                </a-doption>
              </template>
            </a-dropdown-button>
          </div>
        </div>

        <div class="content">
          <div class="meta">
            <h2 class="title">{{ bangumi.title }}</h2>
            <h5 class="original-title text-color-2">
              {{ bangumi.titleOriginal }}
            </h5>
            <a-space
              class="tags"
              style="display: flex; min-height: 24px"
              size="mini"
              wrap
            >
              <a-tag
                v-if="bangumi.status !== undefined"
                size="small"
                :color="getStatusTagColor(bangumi.status)"
                >{{ bangumi.statusCH }}</a-tag
              >
              <a-tag
                v-for="tag of bangumi.tags"
                size="small"
                :color="tag.color"
                :key="tag._id"
                >{{ tag.name }}</a-tag
              >
            </a-space>
          </div>
          <div v-if="!reviewLoading" class="rating" @click="handleToRating">
            <div class="score" title="暂无评分">
              {{ ratingInfo.score }}
            </div>
            <div class="tips">{{ ratingInfo.tips }}</div>
            <div class="to-review-btn"><icon-edit />我要点评</div>
          </div>
          <p
            v-show="!isMobileSize"
            class="description"
            v-html="bangumi.desc"
          ></p>
          <div class="nav">
            <router-link
              v-for="navItem of navigations"
              :key="navItem.title"
              :to="navItem.to"
              class="link"
              >{{ navItem.title }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import detailMixin from '../utilities/mixin'
import detailStore, { handleToRating } from '../utilities/store'
import FAVOURITE_STATUS from '/@/constants/favourite-status.json'

const STATUS_COLOR_MAP: Record<number, string> = {
  0: 'orange',
  1: 'green',
  2: 'red'
}

export default defineComponent({
  name: 'AnimeDetailHeader',

  mixins: [detailMixin],

  data() {
    return {
      navigations: [
        { title: '概览', to: { name: 'DetailOverview' } },
        { title: '角色', to: { name: 'DetailCharacters' } },
        { title: '制作人员', to: { name: 'DetailStaff' } },
        { title: '评分', to: { name: 'DetailReviews' } },
        { title: '讨论', to: { name: 'DetailSocial' } }
      ],
      statusOptionList: ['0', '1', '2', '-1', '-2'].map((status) => {
        return FAVOURITE_STATUS[status as '0' | '1' | '2' | '-1' | '-2']
      }),
      favourite: {
        status: -99
      },
      minTime: 10,
      cover: ''
    }
  },

  computed: {
    reviewLoading() {
      return detailStore.isRatingLoading
    },

    currentStatus() {
      const status = this.statusOptionList.find(
        (item) => item.status === this.favourite.status
      )
      return status || { text: '追 番', btnStatus: 'normal' }
    },

    favouriteStatusStr() {
      return this.currentStatus.text
    },

    favouriteBtnStatus() {
      return this.currentStatus.btnStatus
    },

    rating() {
      return this.bangumi.rating || { score: 0, count: 0 }
    },

    ratingInfo() {
      const hidden = this.minTime > this.rating.count || !this.bangumi._id
      return {
        score: hidden ? 'X.X' : this.rating.score.toFixed(1),
        tips: hidden ? '评分量不足' : `${this.rating.count}人评`
      }
    }
  },

  watch: {
    bangumi: {
      immediate: true,
      handler(val: FormatedBangumiBasic) {
        if (val._id) {
          this.cover = val.coverMin
          if (this.$global.user.isLogined) {
            this.fetchFavourite()
          }
        }
      }
    }
  },

  methods: {
    handleImageChange(image: string) {
      this.cover = image
    },

    getStatusTagColor(status: number) {
      return STATUS_COLOR_MAP[status]
    },

    async fetchFavourite() {
      try {
        const { status = -99 } = await this.$API.Favourite.showFavouriteStatus(
          this.bangumi._id
        )
        this.favourite.status = status
      } catch (error) {}
    },

    async saveFavouriteState(status?: number) {
      if (!this.$global.user.isLogined) {
        this.$global.user.isDisplayLoginDialog = true
        return
      }

      try {
        const state = await this.$API.Favourite.saveFavouriteStatus(
          this.bangumi._id,
          status
        )
        console.log(state)
        this.fetchFavourite()
      } catch (error) {}
    },

    handleToRating
  }
})
</script>

<style lang="scss">
.detail-header-wrap {
  --header-cover-width: 215px;
  --header-cover-margin-top: -125px;

  .banner {
    position: relative;
    height: 400px;
    z-index: -1;
    overflow: hidden;

    .bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;

      &.blur {
        filter: blur(6px);
        transform: scale(1.1);
      }
    }

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--app-color-bg);
      opacity: 0.5;
      transition: background-color 0.2s;
    }
  }

  .header {
    background-color: var(--color-bg-4);

    .container {
      display: flex;
      align-items: flex-start;
      min-height: 250px;
    }
  }

  .cover-wrap {
    flex-shrink: 0;
    margin-right: 30px;
    margin-top: var(--header-cover-margin-top);

    .acg-gallery {
      flex-shrink: 0;
      width: var(--header-cover-width);

      .hide-indicator {
        padding-bottom: 12px;
      }
    }

    .action {
      margin-top: 20px;

      .btn-add-list {
        width: 100%;

        .arco-btn.arco-btn-status-stop {
          color: rgba(156, 109, 230, 0.7);
          background-color: rgba(156, 109, 230, 0.2);
          border: 1px dashed rgba(156, 109, 230, 0.5);
        }

        .arco-btn.arco-btn-status-watching {
          color: var(--color-link-light-3);
          background-color: var(--color-link-light-1);
          border: 1px dashed var(--color-link-light-2);
        }
      }
    }
  }

  .content {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 250px;
    box-sizing: border-box;

    .meta {
      position: absolute;
      top: 0;
      left: 0;
      transform: translateY(-100%);
      padding-bottom: 6px;
      width: 100%;
      padding-right: 80px;
      box-sizing: border-box;
    }

    .rating {
      position: absolute;
      top: 0;
      right: 0;
      transform: translateY(-100%);
      text-align: center;
      padding: 6px 8px;
      cursor: pointer;
      width: 70px;
      color: #ffffff;
      background-color: rgba(0, 0, 0, 0.5);

      .score {
        font-size: 36px;
        line-height: 36px;
        color: #e4a329;
      }

      .to-review-btn {
        display: none;
      }

      &:hover {
        .tips {
          display: none;
        }

        .to-review-btn {
          display: block;
        }
      }
    }

    .tags {
      margin-top: 10px;
    }

    .description {
      line-height: 1.5;
      max-width: 900px;
      padding: 15px 0;
    }

    .nav {
      align-self: center;
      justify-self: end;
      display: flex;
      justify-content: space-evenly;
      width: 100%;
      max-width: 800px;
      padding-top: 10px;
      margin-top: auto;

      .link {
        padding: 15px;
        color: var(--color-text-3);

        &:hover {
          color: var(--app-color-common);
        }
      }

      .router-link-exact-active {
        font-weight: bold;
        color: var(--color-text-1);
      }
    }
  }
}

@media (max-width: 767.9px) {
  .detail-header-wrap {
    --header-cover-width: 120px;
    --header-cover-margin-top: -110px;
    --header-content-margin-top: 0;

    .banner {
      height: 210px;
    }

    .header {
      .cover-wrap {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: flex-end;
      }

      .acg-gallery {
        flex-shrink: 0;

        &:not(.hide-indicator) {
          margin-bottom: -9px;
        }
      }

      .action {
        flex-grow: 1;
        margin-left: 20px;
      }

      .title {
        font-size: 22px;
      }

      .original-title {
        font-size: 14px;
      }

      .container {
        flex-direction: column;
        min-height: 200px;
      }

      .content {
        width: 100%;
        min-height: 180px;
        padding-top: 25px;
      }

      .meta {
        position: relative;
        transform: none;
        padding-right: 0;
      }

      .rating {
        top: -50px;
      }
    }
  }
}
</style>
