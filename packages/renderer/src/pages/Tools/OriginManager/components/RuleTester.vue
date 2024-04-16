<script setup lang="ts" name="RuleTester">
import { onMounted, reactive, ref } from 'vue'
import $API from '/@/apis'
import isURL from 'validator/es/lib/isURL'
import { Message } from '@arco-design/web-vue'

const webviewEl = ref<Electron.WebviewTag>()

const config = reactive({
  url: 'https://www.manhuagui.com/list/',
  items: '.book-list #contList li',
  itemData: {
    title: '.ell a'
  }
})

const view = reactive({
  el: webviewEl,
  url: 'about:blank',
  title: '空白页',
  isLoading: false
})

const isNotURL = ref(false)

function navigate(targetUrl = config.url) {
  targetUrl = targetUrl.trim()
  if (!isURL(targetUrl)) {
    isNotURL.value = true
    return
  }
  view.el!.loadURL(targetUrl)
  view.url = targetUrl
}

async function locate() {
  if (!config.items) {
    Message.warning('请填写父级元素选择器')
    return
  }
  console.log('=========执行定位=========')
  const items = await view.el?.executeJavaScript(
    `(function(){
      Array.from(document.querySelectorAll('[data-otaku-toolbox="parent"]'))
        .forEach(
          (el) => {
            el.removeAttribute('data-otaku-toolbox')
          }
        )
      const list = Array.from(
        document.querySelectorAll('${config.items}')
      )
      const data = list.map(item => item.outerHTML)
      list.forEach(
        (el, index) => {
          el.setAttribute('data-otaku-toolbox', 'parent')
          if (index === 0) {
            el.scrollIntoView()
          }
        }
      )
      return data
    })()`
  )
  console.log('items:', items)
  if (config.itemData.title) {
    const titles = await view.el?.executeJavaScript(
      `(function(){
      Array.from(document.querySelectorAll('[data-otaku-toolbox="title"]'))
        .forEach(
          (el) => {
            el.removeAttribute('data-otaku-toolbox')
          }
        )
      const list = Array.from(
        document.querySelectorAll('${config.items} ${config.itemData.title}')
      )
      const data = list.map(item => item.outerHTML)
      list.forEach(
        (el, index) => {
          el.setAttribute('data-otaku-toolbox', 'title')
          if (index === 0) {
            el.scrollIntoView()
          }
        }
      )
      return data
    })()`
    )
    console.log('titles:', titles)
    console.log('=========定位结束=========')
  }
}

function toggleDevTools() {
  if (view.el!.isDevToolsOpened()) {
    view.el!.closeDevTools()
  } else {
    view.el!.openDevTools()
  }
}

function initWebview() {
  if (!view.el) {
    Message.warning('浏览器视窗加载失败！')
    return
  }
  view.el.addEventListener('page-title-updated', (e) => {
    view.title = e.title
  })

  view.el.addEventListener('did-start-loading', (e) => {
    view.isLoading = true
  })

  view.el.addEventListener('did-finish-load', (e) => {
    view.url = view.el!.getURL()
    view.el!.executeJavaScript(`(function(){
    const style = document.createElement('style')
    style.setAttribute('name','otaku-toolbox')
    style.innerText = '[data-otaku-toolbox="parent"]{background-color:rgba(69,194,138,0.5) !important;}[data-otaku-toolbox="title"]{background-color:rgba(254,72,0,0.5) !important;}'
    document.head.appendChild(style)
})()`)
    view.isLoading = false
  })
}

onMounted(() => {
  initWebview()
})
</script>

<template>
  <div class="rule-tester">
    <div class="test-container">
      <div class="left">
        <a-descriptions
          :column="1"
          size="small"
          :label-style="{ 'text-align': 'right' }"
        >
          <a-descriptions-item label="地址">
            <a-input-search
              v-model="config.url"
              placeholder="网页地址"
              search-button
              :error="isNotURL"
              :loading="view.isLoading"
              :title="view.title"
              @press-enter="navigate()"
              @search="navigate()"
              @input="isNotURL = false"
            >
              <template #button-icon>
                <icon-arrow-right />
              </template>
            </a-input-search>
          </a-descriptions-item>
          <a-descriptions-item label="父级元素">
            <a-input
              v-model="config.items"
              placeholder="父级元素选择器"
              @press-enter="locate()"
            />
          </a-descriptions-item>
          <a-descriptions-item label="标题">
            <a-input
              v-model="config.itemData.title"
              placeholder="标题元素"
              @press-enter="locate()"
            />
          </a-descriptions-item>
          <a-button type="primary" long @click="locate">定位</a-button>
        </a-descriptions>
      </div>

      <div class="right">
        <a-input :model-value="view.url" size="small" readonly>
          <template #prefix><icon-link /></template>
          <template #suffix>
            <a-space size="mini">
              <icon-loading v-if="view.isLoading" />
              <icon-computer
                class="cursor-pointer"
                title="开发者工具"
                @click="toggleDevTools"
              />
            </a-space>
          </template>
        </a-input>
        <webview ref="webviewEl" src="about:blank"></webview>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.rule-tester {
  height: calc(100% - 48px);
  .test-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(auto, 1fr));
    gap: 8px;
    height: 100%;
    overflow: hidden;

    .left {
      padding-left: 12px;
    }
  }

  .arco-input-group {
    width: 100%;
  }

  webview {
    height: calc(100% - 28px);
    background-color: var(--color-bg-4);
  }
}
</style>
