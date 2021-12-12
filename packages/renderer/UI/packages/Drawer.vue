<template>
  <div v-show="isDisplayDrawer"
    class="acg-drawer"
    :style="{top}">
    <transition name="acg-fade"
      @before-enter="beforeEnter"
      @after-leave="afterLeave">
      <div v-show="modelValue"
        class="overlay"
        @click="handleModalClcik"></div>
    </transition>
    <transition :name="transitionName">
      <div v-show="modelValue"
        class="acg-drawer__container"
        :class="innerClass"
        :style="[{width,[placement]:0},innerStyle]">
        <div v-if="$slots.header || title"
          class="acg-drawer__header">
          <slot name="header">
            <div class="title">{{ title }}</div>
          </slot>
        </div>
        <div class="acg-drawer__body">
          <slot></slot>
        </div>
        <div v-if="$slots.footer"
          class="acg-drawer__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AcgDrawer',

  props: {
    modelValue: Boolean,
    title: String,
    top: { type: String, default: undefined },
    width: { type: String, default: '300px' },
    placement: { type: String, default: 'right' },
    innerClass: [String, Object],
    innerStyle: [String, Object],
    closeByMask: { type: Boolean, default: true }
  },

  emits: ['update:modelValue', 'close', 'open', 'closed'],

  data() {
    return {
      isDisplayDrawer: false
    }
  },

  computed: {
    mPlacement(): string {
      return this.placement === 'left' ? 'left' : 'right'
    },
    transitionName(): string {
      return 'acg-slide-' + this.mPlacement
    }
  },

  methods: {
    beforeEnter() {
      this.$emit('open')
      this.isDisplayDrawer = true
    },
    afterLeave() {
      this.$emit('closed')
      this.isDisplayDrawer = false
    },

    close(who?: string) {
      this.$emit('close', who)
      this.$emit('update:modelValue', false)
    },

    handleModalClcik() {
      if (this.closeByMask) this.close('mask')
    }
  }
})
</script>

<style lang="scss">
.acg-drawer {
  --acg-drawer-bg-color: #ffffff;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5000;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
  }

  &__container {
    position: absolute;
    top: 0;
    height: 100%;
    background: var(--acg-drawer-bg-color);
    display: flex;
    flex-direction: column;
  }

  &__header {
    flex-shrink: 0;
    .title {
      font-size: 20px;
      padding: 12px 16px;
    }
  }

  &__body {
    flex-grow: 1;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 16px;
  }

  &__footer {
    flex-shrink: 0;
  }
}
</style>
