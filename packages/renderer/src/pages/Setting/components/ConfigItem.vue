<script lang="ts">
import { defineComponent, h } from 'vue'
import ThemeConfig from './ThemeConfig.vue'
import Debugger from './Debugger.vue'
import Proxy from './Proxy.vue'
import { Switch } from '@arco-design/web-vue'

const configComponent: Record<string, any> = {
  theme: ThemeConfig,
  debugger: Debugger,
  proxy: Proxy
}

export default defineComponent({
  name: 'AppConfigItem',

  props: {
    type: { type: String, default: 'text' },
    options: { type: Array, default: () => [] },
    modelValue: [String, Boolean, Number]
  },

  emits: ['change', 'update:modelValue'],

  render() {
    if (Object.prototype.hasOwnProperty.call(configComponent, this.type)) {
      return h(configComponent[this.type])
    } else if (this.type === 'switch') {
      // @ts-ignore
      return h(Switch, {
        modelValue: this.modelValue,
        type: 'round',
        'onUpdate:modelValue': (value: boolean) =>
          this.$emit('update:modelValue', value),
        onChange: (value: boolean) => this.$emit('change', value)
      })
    }

    return h('span', this.modelValue)
  }
})
</script>