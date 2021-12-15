<template>
  <span class="app-sort-text"
    @click="handleClick">
    <span :class="{actived: mValue || mActive}">{{text}}</span>
    <span class="app-sort-sorter"
      :class="nextDirectionClass">
      <div class="sorter-icon ascend"
        :class="{actived: mValue === 1}">
        <icon-caret-up v-if="directions.includes(1)" />
      </div>
      <div class="sorter-icon descend"
        :class="{actived: mValue === -1}">
        <icon-caret-down v-if="directions.includes(-1)" />
      </div>
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'AppSortText',

  emits: ['update:modelValue', 'update:active', 'change', 'active-change'],

  props: {
    active: Boolean,
    modelValue: { type: [Number, String], default: '' },
    // ['',-1,1]可以取消筛选，[-1,1]不能取消
    directions: {
      type: Array as PropType<(string | number)[]>,
      default: () => ['', -1, 1]
    },
    text: String
  },

  computed: {
    mValue: {
      get() {
        return this.modelValue
      },
      set(val: string | number) {
        this.$emit('update:modelValue', val)
        this.$emit('change', val)
      }
    },

    mActive: {
      get() {
        return this.active
      },
      set(val: string | number) {
        this.$emit('update:modelValue', val)
        this.$emit('active-change', val)
      }
    },

    nextDirection() {
      let nextIndex =
        (this.directions.indexOf(this.mValue) + 1) % this.directions.length
      return this.directions[nextIndex]
    },

    nextDirectionClass() {
      let defaultNextIndex =
        (this.directions.indexOf('') + 1) % this.directions.length
      return this.directions[defaultNextIndex] === 1
        ? 'next-ascend'
        : 'next-descend'
    }
  },

  methods: {
    handleClick() {
      this.mValue = this.nextDirection
    }
  }
})
</script>

<style lang="scss">
.app-sort-text {
  cursor: pointer;
  display: inline-block;
  color: var(--color-text-2);

  .actived {
    color: rgb(var(--primary-6)) !important;
  }

  .app-sort-sorter {
    display: inline-flex;
    flex-direction: column;
    margin-left: 4px;
    vertical-align: 5px;
    .sorter-icon {
      position: relative;
      font-size: 12px;
      width: 14px;
      height: 8px;
      overflow: hidden;
      line-height: 8px;
    }

    &.next-ascend {
      .sorter-icon.descend {
        color: var(--color-neutral-4);
      }
    }
    &.next-descend {
      .sorter-icon.ascend {
        color: var(--color-neutral-4);
      }
    }
  }
}
</style>
