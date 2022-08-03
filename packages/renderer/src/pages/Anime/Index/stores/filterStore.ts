import { reactive } from 'vue'

export const typeData: Tag[] = reactive([
  {
    _id: '',
    name: '全部',
    selected: true,
    group: 'type'
  },
  {
    _id: 'TV',
    name: '正片',
    group: 'type',
    selected: false
  },
  {
    _id: 'Movie',
    name: '电影',
    group: 'type',
    selected: false
  }
])

export const statusData: Tag[] = reactive([
  {
    _id: '',
    name: '全部',
    selected: true,
    group: 'status'
  },
  {
    _id: '0',
    name: '计划',
    group: 'status',
    selected: false
  },
  {
    _id: '1',
    name: '连载',
    group: 'status',
    selected: false
  },
  {
    _id: '2',
    name: '完结',
    group: 'status',
    selected: false
  }
])
