<template>
  <a-modal v-model:visible="mVisible"
    simple
    title="添加直播间"
    width="800px"
    modal-class="add-live-room-dialog">

    <a-select v-model="idType"
      style="width: 30%">
      <a-option value="uid">用户id</a-option>
      <a-option value="roomid">直播间id</a-option>
    </a-select>
    <a-input-search v-model="id"
      style="width: 70%"
      allow-clear
      :placeholder="inputPlaceholder"
      @press-enter="search"
      @search="search"></a-input-search>

    <a-table table-layout-fixed
      size="small"
      class="mt-10"
      :loading="loading"
      :scroll="{y:200}"
      :pagination="false"
      :data="list">
      <template #columns>
        <a-table-column title="直播间id(短id)"
          :width="160">
          <template #cell="{ record }">
            <span>{{ record.room_id }}</span>
            <span v-if="record.short_id">{{ record.short_id }}</span>
          </template>
        </a-table-column>
        <a-table-column title="用户id"
          data-index="uid"
          :width="100"></a-table-column>
        <a-table-column title="用户名称"
          data-index="uname"
          :width="160"></a-table-column>
        <a-table-column title="直播间标题"
          data-index="title"></a-table-column>
        <a-table-column title="操作"
          :width="160">
          <template #cell="{ record }">
            <a-button-group>
              <a-button size="small"
                type="primary"
                :disabled="checkExists(record)"
                @click="action('add',record)">收藏</a-button>
              <a-button status="success"
                size="small"
                @click="action('enter',record)">进入</a-button>
            </a-button-group>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <template #footer>
      <a-button @click="mVisible = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import * as BLive from '../utils/blive'

export default defineComponent({
  name: 'AddLiveRoomDialog',

  props: {
    modelValue: Boolean,
    currentList: {
      type: Array as PropType<Record<string, any>>,
      default: () => []
    }
  },

  emits: ['update:modelValue', 'add', 'enter'],

  data() {
    return {
      idType: 'roomid',
      id: '',
      loading: false,
      list: [] as Record<string, any>[],
      selectedList: []
    }
  },

  computed: {
    mVisible: {
      get() {
        return this.modelValue
      },
      set(val: boolean) {
        this.$emit('update:modelValue', val)
      }
    },

    inputPlaceholder() {
      if (this.idType === 'roomid') {
        return '请输入直播间id(多个以空格分割)'
      } else {
        return '请输入用户id(多个以空格分割)'
      }
    }
  },

  methods: {
    checkExists(record: Record<string, any>) {
      return !!~this.currentList.findIndex(
        item => item.room_id === record.room_id
      )
    },

    async search() {
      const ids = this.id.split(' ').filter(i => i.trim())
      if (!ids.length) return
      this.loading = true

      if (this.idType === 'uid') {
        const data = await this.searchByUids(ids)
        this.list = data
      } else if (this.idType === 'roomid') {
        const data = await this.searchByRoomids(ids)
        this.list = data
      }

      this.loading = false
    },

    async searchByUids(uids: string[]) {
      return Object.values(await BLive.getRoomStatusByUids(uids))
    },

    async searchByRoomids(roomids: string[]) {
      const data = await Promise.all(
        roomids.map(async id => {
          return await BLive.getRoomInfo(id)
        })
      )
      const uids = data.map(item => item.uid)
      return await this.searchByUids(uids)
    },

    action(action: string, record: Record<string, any>) {
      if (action === 'add') {
        this.$emit('add', record)
      } else if (action === 'enter') {
        this.$emit('enter', record)
      }
    }
  }
})
</script>

<style lang="scss">
</style>
