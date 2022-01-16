<template>
  <div class="live-multi-room"
    :data-type="mode">
    <div v-for="index of count"
      :key="index"
      :data-index="index"
      class="room-item">
      <live-room v-if="roomList[index - 1]"
        :key="roomList[index - 1]"
        :room-id="roomList[index - 1]"
        :monitor-id="1"
        :key-id="index"
        :config="config.roomList[index]"></live-room>
    </div>

  </div>
</template>

<script lang="ts">
import { useLocalStorage, toReactive } from '@vueuse/core'
import { defineComponent } from 'vue'
import LiveRoom from './components/LiveRoom.vue'
import { defaultLiveConfig } from './utils/data'

const modeAndCount = [2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 6, 6, 8, 8, 8, 9]

export default defineComponent({
  name: 'LiveMultiRoom',

  components: { LiveRoom },

  props: { monitorId: { type: String, default: '-1' } },

  setup(props) {
    const config = toReactive(
      useLocalStorage(`LIVE_MULTI_${props.monitorId}_CONFIG`, {
        id: props.monitorId,
        mode: 1,
        roomList: [{}] as Record<string, any>[]
      })
    )
    if (config.roomList.length < 9) {
      for (let i = config.roomList.length; i < 10; i++) {
        config.roomList.push(defaultLiveConfig(true))
      }
    }
    return { config }
  },

  data() {
    return {
      mode: 8,
      roomList: [] as number[]
    }
  },

  computed: {
    count() {
      return modeAndCount[this.mode] || 0
    }
  },

  mounted() {
    const { data } = this.$route.query
    if (Array.isArray(data)) {
      this.roomList = data.map(id => parseInt(id as string))
    }
  }
})
</script>

<style lang="scss">
.live-multi-room {
  width: 100%;
  height: 100%;
  display: grid;

  &[data-type='0'] {
    grid-template-columns: repeat(2, 50%);
  }

  &[data-type='1'] {
    grid-template-rows: repeat(2, 50%);
  }

  &[data-type='2'] {
    grid-template-columns: repeat(3, 33.33%);
  }

  &[data-type='3'] {
    grid-template-rows: repeat(3, 33.33%);
  }

  &[data-type='4'] {
    grid-template-columns: 60% 40%;
    grid-template-rows: repeat(2, 50%);
    .room-item:nth-child(1) {
      grid-row: 1/3;
    }
  }

  &[data-type='5'] {
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: 60% 40%;
    .room-item:nth-child(1) {
      grid-column: 1/3;
    }
  }

  &[data-type='6'] {
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: repeat(2, 50%);
  }

  &[data-type='7'] {
    grid-template-rows: repeat(4, 25%);
  }

  &[data-type='8'] {
    grid-template-columns: 60% 40%;
    grid-template-rows: repeat(3, 33.33%);
    .room-item:nth-child(1) {
      grid-row: 1/4;
    }
  }

  &[data-type='9'] {
    grid-template-columns: repeat(3, 33.33%);
    grid-template-rows: 60% 40%;
    .room-item:nth-child(1) {
      grid-column: 1/4;
    }
  }

  &[data-type='10'] {
    grid-template-columns: repeat(3, 33.33%);
    grid-template-rows: repeat(2, 50%);
  }

  &[data-type='11'] {
    grid-template-columns: repeat(3, 33.33%);
    grid-template-rows: repeat(3, 33.33%);
    .room-item:nth-child(1) {
      grid-row: 1/3;
      grid-column: 1/3;
    }
  }

  &[data-type='12'] {
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: repeat(2, 50%);
  }

  &[data-type='13'] {
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: repeat(4, 25%);
  }

  &[data-type='14'] {
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: repeat(4, 25%);
    .room-item:nth-child(1) {
      grid-row: 1/4;
      grid-column: 1/4;
    }
  }

  &[data-type='15'] {
    grid-template-columns: repeat(3, 33.33%);
    grid-template-rows: repeat(3, 33.33%);
  }

  .room-item {
    position: relative;
    @for $i from 1 through 9 {
      &[data-index='#{$i}']::before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        content: '#{$i}';
        font-size: 36px;
      }
    }

    .live-room {
      background-color: var(--app-color-bg);
    }
  }
}
</style>
