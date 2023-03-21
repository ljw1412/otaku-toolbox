import config from './config'
import proxy from './proxy'
import constants from './constants'
import user from './user'
import {
  title,
  setTitle,
  breakpoints,
  breakpointsKeys,
  errorStore,
  now
} from './assist'

import contra from './contra'
import * as dialog from './dialog'

const props = {
  constants,
  title,
  user,
  config,
  breakpoints,
  breakpointsKeys,
  proxy,
  env: import.meta.env,
  errorStore,
  setTitle,
  now,
  contra,
  dialog
}

type GlobalProps = typeof props
interface MGlobal extends GlobalProps {
  [key: string]: any
}

const mGlobal: MGlobal = props

export function globalAdd(key: string, value: any) {
  mGlobal[key as keyof typeof mGlobal] = value
}

if (mGlobal.env.DEV) {
  const titleStyle = 'color: #fadfa3; background: #030307; padding: 0 4px;'
  console.log('%cenv', titleStyle, import.meta.env)
  console.log('%cglobal', titleStyle, mGlobal)
}

export default mGlobal
