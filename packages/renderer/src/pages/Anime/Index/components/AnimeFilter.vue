<template>
  <a-descriptions :data="data" layout="vertical" class="index-anime-filter" :column="1">
    <template #title>
      <div class="filter-header bg-app">
        <div class="filter-title">
          <div>筛选器</div>
          <div>
            <a-button v-show="currentKeyword || filterTags.length" @click="reset">重置</a-button>
          </div>
        </div>
        <a-input-search
          v-model="keyword"
          size="large"
          allow-clear
          :max-length="50"
          @search="search(keyword)"
          @press-enter="search(keyword)"
        ></a-input-search>
        <anime-filter-status
          closable
          :tags="filterTags"
          :keyword="currentKeyword"
          @remove-keyword="search('')"
          @remove-tag="handleFilterTagRemove"
        ></anime-filter-status>
      </div>
    </template>
    <template #value="{ value }">
      <a-space wrap size="mini">
        <a-tag
          v-for="tag of value"
          checkable
          :color="tag.group === 'type' ? 'green' : 'arcoblue'"
          :checked="tag.selected"
          :key="tag._id"
          @check="handleTagCheck(tag, value)"
        >{{ tag.name }}</a-tag>
      </a-space>
    </template>
  </a-descriptions>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { statusData, typeData } from '../stores/filterStore'
import AnimeFilterStatus from './AnimeFilterStatus.vue'

export default defineComponent({
  name: 'IndexAnimeFilter',

  components: {
    AnimeFilterStatus
  },

  props: {
    groupList: { type: Array as PropType<TagGroup[]>, default: () => [] },
    currentKeyword: { type: String, default: '' }
  },

  emits: ['change'],

  data() {
    return {
      keyword: ''
    }
  },

  computed: {
    data(): { label: string; value: Tag[] }[] {
      const data = this.groupList.map(group => ({
        label: group.name,
        value: group.tags
      }))
      if (data.length) {
        data.unshift({ label: '种类', value: typeData }, { label: '状态', value: statusData })
      }
      return data
    },

    allTags(): Tag[] {
      return typeData.concat(statusData,
        this.groupList.reduce((arr, group: TagGroup) => {
          arr.push(...group.tags)
          return arr
        }, [] as Tag[])
      )
    },

    selectedTags(): Tag[] {
      return this.allTags.filter(tag => tag.selected)
    },

    filterTags(): Tag[] {
      return this.selectedTags.filter(tag => tag._id)
    }
  },

  methods: {
    search(keyword: string) {
      this.$emit('change', { keyword })
    },

    reset() {
      this.allTags.forEach(tag => {
        tag.selected = !tag._id
      })
      this.$emit('change', { keyword: '', tags: this.filterTags })
    },

    handleFilterTagRemove(tag: Tag) {
      const groupTagList = this.allTags.filter(t => t.group === tag.group)
      groupTagList.forEach(tag => {
        tag.selected = !tag._id
      })
      this.$emit('change', { tags: this.filterTags })
    },

    handleTagCheck(tag: Tag, groupTags: Tag[]) {
      if (tag.selected) return
      groupTags.forEach(tag => {
        tag.selected = false
      })
      tag.selected = true
      this.$emit('change', { tags: this.filterTags })
    }
  }
})
</script>

<style lang="scss">
.index-anime-filter {
  height: 100%;

  .arco-descriptions-title {
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .arco-descriptions-body {
    .arco-tag {
      cursor: pointer;
      &:not(.arco-tag-checked):hover {
        background-color: var(--color-fill-1);
      }
    }
  }

  .filter-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    font-size: 16px;
  }
}
</style>
