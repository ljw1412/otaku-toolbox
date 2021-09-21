import { DirectiveBinding, ObjectDirective } from 'vue'

function createListener(el: HTMLElement) {
  return function() {
    if (el._watchScroll) {
      const { position } = el._watchScroll
      position.top = el.scrollTop
      position.left = el.scrollLeft
    }
  }
}

export const WatchScroll = {
  beforeMount: (el: HTMLElement, binding: DirectiveBinding) => {
    const listener = createListener(el)
    el._watchScroll = {
      listener,
      position: { left: 0, top: 0 }
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
    console.log('updated', [el], el._watchScroll, binding)
    if (el._watchScroll) {
      el.scrollTo(el._watchScroll.position)
    }
  }
}

export default WatchScroll as ObjectDirective
