import { CreateSingletonInstance, Instance } from 'tippy.js'

declare global {
  interface HTMLElement {
    _tooltip?: Instance
    _singletonTooltip?: CreateSingletonInstance
    _clickOutside?: EventListenerOrEventListenerObject
    _ripple?: {
      enabled?: boolean
      centered?: boolean
      class?: string
      circle?: boolean
      touched?: boolean
      isTouch?: boolean
    }
    _watchScroll?: {
      name: string
      listener: Funciton
      positions: {
        default?: { left: number; top: number }
        [key: string]: { left: number; top: number }
      }
    }
  }

  type MyFetch = (api: string, init?: MyRequestInit) => Promise<any>

  interface MyRequestInit extends RequestInit {
    data?: BodyInit | Record<string, any>
    query?: string | Record<string, any>
    timeout?: number
  }

  interface ThemeItem {
    name: string
    value: string
    type: string
    variable: string
  }

  interface ThemeData {
    current: string
    themes: ThemeItem[]
  }

  type ThemeHelper = {
    themes: ThemeItem[]
    data: ThemeData
    init(): void
    get(): string
    set(value?: string): void
    update(value?: string): void
  }

  interface PageNavigationItem {
    name: string
    to?: RouteLocationRaw
    url?: string
  }

  interface BangumiPerson {
    _id?: string
    entity: string
    name: string
  }

  interface BangumiLink {
    _id?: string
    name: string
    url: string
    message?: string
  }

  interface BangumiStreaming extends BangumiLink {
    hide: boolean
    from: string
    time: string
    region: string
  }

  interface BangumiPerson {
    _id?: string
    entity: string
    name: string
  }

  interface FormatedAnimeDatetime {
    years: string
    time: string
    date: string
    dateCH: string
    datetime: string
    day: number
    dayCH: string
    fullDate: string
    fullDateCH: string
    unix: number
  }

  interface Tag {
    _id: string
    name: string
    color?: string
    count?: number
    order?: number
    group?: string
    selected?: boolean
  }

  interface TagGroup {
    _id: string
    name: string
    order: number
    multiple: boolean
    tags: Tag[]
  }

  interface BangumiBasic {
    _id: string
    title: string
    titleOriginal: string
    titleMore: string[]
    tags: Tag[]
    desc: string
    copyright: string
    links: BangumiLink[]
    streamingPlatforms: BangumiStreaming[]
    cast: BangumiPerson[]
    staff: BangumiPerson[]
    coverMin: string
    cover: string[]
    onair: number | Date | string
    endTime: number | Date | string
    day: number
    isSubTagMatched?: boolean
    ratingSite: Record<string, any>
    mark: string[]
    markState: Record<string, boolean>
  }

  interface BangumiBasicWithTime extends BangumiBasic {
    formatOnair: { 24: FormatedAnimeDatetime; 30: FormatedAnimeDatetime }
  }

  interface BangumiBasicGroup {
    title?: string
    list: BangumiBasic[]
  }

  interface SpecialTopic {
    _id?: string
    name: string
    type: string
    code: string
    tags: Tag[]
    isEdit: boolean
    isAdd: boolean
    current: boolean
  }

  interface Banner {
    _id?: string
    // 标题
    title: string
    // 描述
    desc: string
    // 封面
    cover: string
    // 开始时间
    startTime: string | Date
    // 结束时间
    endTime: string | Date
    // 是否启用
    enabled: boolean
    // 哪里，比如:'home','news'
    where: string
    // 路由模式
    routeMode: string
    // 地址
    url: string
    // vue路由
    vueRoute: Record<string, any>

    expired?: boolean
    bgColor?: string
  }

  interface ProxyItem {
    key: string
    name: string
    host: string
    port: string
    type: 'HTTP' | 'SOCKS5'
    username?: string
    password?: string
  }

  interface ComicItem {
    id?: string
    key?: string
    title: string
    cover: string
    origin?: string
    list?: { name: string; path: string }[]
    pageOption?: Record<string, any>
  }

  interface ComicHistory {
    key: string
    index: number
    path: string
    ppath: string
    name: string
    namespace?: string
    title?: string
    cover?: string
    time: Date
  }

  interface BaseLiveInfo {
    uid: number
    room_id: number
  }

  interface LiveMonitor {
    id: number | string
    name: string
    mode: number
    roomList: LiveInfo[]
    roomConfigList: LiveRoomConfig[]
  }

  interface LiveInfo extends BaseLiveInfo {
    uname: string
    short_id: number
    live_status: number
    face: string
    cover_from_user: string
    keyframe: string
  }

  interface LiveRoomDanmakuConfig {
    aside: boolean
    showBoard: boolean
    bg: string
    opacity: number
    blur: number
    x: number
    y: number
  }

  interface LiveRoomConfig {
    qn: number
    volume: number
    showDanmaku: boolean
    danmaku: LiveRoomDanmakuConfig
  }
}
