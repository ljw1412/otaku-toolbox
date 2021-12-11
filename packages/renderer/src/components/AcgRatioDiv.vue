

<script lang="ts">
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'AcgRatioDiv',
  props: {
    // [宽，长]
    ratio: { type: Array, default: () => [1, 1] },
    disabled: Boolean
  },

  computed: {
    style(): Record<string, string> {
      if (this.disabled) return {}
      const [width, height] = this.ratio
      return { 'padding-bottom': `calc(${height} / ${width} *100%)` }
    }
  },

  render() {
    const defaultSlot = this.$slots.default && this.$slots.default()
    const children = h('div', { className: 'acg-ratio-content' }, defaultSlot)

    let className = 'acg-ratio-div'
    if (this.$attrs.class) {
      className = this.$attrs.class + ' ' + className
    }

    return [
      h('div', { className, style: [this.style, this.$attrs.style] }, [
        this.disabled ? defaultSlot : children
      ])
    ]
  }
})
</script>

<style lang="scss">
.acg-ratio-div {
  position: relative;
  .acg-ratio-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100%;
    width: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
