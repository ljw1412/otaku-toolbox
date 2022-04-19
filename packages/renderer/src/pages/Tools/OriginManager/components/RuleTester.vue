<template>
  <div class="rule-tester">
    <a-space class="action px-8 pt-6 pb-12">
      <a-button type="primary" :disabled="!input" :loading="running" @click="runRule">运行</a-button>
      <a-button :loading="running" status="danger" @click="input = ''; output = ''">重置</a-button>
    </a-space>
    <div class="io-area d-flex px-8">
      <a-textarea
        v-model="input"
        class="tester-text-area text-input flex-grow-1 w-50 mr-4"
        allow-clear
        placeholder="JSON格式规则输入"
        :auto-size="{ minRows: 27, maxRows: 27 }"
      ></a-textarea>
      <a-textarea
        v-model="output"
        class="tester-text-area text-output flex-grow-1 w-50 ml-4"
        readonly
        placeholder="结果输出"
        :auto-size="{ minRows: 27, maxRows: 27 }"
      ></a-textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RuleTester',

  data() {
    return {
      running: false,
      input: '',
      output: ''
    }
  },

  methods: {
    async runRule() {
      this.running = true
      try {
        const rule = JSON.parse(this.input)
        const result = await this.$API.DataCenter.runRule(rule)
        console.log(result)
        this.output = JSON.stringify(result, null, 2)
      } catch (error: any) {
        console.error(error)
        if (error.message.includes('Unexpected end of JSON input')) {
          this.$message.error('解析JSON失败！请输入正确的JSON数据')
        } else {
          this.$message.error(error.message)
        }
      }
      this.running = false
    }
  }
})
</script>

<style lang="scss">
.rule-tester {
  overflow: hidden;

  .tester-text-area {
    box-sizing: border-box;
  }
}
</style>
