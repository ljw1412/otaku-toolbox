import { defineComponent } from 'vue'
import cache from './cache'

export default defineComponent({
  computed: {
    bangumi(): FormatedBangumiBasic {
      const loader = cache.bangumi[this.$route.params.id as string]
      return loader ? loader.info : ({} as FormatedBangumiBasic)
    }
  }
})
