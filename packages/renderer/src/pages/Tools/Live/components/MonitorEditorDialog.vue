<template>
  <a-modal v-model:visible="mVisible"
    simple
    class="live-monitor-editor-dialog"
    title="编辑监控台"
    @ok="handleEditSave">
    <a-input v-model="editor.name"
      :max-length="6"
      placeholder="名称"
      show-word-limit></a-input>
    <div class="mode-select mt-8">
      <acg-ratio-div v-for="i of 16"
        :key="i"
        :ratio="[16,9]"
        class="m-3"
        @click="editor.mode = i - 1">
        <div class="mode-item live-monitor-template h-100"
          :class="{selected: editor.mode === i - 1}"
          :data-type="i - 1">
          <div v-for="j of getModeLiveCount(i - 1)"
            :key="j"
            class="room-item m-1"></div>
        </div>
      </acg-ratio-div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { getModeLiveCount } from '../utils/data'

export default defineComponent({
  name: 'LiveMonitorEditorDialog',

  props: {
    modelValue: Boolean,
    currentMonitor: {
      type: Object as PropType<LiveMonitor>,
      default: () => ({})
    }
  },

  emits: ['update:modelValue', 'save'],

  data() {
    return {
      editor: { name: '', mode: 0 }
    }
  },

  computed: {
    mVisible: {
      get() {
        return this.modelValue
      },
      set(val: boolean) {
        this.$emit('update:modelValue', val)
      }
    }
  },

  watch: {
    mVisible(visible: boolean) {
      if (visible) {
        this.editor.name = this.currentMonitor.name
        this.editor.mode = this.currentMonitor.mode
      }
    }
  },

  methods: {
    getModeLiveCount,

    handleEditSave() {
      this.$emit('save', this.editor)
    }
  }
})
</script>

<style lang="scss">
.live-monitor-editor-dialog {
  .mode-select {
    display: grid;
    grid-template-columns: repeat(4, 25%);

    .mode-item {
      cursor: pointer;
      opacity: 0.4;
      &.selected {
        opacity: 1;
      }

      &:not(.selected):hover {
        opacity: 0.6;
      }
    }

    .room-item {
      background-color: var(--app-color-common);
    }
  }
}
</style>
