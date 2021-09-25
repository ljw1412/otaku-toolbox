import { h, defineComponent, VNode } from 'vue'
import tippy, { followCursor, Instance, MultipleTargets } from 'tippy.js'
import PopupManager from '../utils/popup-manager'
import { safeSlot, textWrapper } from '../utils/vue-helper'



function getTrigger(trigger: string) {
  return trigger === 'hover' ? 'mouseenter' : trigger
}

// 如果属性值包含boolan和其他类型,对''字符串认为是true。
function getMayBeBoolean(prop: any) {
  return prop === '' ? true : prop
}



export default defineComponent({
  name: 'AcgTooltip',
  props: {
    // 表示 visible
    modelValue: Boolean,
    tag: { type: String, default: 'span' },
    placement: { type: String, default: 'top' },
    animation: { type: [String, Boolean], default: 'fade' },
    arrow: {
      type: [String, Boolean, SVGElement, DocumentFragment],
      default: false
    },
    content: { type: String, default: '' },
    followCursor: { type: [Boolean, String], default: false },
    interactive: { type: Boolean, default: false },
    maxWidth: { type: [Number, String], default: 'none' },
    offset: { type: Array, default: () => [0, 10] },
    appendTo: { default: () => document.body },
    // theme: light, light-border, material, translucent
    theme: { type: String, default: 'light' },
    trigger: { type: String, default: 'hover' },
    hideOnClick: { type: [Boolean, String], default: true },
    role: { type: String, default: 'tooltip' },
    delay: { type: [Number, Array], default: 0 },
    duration: { type: [Number, Array], default: () => [300, 250] },
    disabled: Boolean,
    contentClass: String,
    zIndex: { type: Number, default: undefined }
  },
  emits: [
    'update:modelValue',
    'mount',
    'create',
    'destroy',
    'show',
    'shown',
    'hide',
    'hidden',
    'trigger',
    'untrigger'
  ],
  data() {
    return {
      popovers: [] as Instance[],
      forceProps: {},
      tooltip: {} as Record<string, any>
    }
  },
  watch: {
    modelValue(visible: boolean) {
      this.handleVisibleChange(visible)
    },
    theme(val: string) {
      this.setProps({ theme: val })
    }
  },
  render() {
    const { default: d, content: c } = this.$slots
    let referenceVnodes = safeSlot(d)
    let contentVnodes = safeSlot(c) //h('div', safeSlot(c))

    let reference, content
    if (referenceVnodes) {
      reference = textWrapper(referenceVnodes)
    }

    if (contentVnodes) {
      content = h('div', { class: this.contentClass }, contentVnodes)
    }

    this.tooltip = { reference, content }
    // console.log('[tooltip]', this.tooltip)
    return [reference, content] //h(this.tag, [reference, content])
  },
  mounted() {
    this.initSlots()
  },
  methods: {
    handleVisibleChange(visible: boolean) {
      if (visible) {
        this.popovers.forEach((popover: Instance) => popover.show())
      } else {
        this.popovers.forEach((popover: Instance) => popover.hide())
      }
    },

    // 更新Props
    updateProps(instance: Instance) {
      if (!this.zIndex) instance.setProps({ zIndex: PopupManager.zIndex })
    },

    setProps(options: Record<string, any>) {
      this.popovers.forEach((popover: Instance) => {
        popover.setProps(options)
      })
    },

    updateForceProps() {
      this.setProps(this.forceProps)
    },

    destroyPopovers() {
      this.popovers.forEach(popover => popover.destroy())
    },

    initPopover(el?: MultipleTargets, content?: Element) {
      if (!el || !el.length) return
      this.destroyPopovers()

      let finalContent: string | Node | (() => Node) = this.content

      if (content) {
        finalContent = content
        if (el.length > 1) {
          finalContent = () => content.cloneNode(true)
          content.remove()
        }
      }

      // @ts-ignore
      this.popovers = tippy(el, {
        delay: this.delay,
        duration: this.duration,
        role: this.role,
        trigger: getTrigger(this.trigger),
        plugins: [followCursor],
        theme: this.theme,
        placement: this.placement,
        animation: this.animation,
        hideOnClick: this.hideOnClick,
        arrow: getMayBeBoolean(this.arrow),
        content: finalContent,
        followCursor: this.followCursor,
        interactive: getMayBeBoolean(this.interactive),
        maxWidth: this.maxWidth,
        offset: this.offset,
        zIndex: this.zIndex,
        appendTo: this.appendTo,
        onMount: this.$emit('mount'),
        onCreate: this.$emit('create'),
        onDestroy: this.$emit('destroy'),
        onShow: instance => {
          if (this.disabled) return false
          this.updateProps(instance)
          this.$emit('show', instance)
        },
        onShown: instance => {
          this.$emit('update:modelValue', true)
          this.$emit('shown', instance)
        },
        onHide: this.$emit('hide'),
        onHidden: instance => {
          this.$emit('update:modelValue', false)
          this.$emit('hidden', instance)
        },
        onTrigger: this.$emit('trigger'),
        onUntrigger: this.$emit('untrigger')
      })
      this.updateForceProps()
      this.modelValue && this.handleVisibleChange(this.modelValue)
    },

    initSlots() {
      const { reference: defaultSlots, content } = this.tooltip

      let reference, contentEl
      if (defaultSlots) {
        reference = defaultSlots.map((vnode: VNode) => vnode.el) as Element[]
      }
      if (content) {
        contentEl = content.el as Element
      }

      this.initPopover(reference, contentEl)
    }
  }
})
