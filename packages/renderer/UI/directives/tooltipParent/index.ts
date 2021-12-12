import { createSingleton, Instance, Props } from 'tippy.js'

const overrides = [
  'placement',
  'animation',
  'arrow',
  'followCursor',
  'interactive',
  'maxWidth',
  'offset',
  'appendTo',
  'theme',
  'trigger',
  'hideOnClick',
  'role',
  'delay',
  'duration',
  'disabled',
  'zIndex'
] as (keyof Props)[]

function create(el: HTMLElement) {
  destroy(el)
  const instances = Array.from(el.children)
    .map(el => (el as HTMLElement)._tooltip)
    .filter(i => !!i) as Instance<Props>[]
  el._singletonTooltip = createSingleton(instances, {
    overrides,
    moveTransition: 'transform 0.2s ease-out'
  })
}

function destroy(el: HTMLElement) {
  if (el._singletonTooltip) {
    el._singletonTooltip.destroy()
    delete el._singletonTooltip
  }
}

export const TooltipParent = {
  mounted: (el: HTMLElement) => {
    create(el)
  },
  updated: (el: HTMLElement) => {
    create(el)
  },
  unmounted: (el: HTMLElement) => {
    destroy(el)
  }
}

export default TooltipParent
