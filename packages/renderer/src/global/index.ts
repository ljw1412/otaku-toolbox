import config from './config'
import { title, setTitle, breakpoints, breakpointsKeys } from './assist'

const mGlobal = {
  title,
  config,
  breakpoints,
  breakpointsKeys,
  env: import.meta.env,
  setTitle
}

if (mGlobal.env.DEV) {
  console.log(mGlobal)
}

export default mGlobal
