<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'AppLoginDialog',

  props: { visible: Boolean },

  emits: ['update:visible'],

  data() {
    return {}
  },

  computed: {
    mVisible: {
      get() {
        return this.visible
      },
      set(val: boolean) {
        this.$emit('update:visible', val)
      }
    }
  },

  watch: {
    mVisible(visible: boolean) {
      if (visible) {
        if (!this.isLogined) {
          this.$API.Electron.win.openAppSystem('登录')
        }
        this.$nextTick(() => {
          this.mVisible = false
        })
      }
    }
  },

  methods: {}
})
</script>

<style lang="scss"></style>
