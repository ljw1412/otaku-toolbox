export function safeElementPosition(el: HTMLElement) {
  const computedStyle = window.getComputedStyle(el)
  if (computedStyle && computedStyle.position === 'static') {
    el.style.position = 'relative'
    el.dataset.previousPosition = 'static'
  }
}
