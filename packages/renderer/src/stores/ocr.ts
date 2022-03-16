import { useLocalStorage, get } from '@vueuse/core'

export default get(
  useLocalStorage('OCR_CONFIG', {
    defaultLang: 'chi_sim',
    list: [] as ToolsOCR.LangItem[]
  })
)
