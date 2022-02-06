import Favorites from '/@/IDB/comic/Favorites'
import History from '/@/IDB/comic/History'

declare global {
  interface IDBTables {
    favorites: Favorites
    history: History
  }

  interface Window {
    $theme: ThemeHelper
    $dayjs: dayjs
    $db: IDBTables

    usePlugin: () => Record<string, any>
  }
}
