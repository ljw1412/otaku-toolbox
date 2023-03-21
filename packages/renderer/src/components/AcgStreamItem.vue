<template>
  <div class="acg-stream-item" :title="title" :class="{ block: longButton }">
    <a-link
      v-if="mode === 'icon'"
      :href="url"
      :status="hide ? 'warning' : 'normal'"
      target="_blank"
    >
      <img
        v-if="mIcon"
        :src="mIcon"
        class="icon"
        referrerpolicy="no-referrer"
      />
      <span v-else class="name">{{ name }}</span>
      <div v-if="hide || region" class="badge">{{ regionStr }}</div>
    </a-link>
    <a v-else :href="url" target="_blank">
      <a-button :size="size" :long="longButton" v-bind="buttonProps">
        <template v-if="icon || mIcon" #icon>
          <img
            v-if="mIcon"
            :src="mIcon"
            class="icon"
            referrerpolicy="no-referrer"
          />
          <component :is="icon" v-else class="icon"></component>
        </template>
        <span class="name">{{ name }}</span>
        <span v-if="regionStr" class="region">[{{ regionStr }}]</span>
      </a-button>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { getLogoIcon } from '/@/utils/icons'

const regionMap = {
  CN: '',
  港: '港',
  HK: '港',
  澳: '澳',
  MO: '澳',
  台: '台',
  TW: '台',
  JP: '日',
  海外: '海外',
  资源: '资源'
} as Record<string, any>

export default defineComponent({
  name: 'AcgStreamItem',

  props: {
    // button, icon
    mode: { type: String, default: 'button' },
    _id: String,
    name: String,
    hide: Boolean,
    icon: { type: String, default: '' },
    from: { type: String, default: '' },
    url: String,
    time: String,
    region: { type: String, default: '' },
    message: String,
    size: {
      type: String as PropType<'large' | 'small' | 'mini' | 'medium'>,
      default: 'large'
    },
    longButton: Boolean,
    buttonProps: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    }
  },

  computed: {
    mRegion() {
      const list: string[] = []
      Object.keys(regionMap).forEach((region) => {
        if (this.region.includes(region)) {
          list.push(regionMap[region])
        }
      })
      return list.join(',')
    },

    title() {
      let title = this.name
      if (this.mRegion) {
        title = `[${this.mRegion.replace(/,/g, '')}]` + title
      }
      if (this.time) {
        title += `@${this.time}`
      }
      if (this.message) {
        title += '\n' + this.message
      }
      return title
    },

    regionStr() {
      return this.hide ? '隐藏' : this.mRegion.replace(/,/g, '')
    },

    mIcon() {
      return getLogoIcon(this.from)
    }
  }
})
</script>

<style lang="scss">
.acg-stream-item {
  display: inline-flex;

  &.block {
    display: block;
  }

  .arco-link {
    position: relative;
    text-align: center;

    .icon {
      display: block;
      width: 4em;
      height: 4em;
      margin: 0 auto;
      object-fit: contain;
    }

    .name {
      display: flex;
      height: 4em;
      justify-items: center;
      align-items: center;
    }

    .badge {
      position: absolute;
      left: 0;
      top: 0;
      font-size: 12px;
      line-height: 16px;
      padding: 0 2px;
      color: #ffffff;
      background-color: rgb(var(--danger-6));
      box-shadow: 0 0 0 1px var(--color-bg-2);
    }
  }

  .arco-btn {
    padding: 0 8px;

    .icon {
      width: 1.4em;
      height: 1.4em;
      vertical-align: -0.3em;
    }

    .region {
      margin-left: 2px;
      font-size: 12px;
      color: rgb(var(--danger-6));
    }
  }
}
</style>
