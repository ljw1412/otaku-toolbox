<template>
  <a-card class="bangumi-filter" :bordered="false">
    <slot name="header"></slot>

    <div style="margin-bottom: -4px;">
      <a-space wrap size="mini" class="filter-group">
        <span class="filter-title">分组：</span>
        <a-radio-group v-model="groupBy" type="button" size="small" @change="handleGroupByChange">
          <a-radio
            v-for="group of groupList"
            :key="group.value"
            :value="group.value"
          >{{ group.label }}</a-radio>
        </a-radio-group>
      </a-space>

      <a-space
        v-for="tagGroup of tagGroupList"
        :key="tagGroup._id"
        wrap
        size="mini"
        class="filter-group"
      >
        <span class="filter-title">{{ tagGroup.name }}：</span>
        <template v-for="tag of tagGroup.tags" :key="tag._id">
          <a-tag
            v-if="tag._id === 'all' || tagCount[tag._id]"
            checkable
            :checked="tag.selected"
            :color="tag.selected ? tag.color : undefined"
            @check="handleTagCheck(tag, tagGroup)"
          >
            <span>{{ tag.name }}</span>
            <template v-if="tagCount[tag._id] !== undefined">({{ tagCount[tag._id] }})</template>
          </a-tag>
        </template>
      </a-space>
    </div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'AnimeBangumiFilter',

  props: {
    animes: { type: Array as PropType<BangumiBasic[]>, default: () => [] }
  },

  emits: ['change', 'group-by-change'],

  data() {
    return {
      groupList: [
        { label: '默认', value: '' },
        { label: '首播日期', value: 'onair' },
        { label: '每周星期', value: 'day' }
      ],
      groupBy: '',
      tagGroupList: [] as TagGroup[]
    }
  },

  computed: {
    selectedTagList(): Tag[] {
      let list: Tag[] = []
      this.tagGroupList.forEach(tagGroup => {
        if (tagGroup.tags[0].selected) return
        list = list.concat(tagGroup.tags.filter(tag => tag.selected))
      })
      return list
    },
    tagCount() {
      const countObj: Record<string, any> = {}
      this.animes.forEach(anime => {
        anime.tags.forEach(tag => {
          if (!countObj[tag._id]) {
            countObj[tag._id] = 1
          } else {
            countObj[tag._id]++
          }
        })
      })
      return countObj
    }
  },

  watch: {
    animes() {
      this.tagGroupList.forEach(item => {
        item.tags.forEach(tag => {
          tag.selected = true
        })
      })
      this.$emit('change', this.selectedTagList)
    }
  },

  mounted() {
    this.fetchTagGroupList()
  },

  methods: {
    async fetchTagGroupList() {
      const data: TagGroup[] = await this.$API.Tag.listTagGroup(true)
      this.tagGroupList = data.filter(tagGroup => tagGroup.tags.length)
      this.tagGroupList.forEach(item => {
        item.tags.unshift({ _id: 'all', name: '全部' })
        item.tags.forEach(tag => {
          tag.selected = true
        })
      })
    },

    handleGroupByChange() {
      this.$emit('group-by-change', this.groupBy)
    },

    handleTagCheck(tag: Tag, tagGroup: TagGroup) {
      tagGroup.tags.forEach(t => {
        t.selected = tag._id === 'all'
      })
      tag.selected = true
      this.$emit('change', this.selectedTagList)
    }
  }
})
</script>

<style lang="scss">
.bangumi-filter {
  padding-left: 4px;
  .arco-space {
    display: flex;
  }
  .filter-group:not(:last-child) {
    margin-bottom: 8px;
  }

  .filter-title {
    display: inline-block;
    line-height: 24px;
    vertical-align: top;
  }
  .arco-tag {
    cursor: pointer;
  }
}
</style>
