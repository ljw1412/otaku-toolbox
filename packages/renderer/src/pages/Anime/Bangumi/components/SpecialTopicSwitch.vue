<template>
  <acg-fixed-button
    v-show="list.length"
    ref="btn"
    title="专题切换"
    always
    :bottom="90"
    @click="isDisplaySwitch = !isDisplaySwitch"
  >
    <acg-icon name="repeat-outline" :size="20"></acg-icon>
  </acg-fixed-button>
  <teleport to="body">
    <transition name="fade">
      <div v-show="isDisplaySwitch" class="stopic-switch-picker" @click="isDisplaySwitch = false">
        <div class="stopic-list">
          <acg-ratio-div
            v-for="topic of list"
            :key="topic._id"
            :ratio="[16, 10]"
            class="stopic-item-wrap"
          >
            <div class="stopic-item" :class="{ active: topic.code === code }">
              <router-link
                class="stopic-item-body"
                :to="{ params: { code: topic.code }, query: { app: 'otakutools' } }"
              >
                <img v-if="topic.cover" :src="topic.cover" loading="lazy" />
                <span class="stopic-title">{{ topic.name }}</span>
              </router-link>
            </div>
          </acg-ratio-div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'SpecialTopicSwitch',

  props: {
    list: { type: Array as PropType<SpecialTopic[]>, default: () => [] },
    code: String
  },

  data() {
    return { isDisplaySwitch: false }
  },

  watch: {
    isDisplaySwitch(val: boolean) {
      if (val) {
        const activeEl = document.querySelector('.stopic-switch-picker .stopic-item.active')
        if (activeEl) {
          this.$nextTick(() => {
            activeEl.scrollIntoView()
          })
        }
      }
    }
  },

  deactivated() {
    this.isDisplaySwitch = false
  }
})
</script>

<style lang="scss">
.stopic-switch {
  position: absolute;
  bottom: 0;
  right: 48px;
  width: 160px;
  padding: 4px;
  border-radius: 4px;
  background-color: var(--acg-fixed-button-bg-color);
  border: var(--acg-fixed-button-border);
  z-index: 1000;

  > a {
    display: block;
    & + a {
      margin-top: 2px;
    }
  }
}

.stopic-switch-picker {
  --stopic-item-wrap-width: 25%;
  --stopic-item-font-size: 34px;
  --stopic-list-padding: 64px;
  --stopic-item-padding: 12px;

  position: fixed;
  left: 0;
  top: var(--app-header-height);
  width: 100%;
  height: calc(100% - var(--app-header-height));
  z-index: 600;
  background-color: rgba(0, 0, 0, 0.8);
  transform: translateZ(0);

  .stopic-list {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: var(--stopic-list-padding);
    overflow-y: scroll;

    &,
    * {
      box-sizing: border-box;
    }

    .stopic-item-wrap {
      width: var(--stopic-item-wrap-width);
    }

    .stopic-item {
      width: 100%;
      height: 100%;
      padding: var(--stopic-item-padding);
      transition: padding 0.3s ease-in-out;
      will-change: padding;

      img {
        opacity: 0.5;
        transition: opacity 0.3s ease-in;
        will-change: opacity;
      }

      &:hover {
        padding: 0;
        img {
          opacity: 1;
        }
      }

      &.active {
        .stopic-item-body {
          border-color: var(--app-color-common);
        }
        img {
          opacity: 1;
        }
        .stopic-title {
          color: var(--app-color-common);
        }
      }
    }

    .stopic-item-body {
      position: relative;
      display: inline-block;
      width: 100%;
      height: 100%;
      border: 4px solid var(--color-border);
      background-color: var(--color-bg-3);
    }

    .stopic-title {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      text-align: center;
      transform: translate(-50%, -50%);
      font-size: var(--stopic-item-font-size);
      color: #ffffff;
      text-shadow: 1px 0 2px #000000, 0 1px 2px #000000, 0 -1px 2px #000000,
        -1px 0 2px #000000;
      font-weight: bold;
      transition: font-size 0.2s;
      will-change: font-size;
    }
  }
}

@media (min-width: 1750px) {
  .stopic-switch-picker {
    --stopic-item-wrap-width: 20%;
    --stopic-item-font-size: 32px;
  }
}

@media (max-width: 1599.9px) {
  .stopic-switch-picker {
    --stopic-item-font-size: 30px;
  }
}

@media (max-width: 1199.9px) {
  .stopic-switch-picker {
    --stopic-item-wrap-width: 33.33%;
    --stopic-item-font-size: 28px;
  }
}
</style>
