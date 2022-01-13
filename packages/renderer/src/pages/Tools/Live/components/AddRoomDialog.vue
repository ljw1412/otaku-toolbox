<template>
  <a-modal v-model:visible="mVisible"
    simple
    title="添加直播间"
    width="800px"
    modal-class="add-live-room-dialog"
    :ok-button-props="{disabled: !list.length}"
    @ok="handleOk">

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
      :columns="columns"
      :data="list"></a-table>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as BLive from '../utils/blive'

export default defineComponent({
  name: 'AddLiveRoomDialog',

  props: { modelValue: Boolean },

  emits: ['update:modelValue', 'add'],

  data() {
    return {
      idType: 'roomid',
      id: '',
      loading: false,
      columns: [
        {
          title: '直播间id(短id)',
          // dataIndex: 'room_id',
          render({ record }: { record: Record<string, any> }) {
            const { room_id, short_id } = record
            let text = '' + room_id
            if (short_id) {
              text += `(${short_id})`
            }
            return text
          },
          width: 160
        },
        {
          title: '用户id',
          dataIndex: 'uid',
          width: 120
        },
        {
          title: '用户名称',
          dataIndex: 'uname',
          width: 160
        },
        {
          title: '直播间标题',
          dataIndex: 'title'
        }
      ],
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

    handleOk() {
      this.$emit('add', this.list)
    }
  }
})
</script>

<style lang="scss">
</style>
