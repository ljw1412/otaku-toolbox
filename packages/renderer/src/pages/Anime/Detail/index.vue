<template>
  <div class="bangumi-detail">
    <detail-header></detail-header>
    <div class="detail-content container">
      <aside v-show="!isMobileSize" class="sidebar">
        <detail-sidebar></detail-sidebar>
      </aside>
      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>

    <detail-rating-dialog
      v-model="store.isDisplayRatingDialog"
      :review="store.review"
    ></detail-rating-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DetailHeader from './components/DetailHeader.vue'
import DetailSidebar from './components/DetailSidebar.vue'
import DetailRatingDialog from './components/DetailRatingDialog.vue'
import { fetchBangumiInfo } from './utilities/cache'
import detailStore, { fetchReview } from './utilities/store'

export default defineComponent({
  name: 'BangumiDetail',

  props: { id: String },

  components: { DetailHeader, DetailSidebar, DetailRatingDialog },

  data() {
    return {
      basic: {} as FormatedBangumiBasic
    }
  },

  computed: {
    store() {
      return detailStore
    }
  },

  created() {
    this.fetchBasic()
  },

  async beforeRouteUpdate(to, from, next) {
    this.$global.setTitle(`${this.basic.title} - ${to.meta.title}`)
    next()
  },

  methods: {
    async fetchBasic() {
      if (!this.id) return
      this.basic = (await fetchBangumiInfo(this.id)).info
      if ((this.basic.mark || []).includes('ban')) {
        document.documentElement.classList.add('filter-gray')
      }
      this.$global.setTitle(`${this.basic.title} - ${this.$route.meta.title}`)
      fetchReview(this.id)
    }
  }
})
</script>

<style lang="scss">
.bangumi-detail {
  --container-width: 1520px;
  --container-padding: 100px;
  --overview-relations-columns: 3;
  --overview-item-gap: 16px;

  .container {
    max-width: var(--container-width);
    padding-left: var(--container-padding);
    padding-right: var(--container-padding);
    margin: 0 auto;
    min-width: 320px;
    width: 100%;
    box-sizing: border-box;
  }

  .detail-content {
    display: flex;
    min-height: 100px;
    margin-top: 30px;
    padding-bottom: 30px;

    .sidebar {
      flex-shrink: 0;
      width: 208px;
      margin-right: 40px;
    }

    .main-content {
      width: 0;
      flex-grow: 1;

      .info-group {
        margin-top: var(--overview-item-gap);
      }
    }

    .arco-card {
      border-radius: var(--border-radius-medium);
    }
  }

  .ct-label {
    font-size: 12px;
    color: var(--color-text-2);
  }

  .label-text {
    font-size: 12px;
    fill: var(--color-text-2);
    transition: opacity 0.2s ease-in-out;
  }
}

@media (max-width: 1599.9px) {
  .bangumi-detail {
    --container-width: 1140px;
    --container-padding: 50px;
    --overview-relations-columns: 2;
  }
}

@media (max-width: 1199.9px) {
  .bangumi-detail {
    --container-width: 100%;
    --container-padding: 30px;
    --overview-relations-columns: 1;
  }
}

@media (max-width: 767.9px) {
  .bangumi-detail {
    --container-padding: 20px;
  }
}
</style>
