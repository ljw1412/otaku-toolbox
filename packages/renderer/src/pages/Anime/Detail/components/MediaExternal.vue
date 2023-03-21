<template>
  <info-group v-if="mLinks.length" class="media-external" title="相关链接">
    <a-grid :cols="{ xs: 2, sm: 2, md: 1 }" :col-gap="16" :row-gap="8">
      <a-grid-item v-for="link of mLinks" :key="link.url" class="external-item">
        <acg-stream-item
          v-bind="link"
          long-button
          size="medium"
          :from="link.from"
          icon="icon-link"
        />
      </a-grid-item>
    </a-grid>
  </info-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InfoGroup from './InfoGroup.vue'
import detailMixin from '../utilities/mixin'

export default defineComponent({
  name: 'MediaExternal',

  components: { InfoGroup },

  mixins: [detailMixin],

  computed: {
    rating(): Record<string, string> {
      return this.bangumi.ratingSite || {}
    },

    links() {
      return (this.bangumi.links || []).filter((item) => item.type === 'link')
    },

    mLinks() {
      const list: BangumiLink[] = []

      if (this.rating.bangumi) {
        list.push({
          name: '番组计划',
          url: `https://bangumi.tv/subject/${this.rating.bangumi}`,
          from: 'Bangumi'
        })
      }
      if (this.rating.douban) {
        list.push({
          name: '豆瓣',
          url: `https://movie.douban.com/subject/${this.rating.douban}/`,
          from: 'Douban'
        })
      }

      return this.links.concat(list)
    }
  }
})
</script>

<style lang="scss">
.media-external {
  .arco-btn {
    justify-content: flex-start;

    .name {
      padding-left: 28px;
    }
  }

  .arco-btn-icon {
    position: absolute;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
  }
}
</style>
