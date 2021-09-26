<template>
  <transition name="acg-fade">
    <div v-show="visibility"
      class="acg-back-top"
      :style="{right: right + 'px',bottom: bottom + 'px'}"
      @click="onClick">
      <slot name="all">
        <div class="acg-back-top_btn">
          <div class="btn-content">
            <slot>UP</slot>
          </div>
        </div>
      </slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AcgBackTop',
  props: {
    target: { type: String, default: '' },
    visibilityHeight: { type: Number, default: 200 },
    right: { type: Number, default: 40 },
    bottom: { type: Number, default: 40 }
  },

  data() {
    return {
      scrollTop: 0,
      targetEl: null as null | HTMLElement
    }
  },

  computed: {
    visibility(): boolean {
      return this.scrollTop > this.visibilityHeight
    }
  },

  mounted() {
    this.bind()
  },

  beforeUnmount() {
    this.unbind()
  },

  methods: {
    bind() {
      if (this.target) {
        this.targetEl = document.querySelector(this.target)
      }

      if (!this.targetEl) {
        console.error('[AcgBackTop]', `未找到滚动目标"${this.target}"`)
        return
      }
      this.targetEl.addEventListener('scroll', this.listener)
    },

    unbind() {
      if (this.targetEl) {
        this.targetEl.removeEventListener('scroll', this.listener)
      }
    },

    listener() {
      if (this.targetEl) {
        this.scrollTop = this.targetEl.scrollTop
        console.log(this.targetEl.scrollTop)
      }
    },

    onClick() {
      if (this.targetEl) {
        this.targetEl.scrollTo({ behavior: 'smooth', top: 0 })
      }
    }
  }
})
</script>

<style lang="scss">
.acg-back-top {
  position: fixed;
  cursor: pointer;
  &_btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--acg-back-top-bg-color);
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }
}
</style>
