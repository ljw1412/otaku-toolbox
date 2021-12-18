import config from './config'
import proxy from './proxy'
import {
  title,
  setTitle,
  breakpoints,
  breakpointsKeys,
  errorStore,
  now
} from './assist'

const mGlobal = {
  title,
  config,
  breakpoints,
  breakpointsKeys,
  proxy,
  env: import.meta.env,
  errorStore,
  setTitle,
  now
}

if (mGlobal.env.DEV) {
  console.log(mGlobal)
}

export default mGlobal
