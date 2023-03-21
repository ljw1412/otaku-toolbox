import { reactive, computed, ComputedRef, UnwrapNestedRefs } from 'vue'
import API from '../apis'

interface UserStore {
  isDisplayLoginDialog: boolean
  isLoaded: boolean
  isLogined: ComputedRef<boolean>
  current: BaseUserInfo
  fetchCurrentUser: () => Promise<void>
}

const store = reactive({
  isDisplayLoginDialog: false,
  isLoaded: false,
  isLogined: computed(() => !!store.current._id),
  current: {} as BaseUserInfo
}) as UnwrapNestedRefs<UserStore>

store.fetchCurrentUser = async () => {
  if (document.cookie.includes('token=')) {
    const user = await API.User.whoami()
    store.current = user
  }
  store.isLoaded = true
}

store.fetchCurrentUser()

export default store
