<template>
  <a-drawer v-model:visible="mVisible"
    :closable="false"
    title="新增规则"
    ok-text="保存"
    placement="bottom"
    height="100%"
    class="origin-create-rule">
    <a-form size="small"
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
      <a-form-item label="版本"
        field="version">
        <a-input-number v-model="rule.version"
          :default-value="0"></a-input-number>
      </a-form-item>
      <a-form-item label="模式"
        field="mode">
        <a-radio-group v-model="rule.mode"
          type="button">
          <a-radio value="html">html</a-radio>
          <a-radio value="json">json</a-radio>
        </a-radio-group>
      </a-form-item>
      <template v-if="mVisible">
        <a-form-item label="获取页数"
          field="data.pageTotal"
          help="填写CSS选择器，获取列表的总页数">
          <a-input v-model="rule.data.pageTotal"></a-input>
        </a-form-item>
        <a-form-item label="列表子项目"
          field="items"
          help="填写CSS选择器，获取列表子项目">
          <a-input v-model="rule.items"
            style="width: 100%;"></a-input>
        </a-form-item>
        <a-form-item content-class="items-data"
          :label-col-props="{span: 2}"
          :wrapper-col-props="{span: 22}">
          <a-form-item label="id">
            <a-input v-model="rule.itemData.id"></a-input>
          </a-form-item>
          <a-form-item label="网址">
            <a-input v-model="rule.itemData.url"></a-input>
          </a-form-item>
          <a-form-item label="标题">
            <a-input v-model="rule.itemData.title"></a-input>
          </a-form-item>
          <a-form-item label="描述">
            <a-input v-model="rule.itemData.desc"></a-input>
          </a-form-item>
          <a-form-item label="封面">
            <a-input v-model="rule.itemData.cover"></a-input>
          </a-form-item>
          <a-form-item label="更新时间">
            <a-input v-model="rule.itemData.updateTime"></a-input>
          </a-form-item>
        </a-form-item>
      </template>
    </a-form>
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

  emits: ['update:modelValue'],

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
          this.rule.type = this.type
          this.rule.version = +new Date()
          if (this.rule.type.includes('news')) {
            this.rule.data = {}
            this.rule.itemData = {}
          }
        }
      }
    }
  }
})
</script>

<style lang="scss">
.origin-create-rule {
  .items-data {
    display: block;
  }
}
</style>
