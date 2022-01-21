<template>
  <a-card v-show="mVisible"
    ref="contextMenu"
    class="live-card-context-menu"
    :style="cardStyle"
    :body-style="{padding: 0}">
    <div class="menu-list">
      <a-link v-for="item of menuList"
        :key="item.action"
        class="menu-item"
        :status="item.status"
        @click="handleMenuItemClick(item.action)">
        <component :is="item.icon"
          class="mr-4" />{{ item.name }}
      </a-link>
    </div>
  </a-card>
</template>

<script lang="ts">
import { onClickOutside } from '@vueuse/core'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'LiveCardContextMenu',

  props: {
    visible: Boolean,
    left: { type: Number, default: 0 },
    top: { type: Number, default: 0 }
  },

  emits: ['update:visible', 'menu-item-click'],

  setup(props, ctx) {
    const contextMenu = ref(null)

    onClickOutside(contextMenu, e => {
      if (props.visible) {
        ctx.emit('update:visible', false)
      }
    })

    return { contextMenu }
  },

  data() {
    return {
      menuList: [
        {
          name: '进入',
          icon: 'icon-import',
          action: 'enter',
          status: undefined
        },
        {
          name: '删除',
          icon: 'icon-delete',
          action: 'delete',
          status: 'danger'
        }
      ]
    }
  },

  computed: {
    mVisible: {
      get() {
        return this.visible
      },
      set(val: boolean) {
        this.$emit('update:visible', val)
      }
    },

    cardStyle() {
      return { left: this.left + 'px', top: this.top + 'px' }
    }
  },

  methods: {
    handleMenuItemClick(action: string) {
      this.$emit('menu-item-click', action)
      this.mVisible = false
    }
  }
})
</script>

<style lang="scss">
.live-card-context-menu {
  position: absolute;
  width: 80px;

  .menu-list {
    .menu-item {
      display: block;
      line-height: 28px;
      padding: 0 8px;
    }
  }
}
</style>
