<script lang="ts">
import { h, defineComponent } from 'vue'
import { createDivWrapper } from '../utils/vue-helper'

export default defineComponent({
  name: 'AcgAreaHeader',
  render() {
    const children = ['left', 'center', 'right']
      .filter(name => this.$slots[name])
      .map(name => createDivWrapper(name, this.$slots[name]))
    return h('div', { class: 'acg-area-header' }, children)
  }
})
</script>

<style lang="scss">
.acg-area-header {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 1;

  .left,
  .right,
  .center {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
