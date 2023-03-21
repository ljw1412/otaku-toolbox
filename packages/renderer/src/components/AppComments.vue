<script lang="ts" setup>
import { ref, reactive, computed, PropType, onMounted } from 'vue'
import $global from '/@/global/index'
import Comment from '/@/components/AcgComment.vue'
import { Message } from '@arco-design/web-vue'

interface CommonComment extends BaseComment, WithRelativeTime {}

const props = defineProps({
  hideReplyBox: Boolean,
  fetchComments: {
    type: Function as PropType<
      (page: {
        index: number
        size: number
      }) => Promise<{ list: CommonComment[]; total: number }>
    >,
    default: async () => {
      return { list: [], total: 0 }
    }
  },
  reply: {
    type: Function as PropType<(comment: CommonComment) => Promise<any>>,
    default: async () => {
      return {}
    }
  },
  replyOther: {
    type: Function as PropType<
      (target: string, comment: CommonComment) => Promise<any>
    >,
    default: async () => {
      return {}
    }
  },
  delete: {
    type: Function as PropType<(comment: CommonComment) => Promise<any>>,
    default: async () => {
      return {}
    }
  }
})

const comments = reactive({
  isLoading: false,
  isSaving: false,
  isError: false,
  my: { content: '' } as CommonComment,
  list: [] as CommonComment[],
  page: { index: 1, size: 20, total: 0 }
})

const isLogined = computed(() => $global.user.isLogined)
const user = computed(() => $global.user.current)
function showLogin() {
  if (!isLogined.value) {
    $global.user.isDisplayLoginDialog = true
    return
  }
}

function formatDateTime(date: string | Date, formater = 'YYYY-MM-DD HH:mm') {
  return window.$dayjs(date).format(formater)
}

async function loadComments() {
  comments.isLoading = true
  comments.isError = false
  try {
    const { list, total } = await props.fetchComments(comments.page)
    list.forEach((item) => {
      item.date = formatDateTime(item.date)
      item.relativeTime = window.$dayjs().to(window.$dayjs(item.date))
    })
    comments.list = list
    comments.page.total = total
  } catch (error) {
    comments.isError = true
  }
  comments.isLoading = false
}

async function saveComment() {
  comments.isSaving = true
  try {
    const result = await props.reply(comments.my)
    comments.page.index = 1
    loadComments()
  } catch (error) {}
  comments.isSaving = false
}

async function deleteComment(comment: CommonComment) {
  try {
    await props.delete(comment)
    loadComments()
  } catch (error: any) {
    Message.error(error.message)
  }
}

onMounted(() => {
  loadComments()
})
</script>

<template>
  <div class="app-comments">
    <div v-if="!hideReplyBox" class="reply-box">
      <div
        v-if="!isLogined"
        class="need-login layout-center"
        @click="showLogin"
      >
        <span
          >请先<a-button type="primary" size="small" style="margin: 0 4px"
            >登录</a-button
          >后发表评论</span
        >
      </div>
      <a-textarea
        v-model="comments.my.content"
        :max-length="500"
        :auto-size="{ minRows: 3, maxRows: 3 }"
        :disabled="!isLogined || comments.isSaving"
        :placeholder="isLogined ? '请发表与本话相关的讨论内容' : ''"
      />
      <div class="layout-lr reply-actions">
        <div class="left">
          <div class="user-info">
            <a-avatar :size="32">
              <img
                v-if="isLogined"
                :src="compressImage(user.avatar, 'mini')"
                loading="lazy"
                referrerpolicy="no-referrer"
              />
              <span v-else>?</span>
            </a-avatar>
            <span class="nickname">{{
              isLogined ? user.nickname : '未登录'
            }}</span>
          </div>
        </div>
        <div class="right">
          <a-button
            key="1"
            type="primary"
            :loading="comments.isSaving"
            :disabled="!isLogined || !comments.my.content.trim().length"
            @click="saveComment"
            >发布</a-button
          >
        </div>
      </div>
    </div>

    <a-divider />

    <div class="comment-list">
      <comment
        v-for="comment of comments.list"
        :key="comment._id"
        :avatar="comment.user.avatar"
        :author="comment.user.nickname"
        :content="comment.content"
        :userid="comment.user._id"
      >
        <template #actions>
          <a-space class="comment-actions-inner">
            <span class="text-color-3" :datetime="comment.date">{{
              comment.relativeTime
            }}</span>
            <a-popconfirm
              content="确认要删除该条评论吗?"
              :ok-button-props="{ status: 'danger' }"
              :on-before-ok="() => deleteComment(comment)"
            >
              <a-link
                v-if="comment.user._id === user._id"
                type="text"
                status="danger"
                size="mini"
              >
                <icon-delete />删除</a-link
              >
            </a-popconfirm>
          </a-space>
          <a-divider style="margin-top: 8px; margin-bottom: 0" />
        </template>
      </comment>
    </div>

    <div class="page-pagination">
      <a-pagination
        v-model:current="comments.page.index"
        v-model:page-size="comments.page.size"
        :total="comments.page.total"
        show-total
        simple
        size="small"
        @change="loadComments"
      ></a-pagination>
    </div>
  </div>
</template>

<style lang="scss">
.app-comments {
  .reply-box {
    position: relative;

    .need-login {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      cursor: pointer;
      z-index: 10;
      color: #ffffff;
      background-color: rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(2px);
    }

    .reply-actions {
      margin-top: 8px;
    }

    .nickname {
      margin-left: 8px;
    }

    .user-info {
      display: flex;
      align-items: center;
      color: var(--color-text-2);
    }

    &.not-login {
      .user-info {
        opacity: 0.5;
      }
    }
  }

  .comment-list {
    .arco-comment-title {
      line-height: 40px;
    }
  }

  .comment-actions-inner {
    font-size: 13px;

    a.arco-link {
      font-size: inherit;
    }
  }
}
</style>
