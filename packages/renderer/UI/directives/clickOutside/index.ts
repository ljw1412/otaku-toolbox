import { DirectiveBinding } from 'vue'
import { typeOf } from '../../utils/assist'

const documentHandler = (el: HTMLElement, value: any) => (e: Event) => {
  if (el.contains(e.target as Node)) return
  if (typeOf(value) === 'function') {
    value(e)
  } else if (typeOf(value) === 'object') {
    const { fn, disabled } = value
    !disabled && fn && fn(e)
  }
}

export const ClickOutside = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el._clickOutside = documentHandler(el, binding.value)
    document.addEventListener('click', el._clickOutside)
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (el._clickOutside) {
      document.removeEventListener('click', el._clickOutside)
      delete el._clickOutside
    }
    el._clickOutside = documentHandler(el, binding.value)
    document.addEventListener('click', el._clickOutside)
  },

  unmounted(el: HTMLElement) {
    if (el._clickOutside) {
      document.removeEventListener('click', el._clickOutside)
      delete el._clickOutside
    }
  }
}

export default ClickOutside
