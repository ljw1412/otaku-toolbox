<template>
  <acg-tooltip :placement="placement"
    :offset="offset"
    :interactive="true"
    animation="perspective-extreme"
    trigger="click"
    :theme="tooltipTheme"
    @show="getTheme">
    <acg-icon :class="['cursor-pointer',innerClass]"
      name="shirt"></acg-icon>

    <template #content>
      <div class="skin-pop user-select-none">
        <div class="fs-14 my-10 title font-weight-bold">
          切换主题
        </div>
        <ul class="skin-picker d-grid">
          <li v-for="item of colorList"
            :key="item.name"
            class="skin-item text-center"
            @click="changeTheme(item.value)">
            <div class="color-block d-flex justify-content-center align-items-center cursor-pointer"
              :style="{'backgroundColor':`var(--skin-${item.color})`}">
              <acg-icon v-if="item.value === theme"
                name="checkmark-sharp"
                size="20"
                stroke="#ffffff"></acg-icon>
            </div>
            <div class="skin-name h-16 fs-14">
              {{ item.name }}
            </div>
          </li>
        </ul>
      </div>
    </template>
  </acg-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BasePop from '/@/mixins/BasePop'

export default defineComponent({
  name: 'SkinPop',
  mixins: [BasePop],
  data() {
    return {
      colorList: [
        { name: '默认', value: '', color: 'blue' },
        { name: '热情红', value: 'red', color: 'red' },
        { name: '环保绿', value: 'green', color: 'green' },
        { name: '黑夜色', value: 'dark', color: 'dark' }
      ]
    }
  },

  methods: {
    changeTheme(type: string) {
      window.$theme.set(type)
      this.theme = type
    }
  }
})
</script>

<style lang="scss">
:root[data-theme='dark'] {
  .skin-pop .title {
    color: #ffffff !important;
  }
}

.skin-pop {
  color: var(--text-color) !important;
}

.skin-picker {
  grid-template-columns: 50px 50px 50px 50px;
  grid-template-rows: auto auto auto;
  .skin-item {
    width: 50px;
    .color-block {
      width: 100%;
      height: 50px;
    }
  }
}
</style>
