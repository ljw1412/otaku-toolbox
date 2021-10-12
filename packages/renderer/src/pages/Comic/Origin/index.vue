<template>
  <div class="comic-origin">
    源{{ id }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ComicOrigin',

  props: { id: String }
})
</script>

<style lang="scss">
</style>
