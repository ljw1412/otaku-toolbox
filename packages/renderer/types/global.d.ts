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
  }

  interface TodayBangumiItem {
    title: string
    cover: string
    onairList: BangumiStreaming[]
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
  }

  interface Tag {
    _id: string
    name: string
    order: number
    group: string
    selected?: boolean
  }

  interface TagGroup {
    _id: string
    name: string
    order: number
    multiple: boolean
    tags: Tag[]
  }

  interface AnimeOfBangumi {
    _id: number | string
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
    onair: number
    onairInSteaming: number
  }

  interface SpecialTopic {
    _id?: string
    name: string
    type: string
    code: string
    tags: Tag[]
    isEdit: boolean
    isAdd: boolean
  }
}
