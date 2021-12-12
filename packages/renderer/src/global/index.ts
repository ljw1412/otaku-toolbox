import config from './config'
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
  env: import.meta.env,
  errorStore,
  setTitle,
  now
}

if (mGlobal.env.DEV) {
  console.log(mGlobal)
}

export default mGlobal
