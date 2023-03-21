<template>
  <header class="week-bangumi-header">
    <acg-area-header>
      <template #left>
        <h3 class="title">一周放送</h3>
        <a-badge :text="gmt" style="font-size: 0" />
      </template>
      <template #right>
        <span style="text-align: right" v-html="dayDate"></span>
      </template>
    </acg-area-header>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WeekBangumiHeader',

  props: { date: { type: Date, default: () => new Date() } },

  computed: {
    gmt() {
      const timezoneOffset = -this.date.getTimezoneOffset() / 60
      return `GMT${timezoneOffset < 0 ? '' : '+'}${timezoneOffset}`
    },
    dayDate(): string {
      return this.$dayjs(this.date).format('dddd<br />YYYY年MM月DD日')
    }
  }
})
</script>

<style lang="scss">
.week-bangumi-header {
  width: 100%;

  .acg-area-header {
    position: sticky;
    left: 0;
    padding-left: 16px;
    padding-right: 16px;
    box-sizing: border-box;
    width: var(--week-bangumi-header-width);
  }

  .title {
    margin-right: 4px;
  }
}
</style>
