type ThemeTypes = 'default' | 'dark'

type ThemeHelper = {
  themes: typeof themes
  init(): void
  get(): string
  set(name: string): void
} & { [x in ThemeTypes]?: () => void }

interface Window {
  $theme: ThemeHelper
}
