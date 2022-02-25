import { reactive } from 'vue'
import API from '/@/apis/index'

const data = reactive({
  origins: [] as DataCenter.Rule[],
  nameMap: {} as Record<string, string>,
  async updateOriginList() {
    data.origins = await API.DataCenter.listRules('comic-book')
    data.nameMap = data.origins.reduce((obj, item) => {
      obj[item.namespace] = item.name
      return obj
    }, {} as Record<string, string>)
  }
})

export default data
