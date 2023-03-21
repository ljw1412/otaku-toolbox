import { useLocalStorage } from '@vueuse/core'
import { reactive, computed } from 'vue'

const CONTRA_KEY = 'CONTRA_SECRET'
const ContraStoreRef = useLocalStorage(
  CONTRA_KEY,
  {} as Record<string, { expiry: number }>
)

export const contra = reactive({
  isDisplayHandle: false,
  text: '',
  flags: [{ key: 'secret', name: '避难所模式', cheats: '↑↑↓↓←→←→BABA' }]
})

export const contraState = computed(() => {
  return contra.flags.reduce((obj, item) => {
    obj[item.key] = {
      key: item.key,
      name: item.name,
      state: getState(item.key),
      expiry: getExpiry(item.key)
    }
    return obj
  }, {} as Record<string, { key: string; name: string; state: boolean; expiry: number }>)
})

export function getExpiry(key: string) {
  const item = ContraStoreRef.value[key]
  return item ? item.expiry : 0
}

export function getState(key: string) {
  return getExpiry(key) > +new Date()
}

export function setState(key: string, day = 7) {
  ContraStoreRef.value[key] = { expiry: +new Date() + day * 24 * 3600000 }
}

export function removeState(key: string) {
  ContraStoreRef.value[key] && delete ContraStoreRef.value[key]
}

export function resetContra() {
  ContraStoreRef.value = {}
}

function showMessage(name: string) {
  const div = document.createElement('div')
  div.id = 'contra-message'
  div.innerHTML = `<div style="position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.75);backdrop-filter: blur(2px);z-index:8000;">
  <style>
  @keyframes contra-infinite-rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(720deg);
    }
  }
  </style>
  <div style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);">
    <div style="padding: 50px; animation: contra-infinite-rotate 2s linear 0.3s ;">
      <svg aria-hidden="true" style="font-size: 200px;display: inline-block;width: 1em;height: 1em;vertical-align: -0.15em;overflow: hidden;fill: currentColor;stroke: currentColor;">
        <use xlink:href="#icon-flower-outline"></use>
      </svg>
    </div>
    <div style="font-size: 24px;text-align: center;color: #ffffff;">${name}已启动</div>
  </div>
</div>`
  document.body.appendChild(div)
  document.documentElement.style.overflow = 'hidden'
  setTimeout(() => {
    document.body.removeChild(div)
    document.documentElement.style.overflow = ''
  }, 3000)
}

const arrow = { 37: '←', 38: '↑', 39: '→', 40: '↓' } as Record<number, string>
let timer: null | number = null
function listener(e: KeyboardEvent) {
  if (e.keyCode >= 37 && e.keyCode <= 40) {
    contra.text += arrow[e.keyCode]
  } else if (e.keyCode >= 65 && e.keyCode <= 90) {
    contra.text += String.fromCharCode(e.keyCode)
  }
  const flag = contra.flags.find((item) => item.cheats === contra.text)
  if (flag) {
    setState(flag.key)
    showMessage(flag.name)
    console.log(flag)
  }
  if (timer) window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    contra.text = ''
  }, 2000)
}

export function initContra() {
  window.addEventListener('keydown', listener)
}

export default {
  data: contra,
  state: contraState,
  initContra,
  getExpiry,
  getState,
  setState,
  removeState,
  resetContra
}
