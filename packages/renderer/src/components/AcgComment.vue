<template>
  <a-comment class="acg-comment" :align="align">
    <template v-if="avatar" #avatar>
      <a-avatar>
        <img
          :src="compressImage(avatar, 'mini')"
          loading="lazy"
          referrerpolicy="no-referrer"
        />
      </a-avatar>
    </template>
    <template v-if="author" #author>
      <span>{{ author }}</span>
      <span v-if="user._id === userid" class="self-tag text-color-common"
        >自己</span
      >
    </template>
    <template v-if="datetime" #datetime>
      <span>{{ datetime }}</span>
      <a-rate
        v-if="showRate"
        allow-half
        readonly
        class="rate"
        :model-value="score / 2"
        :count="5"
        :title="score"
      />
    </template>
    <template v-if="$slots.actions" #actions>
      <slot name="actions"></slot>
    </template>
    <template v-if="$slots.content || content" #content>
      <slot name="content">{{ content }}</slot>
    </template>
  </a-comment>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

type PropAlign =
  | 'left'
  | 'right'
  | { datetime?: 'left' | 'right'; actions?: 'left' | 'right' }

export default defineComponent({
  name: 'MediaComment',

  props: {
    align: { type: [String, Object] as PropType<PropAlign>, default: 'left' },
    showRate: Boolean,
    userid: String,
    score: { type: Number, default: 0 },
    author: String,
    content: String,
    avatar: String,
    datetime: String
  }
})
</script>

<style lang="scss">
.acg-comment {
  .self-tag {
    display: inline-block;
    line-height: 1;
    padding: 2px 4px;
    font-size: 12px;
    border: 1px solid currentColor;
    margin-left: 4px;
    border-radius: 2px;
  }
}
</style>
