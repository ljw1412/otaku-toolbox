<template>
  <div v-click-outside="handleClickOutside"
    class="acg-input"
    :class="{
      'is-search': isSearch,
      'is-clearable': clearable,
      'is-focused': isFocused,
      'is-display-history': isDisplayHistory }">
    <input ref="input"
      v-model="inputValue"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :style="inputStyle"
      class="acg-input__inner"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      @keydown="handleKeydown" />
    <div class="acg-input__suffix">
      <acg-icon v-if="clearable"
        v-show="inputValue"
        class="acg-input__btn-clear"
        name="close"
        @click="handleClear"></acg-icon>
      <acg-icon v-if="isSearch"
        class="acg-input__btn-search"
        name="search"
        @click="handleSearch"></acg-icon>
    </div>
    <div v-if="isSearch"
      v-show="isDisplayHistory && history.length"
      class="search-panel">
      <div class="search-panel-header">
        <h4>搜索历史</h4>
        <span class="history-clear"
          @click="clearHistoryStore">清空</span>
      </div>
      <ul>
        <li v-for="str of history"
          :key="str"
          @click="handleHistoryItemClick(str)">{{ str }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'

export default defineComponent({
  name: 'AcgInput',
  props: {
    modelValue: { type: String, default: '' },
    disabled: Boolean,
    readonly: Boolean,
    placeholder: String,
    clearable: Boolean,
    isSearch: Boolean,
    inputStyle: { type: [String, Object, Array], default: '' },
    historyName: { type: String, default: 'search' }
  },
  emits: [
    'update:modelValue',
    'compositionstart',
    'compositionupdate',
    'compositionend',
    'search',
    'change',
    'keydown',
    'clear',
    'input',
    'focus',
    'blur'
  ],
  data() {
    return {
      isFocused: false,
      isComposing: false,
      isDisplayHistory: false,
      history: [] as string[]
    }
  },

  computed: {
    inputValue: {
      get(): string {
        return this.modelValue
      },
      set(value: string) {
        this.$emit('update:modelValue', value)
      }
    },
    historyNameInStore(): string {
      return `history-${this.historyName}`
    }
  },

  methods: {
    getHistoryStore() {
      let data = []
      try {
        const local =
          window.localStorage.getItem(this.historyNameInStore) || '[]'
        data = JSON.parse(local)
      } catch (error) {
        this.clearHistoryStore()
      }
      this.history = data
    },

    addHistoryStore(value: string) {
      let data = [value, ...this.history]
      data = Array.from(new Set(data))
      this.history = data
      window.localStorage.setItem(this.historyNameInStore, JSON.stringify(data))
    },

    clearHistoryStore() {
      window.localStorage.removeItem(this.historyNameInStore)
      this.history = []
    },

    handleClickOutside() {
      this.isDisplayHistory = false
    },

    handleCompositionStart(event: CompositionEvent) {
      this.$emit('compositionstart', event)
      this.isComposing = true
    },

    handleCompositionUpdate(event: CompositionEvent) {
      this.$emit('compositionupdate', event)
    },

    handleCompositionEnd(event: CompositionEvent) {
      this.$emit('compositionend', event)
      if (this.isComposing) {
        this.isComposing = false
        this.handleInput(event as InputEvent)
      }
    },

    handleInput(event: InputEvent) {
      const { value } = event.target as HTMLInputElement
      if (this.isComposing) return
      if (value === this.inputValue) return
      this.inputValue = value
      this.$emit('input', value)
    },

    handleFocus(event: FocusEvent) {
      this.isFocused = true
      this.$emit('focus', event)
      if (this.isSearch) {
        this.getHistoryStore()
        this.isDisplayHistory = true
      }
    },

    handleBlur(event: Event) {
      this.isFocused = false
      this.$emit('blur', event)
    },

    handleChange(event: InputEvent) {
      const { value } = event.target as HTMLInputElement
      this.$emit('change', value, event)
    },

    handleKeydown(e: KeyboardEvent) {
      this.$emit('keydown', e)
    },

    handleClear() {
      this.inputValue = ''
      this.$emit('change', '')
      this.$emit('clear')
      this.$emit('input', '')
    },

    handleSearch() {
      if (this.isSearch && this.inputValue) {
        this.addHistoryStore(this.inputValue)
        this.isDisplayHistory = false
      }
      this.$emit('search', this.inputValue)
    },

    handleHistoryItemClick(str: string) {
      this.inputValue = str
      nextTick(() => this.handleSearch())
    }
  }
})
</script>

<style lang="scss">
.acg-input {
  position: relative;

  width: 180px;
  height: 30px;

  &__inner {
    border-radius: 4px;
    border: none;
    outline: none;
    appearance: none;
    width: 100%;
    height: 100%;
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
  }

  &__suffix {
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
  }

  &__btn-clear,
  &__btn-search {
    cursor: pointer;
  }

  &__btn-clear {
    right: 24px;
    opacity: 0.6;
    &:hover {
      opacity: 1;
    }
  }

  &.is-search &__inner,
  &.is-clearable &__inner {
    padding-right: 32px;
  }

  &.is-search.is-clearable {
    .acg-input__inner {
      padding-right: 48px;
    }
    .acg-input__btn-clear {
      margin-right: 4px;
    }
  }

  &.is-display-history &__inner {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .search-panel {
    position: absolute;
    left: 0;
    width: 100%;
    background-color: #ffffff;
    border-radius: 0 0 4px 4px;
    padding: 4px 4px;
    box-sizing: border-box;
    z-index: 500;
  }

  .search-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px;

    > .history-clear {
      cursor: pointer;
      font-size: 14px;
      opacity: 0.9;
      &:hover {
        opacity: 0.5;
      }
    }
  }
}
</style>
