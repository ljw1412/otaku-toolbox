<template>
  <div v-show="url"
    class="screen-shot-preview">
    <img :src="url">
    <a-button-group>
      <a-button status="danger"
        @click="url = ''">取消</a-button>
      <a-button @click="save">保存</a-button>
    </a-button-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LiveScreenShotPreview',

  emits: ['update:modelValue'],

  props: { modelValue: { type: String, default: '' } },

  computed: {
    url: {
      get() {
        return this.modelValue
      },
      set(val: string) {
        this.$emit('update:modelValue', val)
      }
    }
  },

  methods: {
    async save() {
      const a = document.createElement('a')
      a.href = this.modelValue
      a.download = `screen-shot-${+new Date()}.png`
      a.click()
    }
  }
})
</script>

<style lang="scss">
.screen-shot-preview {
  position: absolute;
  bottom: 40px;
  right: 10px;
  width: 300px;
  padding: 4px;
  z-index: 150;
  font-size: 16px;
  background-color: #2a2a2b;

  img {
    width: 100%;
  }

  .arco-btn-group {
    display: flex;
    width: 100%;
    > * {
      flex-grow: 1;
    }
  }
}
</style>
