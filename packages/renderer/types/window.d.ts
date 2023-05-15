import Favorites from '/@/IDB/comic/Favorites'
import History from '/@/IDB/comic/History'
import API from '/@/apis/index'
import type DPlayer from 'DPlayer'

declare global {
  interface IDBTables {
    favorites: Favorites
    history: History
  }

  interface Window {
    $theme: ThemeHelper
    $dayjs: dayjs
    $db: IDBTables
    $API: API

    usePlugin: () => Record<string, any>
    DPlayer: typeof DPlayer.default
  }
}
