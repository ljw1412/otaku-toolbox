import { reactive } from 'vue'
import { simpleCopy } from '/@/utils/assist'
import API from '/@/utils/api'
const { apiGet, apiPost, apiDelete, apiPut } = API

const API_TAG_BASE = 'tag'
const API_TAG_GROUP_BASE = 'tag_group'

export const cache = {
  tagGroupList: [] as TagGroup[],
  importantTagGroupList: [] as TagGroup[]
}

/**
 * 请求标签组列表
 * @param important 是否为关键标签组
 * @param forceFetch 不检查缓存，强制请求
 * @returns
 */
export async function listTagGroup(important = false, forceFetch = false) {
  // 使用缓存
  if (!forceFetch) {
    if (important && cache.importantTagGroupList.length) {
      return simpleCopy(cache.importantTagGroupList)
    } else if (!important && cache.tagGroupList.length) {
      return simpleCopy(cache.tagGroupList)
    }
  }

  const query: Record<string, any> = {}
  if (important) query.important = true

  const list: TagGroup[] = await apiGet(API_TAG_GROUP_BASE, { data: query })
  if (important) {
    cache.importantTagGroupList = list
  } else {
    cache.tagGroupList = list
  }

  return simpleCopy(list)
}
