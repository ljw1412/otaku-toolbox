import { parseHTML } from './html/parser'

export default async function ruleRunner(
  rule: DataCenter.Rule,
  options: DataCenter.RunnerOptions = { replacer: { page: 1 } }
) {
  const { mode = 'html' } = rule
  if (mode === 'html') {
    return await parseHTML(rule, options)
  }
}
