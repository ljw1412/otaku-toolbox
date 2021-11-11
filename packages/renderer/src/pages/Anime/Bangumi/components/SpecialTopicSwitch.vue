<template>
  <acg-tooltip v-model="isDisplaySwitch"
    placement="left-end"
    interactive
    hide-on-click
    theme="transparent"
    trigger="click">
    <acg-fixed-button title="专题切换"
      always
      :bottom="85">
      <acg-icon name="repeat-outline"
        :size="20"></acg-icon>
    </acg-fixed-button>
    <template #content>
      <div class="topic-switch">
        <div v-for="topic of list"
          :key="topic._id"
          class="topic-item"
          :class="{active:topic.code === code}"
          @click="handleCodeChange(topic.code)">
          <acg-icon v-if="topic.code === code"
            name="arrow-forward-outline"
            style="margin-right: 4px;"></acg-icon>
          <span>{{ topic.name }}</span>
        </div>
      </div>
    </template>
  </acg-tooltip>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'SpecialTopicSwitch',
  props: {
    list: { type: Array as PropType<SpecialTopic[]>, default: () => [] },
    code: String
  },
  emits: ['code-change'],
  data() {
    return { isDisplaySwitch: false }
  },
  methods: {
    handleCodeChange(code: string) {
      if (code === this.code) return
      this.$emit('code-change', code)
      this.isDisplaySwitch = false
    }
  }
})
</script>

<style lang="scss">
.topic-switch {
  width: 160px;
  padding: 4px 2px;
  border-radius: 4px;
  background-color: var(--acg-fixed-button-bg-color);
  border: var(--acg-fixed-button-border);
  z-index: 1000;

  > .topic-item {
    color: var(--text-color);
    padding: 6px;
    border-radius: 4px;
    // text-align: center;
    cursor: pointer;

    &.active {
      font-weight: bold;
    }
    &:hover {
      background-color: rgba(200, 200, 200, 0.2);
    }
  }
}
</style>
