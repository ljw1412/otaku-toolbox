<template>
  <div class="acg-stream-item" :title="title" :class="`mode-${mode}`">
    <a-link
      v-if="mode === 'icon'"
      :href="url"
      :status="hide ? 'warning' : 'normal'"
      target="_blank"
    >
      <img v-if="icon" :src="icon" class="icon" />
      <span v-else class="name">{{ name }}</span>
      <div v-if="hide || region" class="badge">{{ regionStr }}</div>
    </a-link>
    <a v-else :href="url" target="_blank">
      <a-button size="large">
        <template v-if="icon" #icon>
          <img :src="icon" class="icon" />
        </template>
        <span class="region" v-if="regionStr">[{{ regionStr }}]</span>
        <span class="name">{{ name }}</span>
      </a-button>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getLogoIcon } from '/@/utils/icons'

const regionMap = {
  CN: '',
  港: '港',
  HK: "港",
  澳: "澳",
  MO: "澳",
  台: "台",
  TW: "台",
  JP: '日'
} as Record<string, any>

export default defineComponent({
  name: 'AcgStreamItem',

  props: {
    // button, icon
    mode: { type: String, default: 'button' },
    _id: String,
    name: String,
    hide: Boolean,
    from: { type: String, default: '' },
    url: String,
    time: String,
    region: { type: String, default: '' },
    message: String
  },

  computed: {
    mRegion() {
      const list: string[] = []
      Object.keys(regionMap).forEach(region => {
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

    icon() {
      return getLogoIcon(this.from)
    }
  }
})
</script>

<style lang="scss">
.acg-stream-item {
  display: inline-flex;

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
      width: 1.8em;
      height: 1.8em;
      vertical-align: -0.5em;
    }

    .region {
      color: rgb(var(--danger-6));
    }
  }
}
</style>
