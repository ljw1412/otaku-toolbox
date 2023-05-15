<template>
  <div
    class="anime-index"
    :class="{ 'is-laptop': isLaptopSize, 'is-mobile': isMobileSize }"
  >
    <a-drawer
      v-model:visible="isDisplayFilterDialog"
      :closable="false"
      :width="isMobileSize ? '100%' : '320px'"
      class="anime-filter-drawer"
    >
      <template #footer>
        <a-button type="primary" @click="isDisplayFilterDialog = false"
          >确认</a-button
        >
      </template>
    </a-drawer>

    <section class="anime-index-container">
      <main class="anime-index-main">
        <header class="anime-index-header sticky-t bg-app">
          <a-page-header :show-back="false">
            <template #title>
              <a-space size="mini">
                <span style="line-height: 1">番剧索引</span>
                <div
                  v-show="page.total"
                  style="font-size: 0"
                  class="layout-center"
                >
                  <a-badge :count="page.total" :max-count="9999" />
                </div>
              </a-space>
            </template>
            <template #subtitle>
              <app-sort-text
                :active="isDefaultSort"
                :directions="['']"
                text="默认排序"
                @change="handleSortChange('default')"
              ></app-sort-text>
              <app-sort-text
                v-model="sort.sortonair"
                :directions="[-1, 1]"
                text="开播时间"
                @change="handleSortChange('sortonair')"
              ></app-sort-text>
            </template>
            <template #extra>
              <a-space size="mini">
                <a-pagination
                  v-show="!isMobileSize"
                  v-model:current="page.index"
                  :total="page.total"
                  :page-size="page.size"
                  size="small"
                  hide-on-single-page
                  @change="handlePageChange"
                />

                <a-link
                  v-show="isLaptopSize"
                  style="line-height: 26px"
                  @click="isDisplayFilterDialog = true"
                >
                  <icon-filter />筛选器
                </a-link>
              </a-space>
            </template>
          </a-page-header>
          <anime-filter-status
            v-if="isLaptopSize"
            :keyword="keyword"
            :tags="filterTagList"
            :keyword-close="false"
            style="padding-left: 4px"
          ></anime-filter-status>
        </header>

        <div class="anime-index-content">
          <acg-api-result
            :loading="loading.bangumi"
            :error="error.bangumi"
            :empty="!page.total"
            @retry="fetchBangumiList"
          ></acg-api-result>
          <anime-card
            v-for="bangumi of bangumiList"
            :key="bangumi._id"
            :show-onair="!!sort.sortonair"
            :anime="bangumi"
          ></anime-card>
        </div>
      </main>
      <aside class="anime-index-aside" v-show="!isLaptopSize">
        <anime-filter
          :group-list="tagGroupList"
          :current-keyword="keyword"
          @change="handleFilterChange"
        ></anime-filter>
        <acg-api-result
          :loading="loading.filter"
          :error="error.filter"
          @retry="fetchTagGroupList"
        ></acg-api-result>
      </aside>
    </section>

    <footer v-if="isMobileSize" class="anime-index-footer sticky-b bg-app">
      <a-pagination
        v-model:current="page.index"
        :total="page.total"
        :page-size="page.size"
        :base-size="13"
        size="small"
        @change="handlePageChange"
      />
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AnimeCard from './components/AnimeCard.vue'
import AnimeFilter from './components/AnimeFilter.vue'
import AnimeFilterStatus from './components/AnimeFilterStatus.vue'
import AcgApiResult from '/@/components/AcgApiResult.vue'
import AppSortText from '/@/components/AppSortText.vue'
import { typeOf } from '/@/utils/assist'
import { statusData, typeData } from './stores/filterStore'

