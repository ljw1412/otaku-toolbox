<template>
  <div class="character-list-item" :class="{ mobile: isMobileSize }">
    <div class="chara-anchor" :id="`${character.name}`"></div>
    <a-row>
      <a-col :flex="isMobileSize ? '100px' : '135px'" class="image-col">
        <img
          class="chara-image"
          :src="character.images.large || character.images.origin"
          loading="lazy"
          referrerpolicy="no-referrer"
        />
        <a-tag
          v-if="character.isMain"
          class="role-type"
          color="red"
          size="small"
          >主角</a-tag
        >
      </a-col>
      <a-col flex="auto" style="width: 0">
        <div class="chara-name" :class="{ 'no-name': !character.name }">
          <p v-if="character.name" class="name">{{ character.name }}</p>
          <p v-if="character.oname" class="oname">{{ character.oname }}</p>
        </div>
        <div v-if="character.cv && character.cv.length" class="chara-cv">
          <span class="cv-key">配音</span>
          <span v-for="c of character.cv" :key="c._id" class="cv-item">
            <span>{{ c.name }}</span>
            <span v-if="c.note"> ({{ c.note }})</span>
          </span>
        </div>
        <a-space v-if="mInfo.length" class="chara-info" wrap size="mini">
          <span v-for="item of mInfo" :key="item._id" class="info-item">
            <span class="info-key">{{ item.key }}</span>
            <span class="info-value">{{ item.value }}</span>
          </span>
        </a-space>
        <div v-if="character.desc" class="chara-desc text-color-2">
          {{ character.desc }}
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'AnimeCharacterList',

  props: {
    character: { type: Object as PropType<Character>, default: () => ({}) }
  },

  computed: {
    mInfo() {
      if (!this.character.info) return []
      return this.character.info.filter((item) => item.important)
    }
  }
})
</script>

<style lang="scss">
.character-list-item {
  position: relative;
  font-size: 14px;
  line-height: 1.2;
  padding: 12px 8px;
  transition: background-color ease-in 0.15s;

  &.mobile {
    font-size: 12px;
    line-height: 1.1;
  }

  & + & {
    border-top: 1px solid var(--color-fill-4);
  }

  &:hover {
    background-color: var(--color-fill-3);
  }

  .chara-anchor {
    position: absolute;
    top: 60px;
    left: 0;
  }

  .image-col {
    position: relative;
    display: flex;
    margin-right: 16px;
  }

  .role-type {
    position: absolute;
    right: 4px;
    top: 4px;
    font-weight: bold;
    z-index: 1;
  }

  .chara-image {
    display: inline-block;
    width: 100%;
    object-fit: cover;
  }

  .chara-name {
    margin-bottom: 4px;

    .name {
      font-size: 18px;
      color: var(--color-text-1);
    }

    .oname {
      color: var(--color-text-2);
    }

    &.no-name {
      .oname {
        font-size: inherit;
        color: var(--color-text-1);
      }
    }
  }

  .chara-cv {
    margin-bottom: 4px;
  }

  .chara-info {
    display: flex;
  }

  .info-key,
  .cv-key {
    margin-right: 4px;
    color: var(--color-text-3);
  }

  .cv-item:not(:last-child)::after {
    content: '/';
    margin: 0 6px;
  }

  .chara-desc {
    margin-top: 8px;
    line-height: 1.4;
    white-space: pre-line;
  }
}
</style>
