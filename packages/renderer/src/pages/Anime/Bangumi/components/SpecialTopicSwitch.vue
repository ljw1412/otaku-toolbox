<template>
  <acg-fixed-button ref="btn"
    title="专题切换"
    always
    :bottom="90"
    @click="isDisplaySwitch=!isDisplaySwitch">
    <acg-icon name="repeat-outline"
      :size="20"></acg-icon>
    <transition name="fade">
      <div v-show="isDisplaySwitch"
        class="topic-switch">
        <router-link v-for="topic of list"
          :key="topic._id"
          :to="{params: {code: topic.code},query:{app:'otakutools'}}">
          <a-button :type="topic.code === code?'primary':'text'"
            long>{{ topic.name }}</a-button>
        </router-link>
      </div>
    </transition>
  </acg-fixed-button>
</template>

<script lang="ts">
import { onClickOutside } from '@vueuse/core'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'SpecialTopicSwitch',
  props: {
    list: { type: Array as PropType<SpecialTopic[]>, default: () => [] },
    code: String
  },
  data() {
    return { isDisplaySwitch: false }
  },
  mounted() {
    onClickOutside(this.$refs.btn as HTMLElement, () => {
      if (this.isDisplaySwitch) {
        this.isDisplaySwitch = false
      }
    })
  }
})
</script>

<style lang="scss">
.topic-switch {
  position: absolute;
  bottom: 0;
  right: 48px;
  width: 160px;
  padding: 4px;
  border-radius: 4px;
  background-color: var(--acg-fixed-button-bg-color);
  border: var(--acg-fixed-button-border);
  z-index: 1000;

  > a {
    display: block;
    & + a {
      margin-top: 2px;
    }
  }
}
</style>
