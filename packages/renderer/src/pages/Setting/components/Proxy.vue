<template>
  <div class="setting-proxy">
    <a-typography-title :heading="6"
      style="margin-top: 0;">代理管理</a-typography-title>
    <a-table table-layout-fixed
      size="small"
      :hoverable="false"
      :columns="columns"
      :data="proxyList"
      :pagination="false"
      :row-selection="rowSelection"
      @row-click="handleTableRowClick">
      <template #footer>
        <a-button-group>
          <a-button type="primary"
            size="small"
            @click="handleProxyAction('add')">添加</a-button>
          <a-button :disabled="!isSelected"
            size="small"
            @click="handleProxyAction('edit')">修改</a-button>
          <a-button :disabled="!isSelected"
            status="danger"
            size="small"
            @click="handleProxyAction('del')">删除</a-button>
        </a-button-group>
      </template>
    </a-table>
    <a-modal v-model:visible="isDisplayProxyDialog"
      title="代理添加/修改"
      :mask-closable="false"
      @ok="handleProxyEditorOk"
      @cancel="handleProxyEditorCancel">
      <a-form :model="proxy"
        size="small">
        <a-form-item field="name"
          label="代理名称">
          <a-input v-model="proxy.name" />
        </a-form-item>
        <a-form-item field="host"
          label="服务器">
          <a-input v-model="proxy.host"
            style="width:40%" />
          <a-button type="text"
            size="mini"
            style="margin-left: 4px;"
            @click="proxy.host = '127.0.0.1'">设为本机</a-button>
        </a-form-item>
        <a-form-item field="port"
          label="端口">
          <a-input v-model="proxy.port"
            style="width: 80px;" />
        </a-form-item>
        <a-form-item field="type"
          label="类型">
          <a-radio-group v-model="proxy.type">
            <a-radio value="HTTP">HTTP</a-radio>
            <a-radio value="SOCKS5">SOCKS5</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const defaultProxy = { name: '', host: '', port: '80', type: 'HTTP' }

export default defineComponent({
  name: 'SettingProxy',

  data() {
    return {
      rowSelection: {
        type: 'radio',
        selectedRowKeys: [] as string[]
      },
      currentProxy: {} as ProxyItem,
      proxy: { name: '', host: '', port: '', type: 'HTTP' } as ProxyItem,
      isDisplayProxyDialog: false,
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          render: this.renderCell
        },
        {
          title: '服务器',
          dataIndex: 'host'
        },
        {
          title: '端口',
          dataIndex: 'port'
        },
        {
          title: '类型',
          dataIndex: 'type'
        }
      ]
    }
  },

  computed: {
    isSelected(): boolean {
      return !!this.rowSelection.selectedRowKeys.length
    },
    proxyList() {
      return this.$global.proxy
    }
  },

  methods: {
    handleTableRowClick(record: ProxyItem) {
      this.rowSelection.selectedRowKeys = [record.key]
      this.currentProxy = record
      this.proxy = { ...record }
      console.log(record)
    },

    handleProxyAction(action: 'add' | 'edit' | 'del') {
      if (action === 'del') {
        const index = this.proxyList.findIndex(
          item => item.key === this.currentProxy.key
        )
        if (~index) {
          this.proxyList.splice(index, 1)
        }
        return
      }

      if (action === 'add') {
        this.proxy = { ...defaultProxy } as ProxyItem
      }
      this.isDisplayProxyDialog = true
    },
    handleProxyEditorOk() {
      if (this.proxy.key) {
        Object.assign(this.currentProxy, this.proxy)
      } else {
        this.proxyList.push({ ...this.proxy, key: +new Date() + '' })
        console.log(this.proxyList, this.proxy)
      }
    },
    handleProxyEditorCancel() {}
  }
})
</script>

<style lang="scss">
</style>
