import { DirectiveBinding } from 'vue'
import { safeElementPosition } from '/@/utils/dom'

function xy(el: HTMLElement, x: string, y: string) {
  el.style.left = x
  el.style.top = y
}

interface RippleOptions {
  class?: string
  center?: boolean
}

function isRippleEnabled(value: any): value is true {
  return typeof value === 'undefined' || !!value
}

function calculate(
  e: MouseEvent,
  el: HTMLElement,
  options: RippleOptions = {}
) {
  const { clientX, clientY } = e
  const { width, height, left, top } = el.getBoundingClientRect()
  const tapX = clientX - left
  const tapY = clientY - top

  // 触击的X位置距离元素中心点的距离
  const xToCenter = options.center ? 0 : Math.abs(width / 2 - tapX)
  // 触击的Y位置距离元素中心点的距离
  const yToCenter = options.center ? 0 : Math.abs(height / 2 - tapY)
  // 半径计算 (点击位置到元素最远点的距离)
  const radius = Math.sqrt(
    (xToCenter + width / 2) ** 2 + (yToCenter + height / 2) ** 2
  )

  const centerX = `${(options.center ? width / 2 : tapX) - radius}px`
  const centerY = `${(options.center ? height / 2 : tapY) - radius}px`

  return { radius, centerX, centerY }
}

const ripple = {
  create(e: MouseEvent, el: HTMLElement, options: RippleOptions) {
    if (!el._ripple || !el._ripple.enabled) return

    const rippleWrapper = document.createElement('span')
    const ripple = document.createElement('span')
    rippleWrapper.className =
      'acg-ripple-wrapper' + (options.class ? options.class : '')
    rippleWrapper.appendChild(ripple)

    const { radius, centerX, centerY } = calculate(e, el, options)
    ripple.className = 'acg-ripple'
    ripple.style.width = ripple.style.height = `${radius * 2}px`

    safeElementPosition(el)
    el.appendChild(rippleWrapper)

    ripple.classList.add('acg-ripple-enter')
    ripple.classList.add('acg-ripple-enter-active')
    xy(ripple, centerX, centerY)
    ripple.dataset.activated = String(performance.now())

    setTimeout(() => {
      ripple.classList.remove('acg-ripple-enter')
      ripple.classList.add('acg-ripple-in')
    }, 0)
  },
  remove(el: HTMLElement | null) {
    if (!el || !el._ripple || !el._ripple.enabled) return

    const ripples = el.querySelectorAll('.acg-ripple')

    if (!ripples.length) return

    const ripple = ripples[ripples.length - 1] as HTMLElement

    if (ripple.dataset.isHiding) return
    ripple.dataset.isHiding = 'true'

    // 判断动画剩余时间
    const diff = performance.now() - Number(ripple.dataset.activated)
    const delay = Math.max(500 - diff, 0)

    setTimeout(() => {
      ripple.classList.remove('acg-ripple-in')
      ripple.classList.remove('acg-ripple-enter-active')
      ripple.classList.add('acg-ripple-out')
      ripple.classList.add('acg-ripple-out-active')
      el.blur()
      setTimeout(() => {
        const ripples = el.querySelectorAll('.acg-ripple')
        if (ripples.length <= 1 && el.dataset.previousPosition) {
          el.style.position = el.dataset.previousPosition
          delete el.dataset.previousPosition
        }
        ripple.parentNode && el.removeChild(ripple.parentNode)
      }, 450)
    }, delay)
  }
}

function showRipple(e: MouseEvent) {
  const options: RippleOptions = {}
  const element = e.currentTarget as HTMLElement
  if (!element || !element._ripple) return

  options.center = element._ripple.centered
  if (element._ripple.class) options.class = element._ripple.class
  ripple.create(e, element, options)
}

function hideRipple(e: Event) {
  const element = e.currentTarget as HTMLElement
  if (!element) return
  ripple.remove(element)
}

function removeListeners(el: HTMLElement) {
  el.removeEventListener('mousedown', showRipple)
  el.removeEventListener('mouseup', hideRipple)
  el.removeEventListener('mouseleave', hideRipple)
  el.removeEventListener('dragstart', hideRipple)
}

function updateRipple(
  el: HTMLElement,
  binding: DirectiveBinding,
  isEnabled: boolean
) {
  const enabled = isRippleEnabled(binding.value)
  if (!enabled) {
    ripple.remove(el)
  }
  el._ripple = el._ripple || {}
  el._ripple.enabled = enabled
  const value = binding.value || {}
  if (value.center) {
    el._ripple.centered = true
  }
  if (value.class) {
    el._ripple.class = value.class
  }

  if (enabled && !isEnabled) {
    el.addEventListener('mousedown', showRipple)
    el.addEventListener('mouseup', hideRipple)
    el.addEventListener('mouseleave', hideRipple)
    el.addEventListener('dragstart', hideRipple, { passive: true })
  } else if (!enabled && isEnabled) {
    removeListeners(el)
  }
}

export const Ripple = {
  beforeMount: (el: HTMLElement, binding: DirectiveBinding) => {
    updateRipple(el, binding, false)
  },
  unmounted: (el: HTMLElement) => {
    delete el._ripple
    removeListeners(el)
  },
  updated: (el: HTMLElement, binding: DirectiveBinding) => {
    if (binding.value === binding.oldValue) return
    updateRipple(el, binding, isRippleEnabled(binding.oldValue))
  }
}

export default Ripple
