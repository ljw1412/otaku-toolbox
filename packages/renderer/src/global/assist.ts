import { reactive, ref } from 'vue'
import {
  breakpointsAntDesign,
  useBreakpoints,
  toReactive,
  set,
  useNow
} from '@vueuse/core'

type breakpointsMap = typeof breakpointsAntDesign & {
  laptop: number
  mobile: number
}

export const breakpointsKeys = ['laptop', 'mobile'].concat(
  Object.keys(breakpointsAntDesign)
) as [keyof breakpointsMap]

const breakpointsRef = useBreakpoints(breakpointsAntDesign as breakpointsMap)
breakpointsRef.laptop = breakpointsRef.smaller('xl')
breakpointsRef.mobile = breakpointsRef.smaller('md')

export const breakpoints = toReactive(breakpointsRef)

export const title = ref('')

/** @deprecated */
export function setTitle(t: string) {
  set(title, t)
}

export const errorStore: Record<number | string, Error> = reactive({})

export const now = useNow()
// 客户端不需要更新标题
// useTitle(
//   computed(() => {
//     return (
//       (get(title) ? `${get(title)} | ` : '') + import.meta.env.VITE_APP_TITLE
//     )
//   })
// )
