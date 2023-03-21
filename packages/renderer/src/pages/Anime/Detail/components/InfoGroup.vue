<template>
  <div class="info-group">
    <div
      class="info-group-header"
      :class="{ 'layout-lr': $slots['header-append'] }"
    >
      <div class="title-wrap" :class="{ link: titleLink }">
        <div class="title" @click="handleTitleClick">
          <span>{{ title }}</span>
          <icon-caret-right v-if="titleLink" />
        </div>
        <slot name="title-append"></slot>
      </div>
      <slot name="header-append"></slot>
    </div>
    <slot class="content"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'InfoGroup',

  props: {
    mini: Boolean,
    title: String,
    titleLink: Object as PropType<RouteLocationRaw>
  },

  methods: {
    handleTitleClick() {
      if (this.titleLink) {
        this.$router.push(this.titleLink)
      }
    }
  }
})
</script>

<style lang="scss">
.info-group {
  > .info-group-header {
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 6px;
  }

  .title-wrap {
    display: inline-flex;
    align-items: center;
    font-weight: bold;

    &.link {
      cursor: pointer;
    }

    .title {
      flex-shrink: 0;
    }
  }
}
</style>
