export function getPageUrl(path: string) {
  const base = location.origin + location.pathname
  return base + path
}

export function safeBoolean(b?: boolean, defaultVal = false): boolean {
  return b === undefined ? defaultVal : b
}
