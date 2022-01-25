<template>
  <a-drawer v-model:visible="mVisible"
    :closable="false"
    title="新增规则"
    ok-text="保存"
    placement="bottom"
    height="100%"
    class="origin-create-rule"
    :on-before-ok="handleBeforeOk">
    <div class="rule-editor d-flex">
      <a-form ref="form"
        size="small"
        :model="rule">
        <a-form-item label="类型"
          field="type">{{ rule.type }}</a-form-item>
        <a-form-item label="名称"
          field="name">
          <a-input v-model="rule.name"></a-input>
        </a-form-item>
        <a-form-item label="命名空间"
          field="namespace">
          <a-input v-model="rule.namespace"></a-input>
        </a-form-item>
        <a-form-item label="主页地址"
          field="url">
          <a-input v-model="rule.url"></a-input>
        </a-form-item>
        <a-form-item label="版本"
          field="version">
          <a-input-number v-model="rule.version"
            :default-value="0"></a-input-number>
        </a-form-item>
        <template v-if="mVisible">
          <a-form-item label="模式"
            field="mode">
            <a-radio-group v-model="rule.news.mode"
              type="button">
              <a-radio value="html">html</a-radio>
              <a-radio value="json">json</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="url">
            <a-input v-model="rule.news.url"></a-input>
          </a-form-item>
          <a-form-item label="获取页数"
            field="data.pageTotal"
            help="填写CSS选择器，获取列表的总页数">
            <a-input v-model="rule.news.data.pageTotal"></a-input>
          </a-form-item>
          <a-form-item label="列表子项目"
            field="items"
            help="填写CSS选择器，获取列表子项目">
            <a-input v-model="rule.news.items"
              style="width: 100%;"></a-input>
          </a-form-item>
          <a-form-item content-class="items-data"
            :label-col-props="{span: 2}"
            :wrapper-col-props="{span: 22}">
            <a-form-item label="id">
              <a-input v-model="rule.news.itemData.id"></a-input>
            </a-form-item>
            <a-form-item label="网址">
              <a-input v-model="rule.news.itemData.url"></a-input>
            </a-form-item>
            <a-form-item label="标题">
              <a-input v-model="rule.news.itemData.title"></a-input>
            </a-form-item>
            <a-form-item label="描述">
              <a-input v-model="rule.news.itemData.desc"></a-input>
            </a-form-item>
            <a-form-item label="封面">
              <a-input v-model="rule.news.itemData.cover"></a-input>
            </a-form-item>
            <a-form-item label="更新时间">
              <a-input v-model="rule.news.itemData.updateTime"></a-input>
            </a-form-item>
          </a-form-item>
        </template>
      </a-form>
      <div class="preview"></div>
    </div>

  </a-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OriginCreateRule',

  props: {
    modelValue: Boolean,
    type: { type: String, default: '' },
    currentRule: { type: Object, default: () => ({}) }
  },

  emits: ['update:modelValue', 'success'],

  data() {
    return {
      rule: {
        type: '',
        name: '',
        namespace: '',
        version: 0
      } as Record<string, any>
    }
  },

  computed: {
    mVisible: {
      get() {
        return this.modelValue
      },
      set(val: boolean) {
        this.$emit('update:modelValue', val)
      }
    }
  },

  watch: {
    mVisible(val: boolean) {
      if (val) {
        if (this.currentRule && this.currentRule.namespace) {
          console.log(this.currentRule)

          Object.assign(this.rule, this.currentRule)
        } else {
          // @ts-ignore
          this.$refs.form.resetFields()
          this.rule.type = this.type
          this.rule.version = +new Date() / 1000
          if (this.rule.type.includes('news')) {
            this.rule.news = {
              mode: '',
              url: '',
              items: '',
              data: {},
              itemData: {}
            }
          }
        }
      }
    }
  },

  methods: {
    async handleBeforeOk(done: (closed: boolean) => void) {
      await this.$API.DataCenter.saveRule(this.rule)
      this.$emit('success')
      done(true)
    }
  }
})
</script>

<style lang="scss">
.origin-create-rule {
  .arco-drawer-body {
    overflow: hidden;
  }

  .rule-editor {
    height: 100%;

    .items-data {
      display: block;
    }

    .arco-form {
      overflow: auto;
      padding-right: 4px;
    }

    .preview {
      flex-shrink: 0;
      width: 40%;
      margin-left: 8px;
      border: 1px solid var(--color-border);
      overflow: auto;
    }
  }
}
</style>
