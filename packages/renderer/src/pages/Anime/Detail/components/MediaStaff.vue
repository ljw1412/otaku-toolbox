<template>
  <info-group class="media-staff" title="制作人员">
    <a-grid
      :cols="{ xs: 1, sm: 1, md: 1, lg: 2, xxl: 3 }"
      :col-gap="30"
      :row-gap="12"
    >
      <a-grid-item v-for="item of list" :key="item._id" class="staff-item">
        <a-card
          hoverable
          class="staff-card"
          :bordered="false"
          :body-style="{ padding: '12px' }"
        >
          <template #cover>
            <img
              v-if="item.image"
              class="cover"
              :src="item.image"
              loading="lazy"
              referrerpolicy="no-referrer"
            />
          </template>
          <div class="content">
            <p class="name">{{ item.name }}</p>
            <p class="post">{{ item.post }}</p>
          </div>
        </a-card>
      </a-grid-item>
    </a-grid>
  </info-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InfoGroup from './InfoGroup.vue'

export default defineComponent({
  name: 'MediaStaff',

  components: {
    InfoGroup
  },

  data() {
    return {
      list: [
        {
          _id: '',
          name: '桐谷和人',
          image:
            'https://i0.hdslb.com/bfs/album/a6059ea822d44f5068febbd700c38a396df3aa82.jpg',
          post: '导演'
        }
      ]
    }
  }
})
</script>

<style lang="scss">
.media-staff {
  .staff-card {
    display: inline-grid;
    width: 100%;
    height: 80px;
    grid-template-columns: 70px auto;
    cursor: pointer;

    .cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
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

      .post {
        font-size: 13px;
        color: var(--color-text-3);
      }
    }
  }
}
</style>
