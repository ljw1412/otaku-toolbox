import { useLocalStorage, get } from '@vueuse/core'

export default get(
  useLocalStorage('TOOL_PLUGINS', {
    devUrl: 'http://127.0.0.1:12580',
    list: [] as ToolPluginBase[]
  })
)
