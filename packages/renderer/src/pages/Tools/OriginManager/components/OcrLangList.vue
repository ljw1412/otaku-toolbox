<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, toRaw } from 'vue'
import API from '/@/apis/index'
import mGlobal from '/@/global'
import { ipcOff, ipcOn } from '/@/utils/electron'
import { ocrStore } from '/@/stores'
import { nin } from '/@/utils/object'

const langList = reactive(mGlobal.constants.orcLang.map(item => {
  return { ...item, downloading: false }
}))
// 修改响应数据状态
function changeLangState(code: string, key: any, value: any) {
  const langData = langList.find(item => item.code === code)
  if (!langData) return
  // @ts-ignore
  langData[key] = value
}

const loading = ref(false)
const langAction = {
  download: (item: ToolsOCR.LangItem) => {
    changeLangState(item.code, 'downloading', true)
    item.file = toRaw(item.file)
    API.Electron.ocr.lang('download', toRaw(item))
  },
  // hidden: (item: ToolsOCR.LangItem) => {},
  delete: (item: ToolsOCR.LangItem) => {
    const i = ocrStore.list.findIndex(lang => lang.code === item.code)
    if (~i) {
      ocrStore.list.splice(i, 1)
    }
  },
}

function isDownloaded(item: ToolsOCR.LangItem) {
  return ocrStore.list.some(lang => lang.code === item.code)
}

function ocrListener(
  event: Electron.IpcRendererEvent,
  type: string,
  data: Record<string, any>) {
  if (type === 'error') {
    changeLangState(data.code, 'downloading', false)
  } else if (type === 'success') {
    changeLangState(data.code, 'downloading', false)

    if (ocrStore.list.every(item => item.code !== data.code)) {
      ocrStore.list.push(nin(data, 'langData') as ToolsOCR.LangItem)
    }
  }
}

ipcOn('ocr-lang-data', ocrListener)
onBeforeUnmount(() => {
  ipcOff('ocr-lang-data', ocrListener)
})

</script>

<template>
  <div class="ocr-lang-list">
    <a-table
      table-layout-fixed
      :scroll="{ y: 576 }"
      :loading="loading"
      :data="langList"
      :bordered="false"
      :pagination="false"
    >
      <template #columns>
        <a-table-column title="代码" data-index="code" :width="100" />
        <a-table-column title="语言" data-index="language" :width="160" />
        <a-table-column title="简称" data-index="short" :width="100" />
        <a-table-column title="文件" data-index="file" :width="200" />
        <a-table-column title="标记">
          <template #cell="{ record }">
            <a-tag v-if="record.allowVertical">支持垂直</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="操作" :width="180">
          <template #cell="{ record }">
            <a-button-group>
              <a-button
                size="mini"
                :type="isDownloaded(record) ? 'outline' : 'primary'"
                :loading="record.downloading"
                @click="langAction['download'](record)"
              >{{ isDownloaded(record) ? '重下' : '下载' }}</a-button>
              <!-- <a-button type="dashed" size="mini" @click="langAction['hidden'](record)">隐藏</a-button> -->
              <a-button status="danger" size="mini" @click="langAction['delete'](record)">删除</a-button>
            </a-button-group>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style lang="scss">
</style>
