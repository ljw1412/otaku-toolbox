<script setup lang="ts">
import { PropType, ref } from 'vue'

const props = defineProps({
  visibilityHeight: { type: Number, default: 1200 },
  animes: { type: Array as PropType<FormatedBangumiBasic[]>, default: () => [] }
})

const visible = ref(false)

function toBangumiItem(item: FormatedBangumiBasic) {
  const hash = `#anime-${item._id}`
  const el = document.querySelector(hash)
  if (el) {
    el.scrollIntoView({ block: 'start' })
  }
}
</script>

<template>
  <a-tooltip
    v-if="props.animes.length"
    content="新番导览"
    position="right"
    mini
  >
    <acg-fixed-button
      ref="btn"
      always
      target="#anime-main"
      :bottom="140"
      @click="visible = !visible"
    >
      <icon-list :size="20" />
    </acg-fixed-button>
  </a-tooltip>

  <a-drawer
    v-model:visible="visible"
    :width="320"
    :footer="false"
    title="新番导览"
    class="bangumi-index"
  >
    <a-list :bordered="false" size="small" hoverable>
      <a-list-item v-for="item of animes" :key="item._id">
        <a-list-item-meta :title="item.title" @click="toBangumiItem(item)">
          <template #avatar>
            <a-avatar shape="square" :size="64">
              <img
                v-if="item.coverMin"
                :src="compressImage(item.coverMin, 'small')"
                loading="lazy"
                referrerpolicy="no-referrer"
                style="object-fit: cover"
              />
              <span v-else>无封面</span>
            </a-avatar>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-drawer>
</template>

<style lang="scss">
.bangumi-index {
  .arco-list-item {
    cursor: pointer;
    padding: 0 !important;
    top: var(--app-header-height);
  }
}
</style>
