<template>
  <a-modal
    v-model:visible="mVisible"
    :width="isMobileSize ? '280px' : '520px'"
    simple
    modal-class="app-login-dialog"
    :footer="false"
    :mask-closable="false"
    :modal-style="{ padding: '0' }"
  >
    <div v-if="!isMobileSize" class="login-extra">
      <span class="layout-center-p layout-center text-color-3 flex-column">
        <a-spin></a-spin>
        <span>随机一部</span>
      </span>
      <div v-if="!isLoading && bangumi.coverMin" class="bg">
        <img
          :src="compressImage(bangumi.coverMin, 'mini')"
          loading="lazy"
          referrerpolicy="no-referrer"
        />
      </div>
      <a-card
        v-if="!isLoading"
        class="random-bangumi"
        :bordered="false"
        :body-style="{ padding: '8px' }"
        @click="gotoDetail"
      >
        <template #cover>
          <acg-ratio-div :ratio="[12, 16]" class="cover">
            <a-image
              :src="compressImage(bangumi.coverMin, 'small')"
              show-loader
              loading="lazy"
              referrerpolicy="no-referrer"
              :preview="false"
            ></a-image>
          </acg-ratio-div>
        </template>
        <p class="multi-text-truncate" data-line="2">{{ bangumi.title }}</p>
      </a-card>
    </div>
    <div class="login-body">
      <header>
        <div class="title">异世界工会前台</div>
        <div class="tips">(请出示身份信息以提供更多服务)</div>
      </header>

      <main>
        <a-form ref="formRef" layout="vertical" :model="form">
          <a-form-item
            hide-asterisk
            hide-label
            field="username"
            :rules="[{ required: true, maxLength: 12, message: '请输入帐号' }]"
          >
            <a-input
              v-model="form.username"
              placeholder="帐号"
              ref="usernameRef"
              @keydown.enter="passwordRef && passwordRef.focus()"
            >
              <template #prefix>
                <icon-user />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            hide-asterisk
            hide-label
            field="password"
            :rules="[{ required: true, maxLength: 12, message: '请输入密码' }]"
          >
            <a-input-password
              v-model="form.password"
              placeholder="密码"
              ref="passwordRef"
              :max-length="12"
              @keydown.enter="login"
            >
              <template #prefix>
                <icon-lock />
              </template>
            </a-input-password>
          </a-form-item>
        </a-form>
        <div style="text-align: right">
          <a-link @click="gotoRegister">前往注册<icon-arrow-right /></a-link>
        </div>
      </main>

      <footer>
        <a-button @click="mVisible = false">路过离开</a-button>
        <a-button type="primary" :loading="logining" @click="login">
          立刻登录
        </a-button>
      </footer>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'AppLoginDialog',

  props: { visible: Boolean },

  emits: ['update:visible'],

  setup() {
    const formRef = ref<HTMLElement>()
    const usernameRef = ref<HTMLElement>()
    const passwordRef = ref<HTMLElement>()
    return { formRef, usernameRef, passwordRef }
  },

  data() {
    return {
      logining: false,
      form: {
        username: '',
        password: ''
      },
      isLoading: false,
      bangumi: {} as FormatedBangumiBasic
    }
  },

  computed: {
    mVisible: {
      get() {
        return this.visible
      },
      set(val: boolean) {
        this.$emit('update:visible', val)
      }
    }
  },

  watch: {
    mVisible(visible: boolean) {
      if (visible) {
        this.logining = false
        this.form.username = ''
        this.form.password = ''
        this.randomBangumi()
      }
    }
  },

  methods: {
    async randomBangumi() {
      this.isLoading = true
      try {
        const bangumi = await this.$API.Bangumi.random()
        this.bangumi = bangumi
      } catch (error) {}
      this.isLoading = false
    },

    gotoRegister() {
      this.$router.replace({ name: 'Register' })
      this.mVisible = false
    },

    gotoDetail() {
      if (!this.bangumi._id) return
      this.$API.Electron.win.openVue({
        name: 'BangumiDetail',
        params: { id: this.bangumi._id }
      })
    },

    async login() {
      // @ts-ignore
      const errors = await this.formRef.validate()
      if (errors) return

      this.logining = true
      try {
        const { token } = await this.$API.User.login(this.form)
        token && window.location.reload()
        this.mVisible = false
      } catch (error) {
        console.log(error)
      }
      this.logining = false
    }
  }
})
</script>

<style lang="scss">
.app-login-dialog.arco-modal {
  .arco-modal-header {
    display: none;
  }

  .arco-modal-body {
    display: flex;
  }

  .login-body {
    flex: 0 0 280px;
    width: 280px;
  }

  .login-extra {
    position: relative;
    display: flex;
    flex: 1 0 auto;
    width: 220px;
    background-color: var(--color-fill-2);

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: 0;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1.1);
        filter: blur(6px);
      }
    }
  }

  .random-bangumi {
    margin: auto;
    width: 160px;
    cursor: pointer;
  }

  header {
    padding: 24px 32px 0 32px;
    margin-bottom: 24px;
    text-align: center;
    .title {
      font-weight: 500;
      font-size: 16px;
    }

    .tips {
      color: var(--app-color-common);
      font-size: 12px;
    }
  }

  main {
    padding: 0 32px;
  }

  footer {
    box-sizing: border-box;
    width: 100%;
    padding: 24px 32px;
    margin-top: 20px;
    border-top: 2px dashed var(--color-border);
    text-align: center;
    .arco-btn + .arco-btn {
      margin-left: 12px;
    }
  }
}
</style>
