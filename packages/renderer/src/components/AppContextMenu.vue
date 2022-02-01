<template>
  <a-card v-show="mVisible"
    ref="contextMenu"
    class="app-context-menu"
    :style="cardStyle"
    :body-style="{padding: 0}">
    <div class="menu-list">
      <div v-for="item of menus"
        :key="item.action"
        class="menu-item">
        <a-link :status="item.status"
          class="d-block"
          @click="handleMenuItemClick(item.action)">
          <component :is="item.icon"
            class="mr-4" />{{ item.name }}
          <icon-right v-if="item.list && item.list.length"
            class="menu-right-arrow" />
        </a-link>

        <a-card v-if="item.list && item.list.length"
          class="sub-menu-card"
          :body-style="{padding: 0}">
          <div class="sub-menu-list">
            <div v-for="subItem of item.list"
              :key="subItem.action"
              class="menu-item">
              <a-link :status="subItem.status"
                class="d-block"
                @click="handleMenuItemClick(subItem.action)">
                <component :is="subItem.icon"
                  class="mr-4" />{{ subItem.name }}
              </a-link>
            </div>
          </div>
        </a-card>
      </div>
    </div>
  </a-card>

</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

interface ContextMenuItem {
  name: string
  icon: string
  action: string
  list?: ContextMenuItem[]
  status?: string
}

export default defineComponent({
  name: 'AppContextMenu',

  props: {
    visible: Boolean,
    left: { type: Number, default: 0 },
    top: { type: Number, default: 0 },
    menus: { type: Array as PropType<ContextMenuItem[]>, default: () => [] }
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
      if (!action) return
      this.$emit('menu-item-click', action)
      this.mVisible = false
    }
  }
})
</script>

<style lang="scss">
.app-context-menu {
  position: fixed !important;
  width: 100px;
  z-index: 3000;

  .menu-list {
    .menu-item {
      position: relative;
      display: block;
      line-height: 28px;

      &:hover > .sub-menu-card {
        display: block;
      }

      .menu-right-arrow {
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
      }

      .sub-menu-card {
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(100%);
        display: none;
      }
    }
  }
}
</style>
