<template>
  <div class="comic-origin">
    <a-page-header :title="title"
      class="comic-header"
      :show-back="false"> </a-page-header>
    源{{ id }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ComicOrigin',

  props: { id: String },

  computed: {
    title(): string {
      return this.$route.query.title as string
    }
  }
})
</script>

<style lang="scss">
</style>
