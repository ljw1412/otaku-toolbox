<template>
  <a-result v-if="loading || error || empty" :title="title" :status="status" class="acg-api-result">
    <template v-if="!error" #icon>
      <component :is="loading ? 'icon-loading' : 'icon-empty'" :style="{ fontSize: '40px' }"></component>
    </template>
    <template #extra>
      <a-button v-if="error" type="outline" size="small" @click="handleBtnClick">重新连接</a-button>
    </template>
  </a-result>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const titles = ['少女祈祷中……', '努力加载中……', 'nikonikoni……']
const errorTitles = ['与母星的通讯受到干扰！', '服务器貌似遭受怪兽袭击！']

export default defineComponent({
  name: 'AcgApiResult',
  props: {
    loading: { type: Boolean, default: true },
    message: String,
    errorMessage: String,
    error: Boolean,
    empty: Boolean
  },
  emits: ['retry'],
  data() {
    return {
      n: 0,
      n2: 0
    }
  },
  computed: {
    status() {
      if (this.error) return 'error'
      if (!this.loading && this.empty) return 'warning'
      return null
    },

    title(): string {
      if (this.error) {
        return this.errorMessage || errorTitles[this.n2]
      } else if (this.loading) {
        return this.message || titles[this.n]
      } else if (this.empty) {
        return '暂无数据'
      }
      return ''
    }
  },

  created() {
    this.randomNumber()
  },

  methods: {
    randomNumber() {
      this.n = parseInt(Math.random() * (titles.length + 1) + '') % 2
      this.n2 = parseInt(Math.random() * (errorTitles.length + 1) + '') % 2
    },

    handleBtnClick() {
      this.$emit('retry')
    }
  },

  watch: {
    error() {
      this.randomNumber()
    }
  }
})
</script>

<style lang="scss">
</style>
