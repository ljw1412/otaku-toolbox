<template>
  <transition name="acg-fade">
    <div v-show="visibility"
      class="acg-fixed-button"
      :class="{ 'is-transparent': transparent }"
      :style="{right: right + 'px',bottom: bottom + 'px'}"
      @click="onClick">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AcgFixedButton',

  props: {
    transparent: Boolean,
    target: { type: String, default: '' },
    visibilityHeight: { type: Number, default: 200 },
    right: { type: Number, default: 40 },
    bottom: { type: Number, default: 40 }
  },

  emits: ['click'],

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
      }
    },

    onClick(e: Event) {
      this.$emit('click', e)
    }
  }
})
</script>

<style lang="scss">
.acg-fixed-button {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.15s;
  box-sizing: border-box;
  color: var(--acg-fixed-button-color);

  &:not(.is-transparent) {
    border: var(--acg-fixed-button-border);
    background-color: var(--acg-fixed-button-bg-color);
  }

  &:active {
    transform: scale(0.9);
  }
}
</style>
