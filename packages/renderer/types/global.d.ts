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

  type MyFetch = <T = any>(api: string, init?: MyRequestInit) => Promise<T>

  interface MyRequestInit extends RequestInit {
    data?: BodyInit | Record<string, any>
    query?: string | Record<string, any>
    transform?: (resp: Response) => any
    timeout?: number
    // 不显示错误弹窗
    silent?: boolean
    resultType?: 'json' | 'text' | string
  }

  declare namespace Common {
    interface Page {
      index: number
      size: number
    }

    interface PageWithTotal extends Page {
      total: number
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

  interface BangumiPerson {
    _id?: string
    entity: string
    name: string
  }

  interface BangumiLink {
    _id?: string
    name: string
    url: string
    type?: string
    icon?: string
    from?: string
    message?: string
  }

  interface BangumiStreaming extends BangumiLink {
    hide: boolean
    from: string
    time: string
    region: string
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
    type: string
    typeInSeries: string
    episodes: number
    status: number
    tags: Tag[]
    tips: string
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
    mark: string[]
    rating: { score: number; count: number }
    ratingSite: Record<string, any>
  }

  interface FormatedBangumiBasic extends BangumiBasic {
    statusCH: string
    formatOnair: { 24: FormatedAnimeDatetime; 30: FormatedAnimeDatetime }
    markState: Record<string, boolean>
  }

  interface BangumiBasicGroup {
    title?: string
    list: FormatedBangumiBasic[]
  }

  interface SpecialTopic {
    _id?: string
    name: string
    current: boolean
    type: string
    code: string
    cover: string
    tags: Tag[]
    collecting: boolean

    isEdit: boolean
    isAdd: boolean
  }

  interface BaseUserInfo {
    _id: string
    avatar: string
    nickname: string
    role: string
    username: string
    email: string
    experience: number
    points: number
    level: number
    nextLevelExp: number
    regtime: string
    lastLoginDateTime: string
    services: { wechat: boolean }
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

  interface Series {
    _id: string
    title: string
    bangumis: BangumiBasic[]
  }

  interface MediaReviewItems {
    art: number
    sound: number
    story: number
    characters: number
  }

  interface MediaReview {
    _id?: string
    user: BaseUserInfo
    score: number
    items: MediaReviewItems
    content: string
    createTime?: string
    lastUpdateTime?: string
  }

  interface EpisodeResource {
    _id?: string
    url: string
    name: string
    from: string
    type: string
    createTime: string
  }

  interface BaseComment {
    _id?: string
    user: BaseUserInfo
    content: string
    date: string
  }

  interface WithRelativeTime {
    relativeTime: string
  }

  interface EpisodeComment extends BaseComment, WithRelativeTime {}

  interface EpisodeReview extends BaseComment, WithRelativeTime {
    score: number
  }

  interface Episode {
    _id: string
    ep: number
    title: string
    oTitle: string
    desc: string
    airDate: string | Date
    comments: EpisodeComment[]
    reviews: EpisodeReview[]
    resources: EpisodeResource[]
    userReview?: EpisodeReview
    state: { comment: number; review: number; score: number }
  }

  interface EpisodesInfo {
    totalCount: number
    episodeList: Episode[]
  }

  interface Favourite {
    user?: string
    bangumi: BangumiBasic
    status?: number
    progress?: number
    createTime?: string | Date
    lastUpdateTime?: string | Date
  }

  interface WatchRecord {
    _id: string
    user: { _id: string; avatar: string; nickname: string }
    bangumi: { _id: string; title: string; coverMin: string }
    type: string
    status: number
    progress: number
    createTime: string | Date
  }

  interface Character {
    _id: string
    bangumi: string
    name: string
    oname: string
    images: {
      origin: string
      large: string
      grid: string
    }
    desc: string
    isMain: boolean
    cv: { _id: string; name: string; note: string }[]
    info: { _id: string; key: string; value: string; important: boolean }[]
    order: number
    bgmtvId?: number
  }

  interface Gift {
    _id?: string
    name: string
    mode: string
    code: string
    enabled: boolean
    createTime: Date | string
    expireTo: Date | string
    type: string
    number: number
    total: number
    remained: number
    limitLevel: number
  }

  interface GiftRecord {
    _id: string
    gift: Gift
    user: BaseUserInfo
    datetime: Date | string
  }

  interface News {
    _id: string
    mode: 'self' | 'out'
    type: 'anime' | 'comic' | 'game' | 'novel' | string
    title: string
    cover: string
    oid: string
    from: string
    fromName: string
    url: string
    content: string
    datetime: Date | string
    author: BaseUserInfo
  }
}
