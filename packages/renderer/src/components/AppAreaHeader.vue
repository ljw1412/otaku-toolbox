<script lang="ts">
import { defineComponent, h } from 'vue'
import AreaHeader from '/@UI/packages/AreaHeader.vue'
import { safeSlot } from '/@UI/utils/vue-helper'

export default defineComponent({
  name: 'AppAreaHeader',
  props: {
    level: { type: [Number, String], default: 2 },
    title: { type: String, default: '' }
  },

  render() {
    return h(
      AreaHeader,
      {
        class: 'app-area-header'
      },
      {
        left: () =>
          [h(`h${this.level}`, this.title), safeSlot(this.$slots.left)].filter(
            e => !!e
          ),
        center: this.$slots.center,
        right: this.$slots.right
      }
    )
  }
})
</script>

<style lang="scss">
.app-area-header {
  padding: 10px 0;
}
</style>
