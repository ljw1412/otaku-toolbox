import { reactive, watch } from 'vue'
import { configRef as config } from '../global/config'

export const themes = [
  { name: '蓝色', value: '', type: 'light', variable: '--skin-blue' },
  { name: '青色', value: 'cyan', type: 'light', variable: '--skin-cyan' },
  { name: '红色', value: 'red', type: 'light', variable: '--skin-red' },
  { name: '橙色', value: 'orange', type: 'light', variable: '--skin-orange' },
  { name: '粉色', value: 'pink', type: 'light', variable: '--skin-pink' },
  { name: '绿色', value: 'green', type: 'light', variable: '--skin-green' },
  { name: '水鸭绿', value: 'teal', type: 'light', variable: '--skin-teal' },
  { name: '古铜棕', value: 'brown', type: 'light', variable: '--skin-brown' },
  { name: '兄弟紫', value: 'purple', type: 'light', variable: '--skin-purple' },
  { name: '颐堤蓝', value: 'indigo', type: 'light', variable: '--skin-indigo' },
  {
    name: '低调灰',
    value: 'blue-grey',
    type: 'light',
    variable: '--skin-blue-grey'
  },
  { name: '黑暗', value: 'dark', type: 'dark', variable: '--skin-dark' }
]

const themeData = reactive({ current: config.value.theme, themes })

const themeHelper: ThemeHelper = {
  themes,
  data: themeData,
  init(): void {
    this.update(this.get())
    watch(
      () => config.value.theme,
      () => this.update(this.get())
    )
  },
  // 获取本地存储的主题名称
  get(): string {
    return config.value.theme || ''
  },
  // 更新UI并保存主题名称到本地存储
  set(value = ''): void {
    if (config.value.theme !== value) {
      config.value.themeBefore = this.data.current
    }
    config.value.theme = value
    this.data.current = value
  },
  // 更新UI
  update(value = '') {
    document.body.setAttribute('arco-theme', value)
  }
}

export default themeHelper
