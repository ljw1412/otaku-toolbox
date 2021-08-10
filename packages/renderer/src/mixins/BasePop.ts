import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    innerClass: { type: [String, Object], default: '' },
    placement: { type: String, default: 'bottom-end' },
    offset: { type: Array, default: () => [0, 10] }
  },
  data() {
    return {
      theme: ''
    }
  },
  computed: {
    tooltipTheme(): string {
      return this.theme === 'dark' ? 'material' : 'light'
    }
  },
  methods: {
    getTheme() {
      this.theme = window.$theme.get()
    }
  }
})
