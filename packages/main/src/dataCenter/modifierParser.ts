import { typeOf } from '../utils/object'
import { isDebugger } from './parser'

function checkInputType(data: any, type: string) {
  const isTruly = typeOf(data) === type
  if (!isTruly && isDebugger) {
    console.log(
      '[checkInputType]',
      `传入数据："${data}"，不为预设的类型${type}！`
    )
  }
  return isTruly
}

function log(modifier: string, message?: string) {
  if (isDebugger) {
    console.log(`[parseModifier]{${modifier}}`, message)
  }
}

const modifierParsers = {
  match: {
    inputType: 'string',
    fn(str: string, modifier: string) {
      const [, regExpStr, n = '0'] = modifier.split('#')
      if (regExpStr) {
        const match = str.match(new RegExp(regExpStr))
        str = match ? match[parseInt(n)] : ''
        return { result: str, error: false }
      }
      log(modifier, '正则表达式字符串不存在！')
      return { result: '', error: true }
    }
  },
  split: {
    inputType: 'string',
    fn(str: string, modifier: string) {
      const splitStr = modifier.split('#')[1]
      if (splitStr) {
        const result = str.split(splitStr)
        return { result, error: false }
      }
      log(modifier, '分割字符串不存在！')
      return { result: [], error: true }
    }
  },
  replace: {
    inputType: 'string',
    fn(str: string, modifier: string) {
      const [, a, b] = modifier.split('#')
      return { result: str.replace(new RegExp(a, 'g'), b), error: false }
    }
  },
  trim: {
    inputType: 'string',
    fn(str: string, modifier: string) {
      return { result: str.trim(), error: false }
    }
  },
  append: {
    inputType: 'string',
    fn(str: string, modifier: string) {
      const appendText = modifier.split('#')[1] || ''
      return { result: str + appendText, error: false }
    }
  },
  prepend: {
    inputType: 'string',
    fn(str: string, modifier: string) {
      const prependText = modifier.split('#')[1] || ''
      return { result: prependText + str, error: false }
    }
  },
  function: {
    inputType: 'string',
    fn(str: string, modifier: string) {
      const fn = new Function(str)
      return { result: fn(), error: false }
    }
  },
  eval: {
    inputType: 'string',
    fn(str: string, modifier: string) {
      return { result: eval(str), error: false }
    }
  },
  eq: {
    inputType: 'array',
    fn(list: any[], modifier: string) {
      const i = parseInt(modifier.split('#')[1] || '')
      return { result: list[i], error: false }
    }
  }
}

export default function(str: any, modifier: string) {
  let modifierName = ''
  for (const key in modifierParsers) {
    if (modifier.startsWith(key)) {
      modifierName = key
      break
    }
  }
  if (!modifierName) {
    log(modifier, '不支持的修饰符！')
    return
  }

  const modifierParser =
    modifierParsers[modifierName as keyof typeof modifierParsers]

  if (!checkInputType(str, modifierParser.inputType)) {
    log(
      modifier,
      `该修饰符不支持非{${modifierParser.inputType}}的数据！此次输入数据：${str}`
    )
    return
  }

  const { result } = modifierParser.fn(str, modifier)
  log(modifier, `=> 结果:${result}`)
  return result
}
