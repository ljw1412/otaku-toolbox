<template>
  <transition name="right-in">
    <div v-show="show"
      class="quick-bangumi px-30 py-20 position-relative">
      <div class="quick-bangumi-close fs-36 cursor-pointer"
        @click="close">
        <acg-icon name="arrow-forward-sharp"></acg-icon>
      </div>
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
          链接:<a :href="bangumi.url['zh_CN']"
            target="_blank">{{ bangumi.url['zh_CN'] }}</a>
        </div>
      </template>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AnimeQuickBangumi',

  props: {
    show: Boolean,
    bangumi: { type: Object, default: undefined }
  },

  emits: ['update:show'],

  computed: {
    release(): string {
      if (this.bangumi && this.bangumi.release) {
        return window
          .$dayjs(this.bangumi.release * 1000)
          .format('YYYY-MM-DD HH:mm')
      }
      return ''
    }
  },

  methods: {
    close() {
      this.$emit('update:show', false)
    }
  }
})
</script>

<style lang="scss">
.quick-bangumi {
  box-sizing: border-box;
  min-height: 100%;
  background-color: var(--bg-bangumi-color);
  border: 1px solid var(--border-color);
  border-right: none;

  .quick-bangumi-close {
    line-height: 1;
    position: absolute;
    right: 20px;
    top: 20px;

    &:hover {
      background-color: rgba(100, 100, 100, 0.25);
      overflow: hidden;
      .acg-icon {
        animation: arrow-actived 1s ease-in-out infinite;
      }
    }
  }

  .cover {
    width: 100%;
  }
}

@keyframes arrow-actived {
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
