import { ComponentOptionsMixin } from 'vue'

export default {
  computed: {
    isLaptopSize() {
      return this.$global.breakpoints.laptop
    },
    isMobileSize() {
      return this.$global.breakpoints.mobile
    },
    hourSystem() {
      if (![24, 30].includes(this.$global.config.hourSystem)) return 24
      return this.$global.config.hourSystem
    }
  }
} as ComponentOptionsMixin
