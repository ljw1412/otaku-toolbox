<template>
  <div class="detail-characters">
    <a-spin
      v-if="isLoading"
      :size="50"
      style="width: 100%; text-align: center"
    ></a-spin>
    <div class="character-list">
      <div
        v-for="item of list"
        :key="item._id"
        :title="item.name"
        class="chara-item"
        @click="handleCharaItemClick(item)"
      >
        <img
          class="chara-image"
          :src="item.images.grid || item.images.large || item.images.origin"
          loading="lazy"
          referrerpolicy="no-referrer"
        />
      </div>
    </div>
    <character-list-item
      v-for="item of list"
      :key="item._id"
      :character="item"
    ></character-list-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CharacterListItem from './components/CharacterListItem.vue'
import { fetchCharacterList } from './utilities/cache'

export default defineComponent({
  name: 'AnimeDetailCharacters',

  components: { CharacterListItem },

  data() {
    return {
      isLoading: false,
      list: [] as Character[]
    }
  },

  created() {
    this.loadCharacter()
  },

  methods: {
    async loadCharacter() {
      this.isLoading = true
      try {
        const bid = this.$route.params.id as string
        const list = await fetchCharacterList(bid)
        this.list = list
      } catch (error) {}
      this.isLoading = false
    },

    handleCharaItemClick(item: Character) {
      const el = document.querySelector(`#${item.name}`)
      this.$nextTick(() => {
        if (el)
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start'
          })
      })
    }
  }
})
</script>

<style lang="scss">
.detail-characters {
  .character-list {
    position: sticky;
    top: 0;
    display: flex;
    width: 100%;
    padding: 4px 0;
    overflow-x: auto;
    box-sizing: border-box;
    background-color: var(--app-color-bg);
    z-index: 50;

    .chara-item {
      flex: 0 0 50px;
      display: inline-block;
      width: 50px;
      height: 50px;
      margin-right: 4px;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;

        &[src*='.bgm.tv'] {
          object-position: center 0;
        }
      }
    }
  }
}
</style>
