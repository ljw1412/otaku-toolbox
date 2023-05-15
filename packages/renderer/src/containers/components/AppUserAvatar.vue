<template>
  <a-popover
    v-model:popup-visible="mPopupVisible"
    position="br"
    :disabled="!isLogined"
  >
    <a-avatar
      class="app-user-avatar cursor-pointer app-no-drag mr-10"
      :size="36"
      style="overflow: hidden"
      @click="handleAvatarClick"
    >
      <img v-if="isLogined" alt="avatar" :src="user.avatar" />
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
    // user(): BaseUserInfo {
    //   return this.$global.user.current
    // },

    // isLogin() {
    //   return this.$global.user.isLogined
    // },

    mPopupVisible: {
      get() {
        return this.isLogined && this.isPopupVisible
      },
      set(val: boolean) {
        this.isPopupVisible = val
      }
    }
  },

  methods: {
    handleAvatarClick() {
      if (!this.isLogined) {
        this.$API.Electron.win.openAppSystem('登录')
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
