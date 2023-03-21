<template>
  <info-group v-if="list.length" class="media-relations" title="关联作品">
    <div class="media-grid">
      <router-link
        v-for="item of list"
        :key="item._id"
        target="_blank"
        :title="item.title"
        :to="{
          name: 'BangumiDetail',
          params: { id: item._id },
          query: { app: 'otakutools' }
        }"
      >
        <a-card
          hoverable
          class="media-card"
          :bordered="false"
          :body-style="{ padding: '12px' }"
        >
          <template #cover>
            <img
              class="media-cover"
              :src="item.coverMin"
              loading="lazy"
              referrerpolicy="no-referrer"
            />
          </template>
          <div class="media-content">
            <h6>{{ item.title }}</h6>
            <p class="onair">{{ formatDate(item.onair) }}</p>
            <p class="type">
              <span>{{ item.type }}</span>
              <a-divider direction="vertical" />
              <span>{{ item.typeInSeries }}</span>
            </p>
          </div>
        </a-card>
      </router-link>
    </div>
  </info-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InfoGroup from './InfoGroup.vue'
import { fetchMediaRelations } from '../utilities/cache'

export default defineComponent({
  name: 'MediaRelations',

  components: { InfoGroup },

  data() {
    return {
      list: [] as BangumiBasic[]
    }
  },

  created() {
    this.loadMediaRelations()
  },

  methods: {
    formatDate(date?: string | number | Date) {
      const day = this.$dayjs(date)
      if (!day.unix()) return '播出时间不明'
      return day.format('YYYY-MM-DD')
    },

    async loadMediaRelations() {
      const bid = this.$route.params.id as string
      if (!bid) return
      this.list = await fetchMediaRelations(bid)
    }
  }
})
</script>

<style lang="scss">
.media-relations {
  .media-grid {
    display: grid;
    grid-column-gap: 30px;
    grid-row-gap: 15px;
    grid-template-columns: repeat(var(--overview-relations-columns), 1fr);
  }

  .media-card {
    display: inline-grid;
    width: 100%;
    height: 115px;
    grid-template-columns: 85px auto;
    cursor: pointer;

    .media-cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .media-content {
      position: relative;
      height: 100%;

      h6 {
        font-size: 14px;
        margin-bottom: 6px;
        color: var(--color-text-1);
      }

      .onair {
        font-size: 13px;
        color: var(--color-text-3);
      }

      .type {
        position: absolute;
        left: 0;
        bottom: 0;
        font-size: 12px;
        color: var(--color-text-2);
      }
    }
  }
}
</style>
