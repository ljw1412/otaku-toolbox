<template>
  <div class="app-page-error">
    <a-result :status="status"
      :title="title">
      <template #extra>
        <a-space>
          <a-button type="primary"
            @click="$router.back">返回</a-button>
        </a-space>
      </template>
      <a-typography v-if="error"
        style="background: var(--color-fill-2); padding: 24px;">
        <pre>{{ error.stack }}</pre>
      </a-typography>
    </a-result>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppPageError',

  computed: {
    status() {
      return this.$route.query.status || 'error'
    },
    title() {
      return this.$route.query.message || '出现错误'
    },
    id(): number | string {
      return this.$route.query.id as number | string
    },
    error(): Error | Record<string, any> {
      if (!this.id) return {}
      return this.$global.errorStore[this.id] || {}
    }
  }
})
</script>

<style lang="scss">
</style>
