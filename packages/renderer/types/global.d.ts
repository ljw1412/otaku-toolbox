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
      listener: Funciton
      position: {
        left: number
        top: number
      }
    }
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

  interface OnAirItem {
    url: string
    name: string
    time: string
    from: string
    message?: string
  }

  interface TodayBangumiItem {
    title: string
    cover: string
    onairList: OnAirItem[]
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

  interface AnimeOfBangumi {
    id: number | string
    title: string
    titleJP: string
    titleMore: string[]
    tags: string[]
    desc: string
    copyright: string
    links: { name: string; url: string; message?: string }[]
    streamingPlatforms: OnAirItem[]
    cast: { name: string; entity: string }[]
    staff: { name: string; entity: string }[]
    cast: string[]
    staff: string[]
    coverMin: string
    cover: string[]
    onair: number
    onairInSteaming: number
  }
}
