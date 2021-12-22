import { defineComponent, toRaw } from 'vue'

export default defineComponent({
  props: { namespace: { type: String, default: 'xxx' } },

  data() {
    return {
      rule: {} as DataCenter.ComicRule
    }
  },

  created() {
    if (this.namespace) this.fetchRule()
  },

  methods: {
    async fetchRule() {
      this.rule = await this.$API.DataCenter.showRule(
        'comic-book',
        this.namespace
      )
    },

    async runRule(
      rule: DataCenter.ComicRule | DataCenter.RulePageParams,
      page?: number,
      config?: DataCenter.RunnerOptions
    ) {
      return await this.$API.DataCenter.runRule(toRaw(rule), page, config)
    }
  }
})
