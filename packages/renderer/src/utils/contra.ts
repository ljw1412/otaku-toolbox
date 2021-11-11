import { reactive } from 'vue'

const key = 'CONTRA_SECRET'
export const contra = reactive({
  text: '',
  flag: false,
  result: '↑↑↓↓←→←→BABA'
})

export function getContraState() {
  let data = localStorage.getItem(key)
  if (data) {
    const json = JSON.parse(data) as Record<string, any>
    const { expiry = 0 } = json
    return expiry > new Date()
  }
  return false
}

export function setContraState(day = 7) {
  const data = JSON.stringify({
    flag: true,
    expiry: +new Date() + day * 24 * 3600000
  })
  localStorage.setItem(key, data)
}

function showMessage() {
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
    <div style="font-size: 24px;text-align: center;color: #ffffff;">秘密模式已启动</div>
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
  if (!contra.flag) contra.flag = contra.text === contra.result
  if (contra.flag) {
    setContraState()
    showMessage()
    window.removeEventListener('keydown', listener)
  }
  if (timer) window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    contra.text = ''
  }, 2000)
}

export function initContra() {
  contra.flag = getContraState()
  if (contra.flag) return
  window.addEventListener('keydown', listener)
}
