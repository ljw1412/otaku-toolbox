const fs = require('fs')
const request = require('superagent')

const comic = {
  getRule: async function(website) {
    if (!website) return null
    try {
      const json = fs.readFileSync(`./rules/comic/${website}.json`)
      return JSON.parse(json)
    } catch (error) {
      return null
    }
  },
  getList: async function(website, page = 1) {
    const rule = await comic.getRule(website)
    if (!rule || !rule.rule || !rule.rule.list) return null
    const origin = rule.origin
    const listRule = rule.rule.list
    const method = listRule.method || 'get'
    const url = origin + listRule.url.replace('{{page}}', page)
    const resp = await request[method](url).proxy('http://127.0.0.1:1086')
    return resp.text
  }
}

module.exports = comic
