import { SuperAgentStatic } from 'superagent'

const request = require('superagent')

require('superagent-proxy')(request)

export default request as SuperAgentStatic
