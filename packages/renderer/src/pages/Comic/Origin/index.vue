<template>
  <div class="comic-origin">
    <app-area-header class="comic-header"
      :title="title"></app-area-header>
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
