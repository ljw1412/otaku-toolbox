import { ComponentOptionsMixin } from 'vue'
import { getLogoIcon } from '/@/utils/icons'
import { compressImage } from '/@/utils/image'

export default {
  computed: {
    isLaptopSize() {
      return this.$global.breakpoints.laptop
    },

    isMobileSize() {
      return this.$global.breakpoints.mobile
    },

    isSecretMode() {
      return this.$global.contra.getState('secret')
    },

    hourSystem() {
      if (![24, 30].includes(this.$global.config.hourSystem)) return 24
      return this.$global.config.hourSystem
    },

    isLogined() {
      return this.$global.user.isLogined
    },

    user() {
      return this.$global.user.current
    }
  },

  methods: {
    getLogoIcon,
    compressImage,
    formatDateTime(date: string | Date, formater = 'YYYY-MM-DD HH:mm') {
      return window.$dayjs(date).format(formater)
    }
  }
} as ComponentOptionsMixin
