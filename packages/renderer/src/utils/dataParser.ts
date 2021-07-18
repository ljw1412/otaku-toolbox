export function bangumiXml2Json(doc: Document) {
  const bangumi: Record<string, any>[] = []
  function parseChildren(el: Element, obj: Record<string, any>) {
    Array.from(el.children).forEach(item => {
      if (
        item.childElementCount === 0 &&
        item.childNodes[0] &&
        item.childNodes[0].nodeName === '#text'
      ) {
        obj[item.tagName] = (item.childNodes[0] as Text).data
      } else if (
        item.tagName === 'zh_CN' &&
        item.parentElement?.tagName === 'tag'
      ) {
        obj[item.tagName] = Array.from(item.children).map(
          item => item.textContent
        )
      } else {
        obj[item.tagName] = {}
        parseChildren(item, obj[item.tagName])
      }
    })
  }

  Array.from(doc.documentElement.children).forEach(item => {
    const obj: Record<string, any> = {}
    parseChildren(item, obj)
    bangumi.push(obj)
  })
  console.log(bangumi)

  return bangumi
}
