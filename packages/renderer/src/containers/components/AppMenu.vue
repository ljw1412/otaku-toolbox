<template>
  <a-popover
    v-model:popup-visible="isPopupVisible"
    position="bottom"
    trigger="click"
    :arrow="false"
    :arrow-style="{ display: 'none' }"
    :content-style="{
      border: 'none',
      padding: '8px 0',
      boxSizing: 'border-box'
    }"
  >
    <slot></slot>
    <template #content>
      <div class="app-menu-panel">
        <a-grid :cols="3" :row-gap="8" :col-gap="8" style="padding: 0 16px">
          <a-grid-item @click="handleItemClick('hourSystem')">
            <acg-ratio-div
              class="menu-btn"
              body-class="layout-center flex-column"
            >
              <div style="line-height: 24px; height: 24px; font-size: 24px">
                {{ hourSystem }}
              </div>
              <div class="fs-12">时制</div>
            </acg-ratio-div>
          </a-grid-item>
          <a-grid-item
            v-for="btn of btns"
            :key="btn.action"
            @click="handleItemClick(btn.action)"
          >
            <acg-ratio-div
              class="menu-btn"
              body-class="layout-center flex-column"
            >
              <component :is="btn.icon" size="24"></component>
              <div class="fs-12">{{ btn.name }}</div>
            </acg-ratio-div>
          </a-grid-item>
        </a-grid>
        <a-divider style="margin: 8px 0" />
        <a-list class="action-list" :bordered="false">
          <a-list-item
            v-for="item of items"
            :key="item.action"
            class="action-list-item"
            @click="handleItemClick(item.action)"
          >
            <component :is="item.icon" size="16"></component>
            <span class="fs-14 ml-8">{{ item.name }}</span>
          </a-list-item>
        </a-list>
      </div>
    </template>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppMenu',

  data() {
    return {
      isPopupVisible: false,
      btns: [{ name: '设置', icon: 'icon-settings', action: 'setting' }],
      items: [{ name: '关于', icon: 'icon-info-circle-fill', action: 'about' }]
    }
  },

  methods: {
    handleItemClick(action: string) {
      if (action === 'setting') {
        this.$API.Electron.win.openAppSystem('系统设置')
      } else if (action === 'about') {
        this.$API.Electron.win.openAppSystem('关于')
      } else if (action === 'hourSystem') {
        this.$global.config.hourSystem = this.hourSystem === 24 ? 30 : 24
      }

      if (!['hourSystem'].includes(action)) {
        this.isPopupVisible = false
      }
    }
  }
})
</script>

<style lang="scss">
.app-menu-panel {
  user-select: none;
  width: 200px;

  .menu-btn {
    cursor: pointer;

    &:hover {
      background-color: var(--color-fill-2);
    }
  }

  .action-list {
    .action-list-item {
      cursor: pointer;

      &:hover {
        background-color: var(--color-fill-2);
      }
    }
  }
}
</style>
