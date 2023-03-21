<script setup lang="ts">
import { computed } from 'vue'
import $global from '/@/global/index'
import AppIframePlayer from '/@/components/AppIframePlayer.vue'
import AppLoginDialog from './components/AppLoginDialog.vue'

const imagePreviewProps = computed(() => $global.dialog.$imagePreviewer)
const isDisplayLoginDialog = computed({
  get: () => $global.user.isDisplayLoginDialog,
  set: (val) => {
    $global.user.isDisplayLoginDialog = val
  }
})
</script>

<template>
  <app-iframe-player></app-iframe-player>
  <a-image-preview-group
    v-model:visible="imagePreviewProps.visible"
    v-model:current="imagePreviewProps.current"
    :srcList="imagePreviewProps.srcList"
  ></a-image-preview-group>
  <app-login-dialog v-model:visible="isDisplayLoginDialog"></app-login-dialog>
</template>

<style lang="scss"></style>
