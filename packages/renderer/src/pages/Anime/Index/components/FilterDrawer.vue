<template>
  <acg-drawer v-model="visible"
    top="var(--app-header-height)"
    class="anime-filter-drawer"
    inner-class="anime-filter-drawer__body"
    @open="handleDrawerOpen"
    @closed="handleClosed">
    <template #header>
      <div class="title">
        <span>筛选</span>
        <div title="重置">
          <acg-icon name="reload-circle-outline"
            class="btn-reset"
            :size="24"
            @click="handleReset"></acg-icon>
        </div>
      </div>
    </template>

    <div v-for="group of groupList"
      :key="group._id"
      class="filter-group">
      <h4>{{ group.name }}</h4>
      <div class="filter-tags">
        <div v-for="tag of group.tags"
          :key="tag._id"
          :class="{ active: tag.selected }"
          class="tag"
          @click="handleTagClick(tag,group)">{{ tag.name }}</div>
      </div>
    </div>
    <template #footer>
      <div class="filter-actions">
        <button class="btn-cancel"
          @click="handleCancel">取消</button>
        <button class="btn-ok"
          @click="handleOk">确认</button>
      </div>
    </template>
  </acg-drawer>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'AnimeFilterDrawer',
  props: {
    modelValue: Boolean,
    groupList: { type: Array as PropType<TagGroup[]>, default: () => [] }
  },

  emits: ['update:modelValue', 'submit'],

  data() {
    return {
      bakSelectedTagList: [] as Tag[]
    }
  },

  computed: {
    visible: {
      get(): boolean {
        return this.modelValue
      },
      set(val: boolean) {
        this.$emit('update:modelValue', val)
      }
    },

    allTags(): Tag[] {
      return this.groupList.reduce((arr, group: TagGroup) => {
        arr.push(...group.tags)
        return arr
      }, [] as Tag[])
    },

    selectedTags(): Tag[] {
      return this.allTags.filter(tag => tag.selected)
    }
  },
  methods: {
    handleDrawerOpen() {
      this.bakSelectedTagList = [...this.selectedTags]
    },

    handleClosed() {
      this.restore()
    },

    handleTagClick(tag: Tag, group: TagGroup) {
      group.tags.forEach(tag => {
        tag.selected = false
      })
      tag.selected = true
    },

    unselect() {
      this.selectedTags.forEach(tag => {
        tag.selected = false
      })
    },

    restore() {
      this.unselect()
      this.bakSelectedTagList.forEach(tag => (tag.selected = true))
    },

    handleReset() {
      this.unselect()
      this.groupList.forEach(group => {
        group.tags[0].selected = true
      })
    },

    handleCancel() {
      this.restore()
      this.visible = false
    },

    handleOk() {
      this.$emit(
        'submit',
        this.selectedTags.filter(tag => tag._id)
      )
      this.visible = false
    }
  }
})
</script>

<style lang="scss">
.anime-filter-drawer {
  --filter-actions-height: 36px;

  .title {
    display: flex;
    justify-content: space-between;

    .btn-reset {
      cursor: pointer;
      &:hover {
        opacity: 0.9;
      }

      &:active {
        opacity: 0.7;
      }
    }
  }

  .filter-group {
    .filter-tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      margin-bottom: 10px;

      > .tag {
        cursor: pointer;
        flex-shrink: 0;
        margin-right: 10px;
        margin-bottom: 10px;
        transition: color 0.15s;

        &.active {
          color: var(--app-common-color);
        }
      }
    }
  }

  .filter-actions {
    display: flex;
    width: 100%;
    height: var(--filter-actions-height);

    button {
      flex-grow: 1;
      cursor: pointer;
      height: 100%;
      border: none;

      &:hover {
        opacity: 0.9;
      }

      &:active {
        opacity: 0.7;
      }
    }

    .btn-ok {
      color: #ffffff;
      background-color: var(--app-common-color);
    }
  }
}
</style>
