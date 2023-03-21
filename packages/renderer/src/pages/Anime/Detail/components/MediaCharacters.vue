<template>
  <info-group
    v-if="mList.length"
    class="media-characters"
    title="登场角色"
    :title-link="{ name: 'DetailCharacters' }"
  >
    <a-grid
      :cols="{ xs: 1, sm: 1, md: 1, lg: 2, xxl: 3 }"
      :col-gap="30"
      :row-gap="12"
    >
      <a-grid-item v-for="item of mList" :key="item._id" class="character-item">
        <a-card
          hoverable
          class="character-card"
          :bordered="false"
          :body-style="{ padding: '12px' }"
        >
          <template #cover>
            <acg-ratio-div :ratio="[3, 4]" class="cover">
              <img
                v-if="item.images.large || item.images.origin"
                loading="lazy"
                referrerpolicy="no-referrer"
                class="character-image"
                :src="item.images.large || item.images.origin"
              />
            </acg-ratio-div>
          </template>
          <div class="content">
            <p class="name">{{ item.name || item.oname }}</p>
            <div v-if="item.cv && item.cv.length" class="cv">
              <p v-for="c of item.cv" :key="c._id" class="cv-item">
                <span>{{ c.name }}</span>
                <span v-if="c.note"> ({{ c.note }})</span>
              </p>
            </div>
          </div>
        </a-card>
      </a-grid-item>
    </a-grid>
  </info-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InfoGroup from './InfoGroup.vue'
import { fetchCharacterList } from '../utilities/cache'

export default defineComponent({
  name: 'MediaCharacters',

  components: {
    InfoGroup
  },

  data() {
    return {
      list: [] as Character[]
    }
  },

  computed: {
    mList() {
      return this.list.slice(0, this.isMobileSize ? 3 : 6)
    }
  },

  created() {
    this.loadCharacter()
  },

  methods: {
    async loadCharacter() {
      const bid = this.$route.params.id as string
      const list = await fetchCharacterList(bid)
      this.list = list.slice(0, 6)
    }
  }
})
</script>

<style lang="scss">
.media-characters {
  .character-card {
    display: inline-grid;
    width: 100%;
    height: 100px;
    grid-template-columns: 75px auto;
    cursor: pointer;

    .character-image[src*='.bgm.tv'] {
      object-position: center 0;
    }

    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .name {
        font-size: 14px;
        margin-bottom: 6px;
      }

      .cv {
        font-size: 12px;
        line-height: 16px;
        color: var(--color-text-3);
      }

      .cv-item {
        text-align: right;
      }
    }
  }
}
</style>
