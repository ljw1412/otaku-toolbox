import { Slot, h, VNode } from 'vue'

export function safeSlot(slot?: Slot) {
  return slot && slot()
}

export function createDivWrapper(name: string, slot?: Slot) {
  return h('div', { class: name }, safeSlot(slot))
}

export function isText(e: any) {
  return e === Text
}

export function textWrapper(vnodes: VNode[]) {
  return vnodes.map(item => (isText(item.type) ? h('span', item) : item))
}
