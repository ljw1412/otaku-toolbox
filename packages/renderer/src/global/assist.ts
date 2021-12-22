import { computed, reactive, ref } from 'vue'
import {
  breakpointsAntDesign,
  useBreakpoints,
  toReactive,
  set,
  useNow,
  useTitle,
  get
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
export function setTitle(t: string) {
  set(title, t)
}
useTitle(
  computed(() => {
    return get(title) ? `${get(title)} | ${import.meta.env.VITE_APP_TITLE}` : ''
  })
)

export const errorStore: Record<number | string, Error> = reactive({})

export const now = useNow()
