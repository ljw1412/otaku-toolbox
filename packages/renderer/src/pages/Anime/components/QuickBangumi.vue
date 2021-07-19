<template>
  <div class="quick-bangumi flex-grow-1 h-100 px-30 py-20">
    <template v-if="bangumi">
      <div class="title mb-20">
        <h1>{{ bangumi.title['zh_CN'] }}</h1>
        <p><i>{{ bangumi.title['ja_JP'] }}</i></p>
        <p><i>{{ bangumi.title['en_GB'] }}</i></p>
      </div>
      <div class="d-flex w-100">
        <div class="w-33">
          <img class="cover"
            :src="bangumi.image">
        </div>
        <div class="w-66 ml-10">
          <div>标签：{{ bangumi.tag['zh_CN'].join(' ') }}</div>
          <div>首映：{{ release }}</div>
          <div>话数：{{ bangumi.episode }}</div>
          <div>
            <p>故事背景：</p>
            <p>{{ bangumi.descrip['zh_CN'] }}</p>
          </div>
        </div>
      </div>
      <div class="mt-20">
        链接:<a :href="bangumi.url['zh_CN']">{{ bangumi.url['zh_CN'] }}</a>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AnimeQuickBangumi',

  props: {
    bangumi: { type: Object, default: undefined }
  },

  computed: {
    release(): string {
      if (this.bangumi && this.bangumi.release) {
        return window
          .$dayjs(this.bangumi.release * 1000)
          .format('YYYY-MM-DD HH:mm')
      }
      return ''
    }
  }
})
</script>

<style lang="scss">
.quick-bangumi {
  box-sizing: border-box;
  width: 0;
  .cover {
    width: 100%;
  }
}
</style>
