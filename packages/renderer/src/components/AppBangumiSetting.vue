<script setup lang="ts">
import { computed, PropType, CSSProperties } from 'vue'
import $global from '/@/global/index'

const props = defineProps({
  icon: Boolean,
  iconSize: { type: Number, default: 16 },
  position: {
    // prettier-ignore
    type: String as PropType<'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br' | 'left' | 'lt' | 'lb' | 'right' | 'rt' | 'rb'>,
    default: 'left'
  },
  trigger: {
    type: String as PropType<'hover' | 'click'>,
    default: 'click'
  },
  tooltipPosition: {
    // prettier-ignore
    type: String as PropType<'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br' | 'left' | 'lt' | 'lb' | 'right' | 'rt' | 'rb'>,
    default: 'left'
  },
  contentStyle: { type: Object as PropType<CSSProperties> }
})

const config = computed(() => $global.config.bangumi)
</script>

<template>
  <a-popover
    :position="position"
    :trigger="trigger"
    :content-style="{ padding: '6px', width: '190px' }"
  >
    <icon-settings
      v-if="icon"
      class="app-bangumi-setting-icon"
      :size="iconSize"
      :style="contentStyle"
    />
    <a-button v-else class="app-bangumi-setting-btn" :style="contentStyle">
      <template #icon><icon-settings /></template>
    </a-button>

    <template #content>
      <a-tooltip :position="tooltipPosition" mini>
        <template #content>
          如果B站已经登录过账号<br />就可以获得高画质的体验
        </template>
        <a-checkbox v-model="config.newOpenTrailer">
          新窗口高清预告片(B站)
        </a-checkbox>
      </a-tooltip>
    </template>
  </a-popover>
</template>

<style lang="scss">
.app-bangumi-setting-icon {
  cursor: pointer;
}
</style>