export default defineComponent({
  name: 'AnimeIndex',

  components: {
    AnimeCard,
    AnimeFilter,
    AnimeFilterStatus,
    AcgApiResult,
    AppSortText
  },

  data() {
    return {
      loading: { bangumi: true, filter: true },
      error: { bangumi: false, filter: false },
      isDisplayFilterDialog: false,
      keyword: '',
      sort: { sortonair: '' } as Record<string, string>,
      page: { index: 1, total: 0, size: 24 },
      tagGroupList: [] as TagGroup[],
      filterTagList: [] as Tag[],
      bangumiList: [] as BangumiBasic[]
    }
  },

  computed: {
    isDefaultSort(): boolean {
      return Object.values(this.sort).every((item) => !item)
    },

    filterTagIds(): string {
      return this.filterTagList
        .filter((tag) => tag.group !== 'type' && tag.group !== 'status')
        .map((tag) => tag._id)
        .join(',')
    },

    typeValue(): string {
      const typeTag = this.filterTagList.find((tag) => tag.group === 'type')
      return typeTag ? typeTag._id : ''
    },

    statusValue(): string {
      const statusTag = this.filterTagList.find((tag) => tag.group === 'status')
      return statusTag ? statusTag._id : ''
    }
  },

  watch: {
    isLaptopSize(val: boolean) {
      if (!val) {
        this.isDisplayFilterDialog = false
      }
    }
  },

  created() {
    this.initData()
    this.loadData()
  },

  methods: {
    initData() {
      const {
        p,
        tags,
        keyword = '',
        status = '',
        type = ''
      } = this.$route.query
      this.page.index = parseInt((p as string) || '1')
      if (tags) {
        this.filterTagList = (tags as string)
          .split(',')
          .map((id) => ({ _id: id, name: '' }))
      }
      this.keyword = keyword as string
      if (status) {
        statusData.forEach((item) => {
          item.selected = item._id === status
        })
      }
      if (type) {
        typeData.forEach((item) => {
          item.selected = item._id === type
        })
      }
    },

    setStatus(
      name: 'filter' | 'bangumi',
      status: 'reset' | 'success' | 'fail'
    ) {
      if (status === 'reset') {
        this.error[name] = false
        this.loading[name] = true
      } else if (status === 'success') {
        this.error[name] = false
        this.loading[name] = false
      } else if (status === 'fail') {
        this.error[name] = true
        this.loading[name] = false
      }
    },

    async fetchTagGroupList() {
      this.setStatus('filter', 'reset')
      try {
        const list = await this.$API.Tag.listTagGroup()
        list.forEach((group) => {
          let hasSelected = false
          group.tags.forEach((tag) => {
            const index = this.filterTagList.findIndex(
              (item) => item._id === tag._id
            )
            tag.selected = !!~index
            if (tag.selected) {
              hasSelected = true
              this.filterTagList.splice(index, 1, tag)
            }
          })

          group.tags.unshift({
            _id: '',
            name: '全部',
            group: group._id,
            selected: !hasSelected
          })
        })
        this.tagGroupList = list
        this.setStatus('filter', 'success')
      } catch (error) {
        this.setStatus('filter', 'fail')
      }
    },

    async fetchBangumiList() {
      this.bangumiList = []
      this.setStatus('bangumi', 'reset')
      try {
        const { list, total } = await this.$API.Bangumi.listBangumi(
          this.page,
          this.typeValue,
          this.statusValue,
          this.filterTagIds,
          this.keyword,
          this.sort
        )
        this.bangumiList = list
        this.page.total = total
        this.setStatus('bangumi', 'success')
      } catch (error) {
        this.setStatus('bangumi', 'fail')
      }
    },

    async loadData() {
      this.fetchTagGroupList()
      this.fetchBangumiList()
    },

    updateRouteQuery() {
      const query = Object.assign({}, this.$route.query, {
        p: this.page.index,
        tags: this.filterTagIds,
        keyword: this.keyword,
        type: this.typeValue,
        status: this.statusValue,
        ...this.sort
      })
      this.$router.replace({ query })
    },

    handleSortChange(name: string) {
      if (name === 'default') {
        Object.keys(this.sort).forEach((key) => {
          this.sort[key] = ''
        })
      }
      this.handlePageChange(1)
    },

    handleFilterChange({ keyword, tags }: { keyword: string; tags: Tag[] }) {
      if (tags) this.filterTagList = tags
      if (typeOf(keyword) === 'string') this.keyword = keyword
      this.handlePageChange(1)
    },

    handlePageChange(index: number) {
      this.page.index = index
      this.updateRouteQuery()
      this.fetchBangumiList()
    }
  }
})
</script>

<style lang="scss">
.anime-index {
  --index-aside-width: 300px;
  --index-anime-item-width: 20%;
  --index-anime-item-gutter: 16px;

  .anime-index-container {
    display: flex;
  }

  .anime-index-main {
    flex: 1 0 auto;
    width: 0;
  }

  .anime-index-content {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-content: stretch;
    padding-top: 8px;
    box-sizing: border-box;
  }

  .anime-index-aside {
    flex-shrink: 0;
    width: var(--index-aside-width);
  }

  .anime-index-footer {
    padding: 8px;
    .arco-pagination {
      justify-content: center;
    }
  }

  &:not(.is-laptop) {
    .arco-page-header-wrapper {
      padding-left: 0;
    }
  }
  &.is-laptop {
    .anime-index-content {
      padding-left: calc(var(--index-anime-item-gutter) / 2);
    }
  }

  &.is-laptop:not(.is-mobile) {
    .index-anime-item:nth-child(4n) {
      margin-right: 0;
    }
  }

  &.is-mobile {
    .index-anime-item:nth-child(3n) {
      margin-right: 0;
    }
  }
}

.anime-filter-drawer {
  .arco-drawer-header {
    display: none;
  }
  .arco-drawer-body {
    padding-top: 0;
    .index-anime-filter .arco-descriptions-title {
      top: 0;
    }
  }
}

@media (min-width: 1750px) {
  .anime-index {
    --index-anime-item-width: 16.66%;
  }
}

@media (max-width: 1599.9px) {
  .anime-index {
    --index-anime-item-width: 25%;
    --index-anime-item-gutter: 12px;
  }
}

@media (max-width: 767.9px) {
  .anime-index {
    --index-anime-item-width: 33.33%;
    --index-anime-item-gutter: 8px;
  }
}
</style>
