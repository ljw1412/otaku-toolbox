<template>
  <a-popover v-model:popup-visible="mPopupVisible" position="br">
    <a-avatar class="app-user-avatar cursor-pointer app-no-drag mr-10" :size="36">
      <img v-if="isLogin" alt="avatar" :src="user.avatar" />
      <span v-else>登录</span>
    </a-avatar>
    <template #content>
      <div class="app-user-panel"></div>
    </template>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppUserAvatar',

  data() {
    return {
      isPopupVisible: false
    }
  },

  computed: {
    user() {
      return this.$global.user.current
    },

    isLogin() {
      return this.$global.user.isLogin
    },

    mPopupVisible: {
      get() {
        return this.isLogin && this.isPopupVisible
      },
      set(val: boolean) {
        this.isPopupVisible = val
      }
    }
  }
})
</script>

<style lang="scss">
.app-user-panel {
  width: 300px;
  height: 200px;
}
</style>
