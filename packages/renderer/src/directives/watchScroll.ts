import { DirectiveBinding, ObjectDirective } from 'vue'

function createListener(el: HTMLElement) {
  return function() {
    if (el._watchScroll) {
      const { name, positions } = el._watchScroll
      positions[name] = { left: el.scrollLeft, top: el.scrollTop }
    }
  }
}

// TODO position 改造为 positions

export const WatchScroll = {
  beforeMount: (el: HTMLElement, binding: DirectiveBinding) => {
    const name = binding.value || 'default'
    const listener = createListener(el)
    el._watchScroll = {
      name,
      listener,
      positions: { [name]: { left: 0, top: 0 } }
    }
    el.addEventListener('scroll', listener)
    console.log('beforeMount', el, binding)
  },
  unmounted: (el: HTMLElement) => {
    console.log('unmounted', el)
    if (el._watchScroll) {
      el.removeEventListener('scroll', el._watchScroll.listener)
      delete el._watchScroll
    }
  },
  updated: (el: HTMLElement, binding: DirectiveBinding) => {
    const name = binding.value || 'default'

    console.log('updated', [el], el._watchScroll, binding)
    if (el._watchScroll) {
      el._watchScroll.name = name
      const { scrollTop, scrollLeft } = el
      const position = el._watchScroll.positions[name] || { top: 0, left: 0 }
      const { top, left } = position
      if (scrollTop === top && scrollLeft === left) return
      el.scrollTo(position)
    }
  }
}

export default WatchScroll as ObjectDirective
