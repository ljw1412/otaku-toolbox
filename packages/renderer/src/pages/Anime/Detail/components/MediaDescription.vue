<template>
  <info-group title="简介">
    <a-card :bordered="false">
      <p class="description" v-html="bangumi.desc"></p>
    </a-card>
  </info-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InfoGroup from './InfoGroup.vue'
import detailMixin from '../utilities/mixin'

export default defineComponent({
  name: 'MediaDescription',

  components: { InfoGroup },

  mixins: [detailMixin],
})
</script>

<style lang="scss"></style>
