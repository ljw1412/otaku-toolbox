import Favorites from '/@/IDB/comic/Favorites'

declare global {
  interface IDBTables {
    favorites: Favorites
  }

  interface Window {
    $theme: ThemeHelper
    $dayjs: dayjs
    $db: IDBTables
  }
}
