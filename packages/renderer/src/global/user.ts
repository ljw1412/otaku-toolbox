import { reactive, computed, ComputedRef, UnwrapNestedRefs } from 'vue'
import API from '../apis'

interface UserStore {
  isDisplayLoginDialog: boolean
  isLogin: ComputedRef<boolean>
  current: BaseUserInfo
  fetchCurrentUser: () => Promise<void>
}

const store = reactive({
  isDisplayLoginDialog: false,
  isLogin: computed(() => !!store.current._id),
  current: {} as BaseUserInfo
}) as UnwrapNestedRefs<UserStore>

store.fetchCurrentUser = async () => {
  const user = await API.User.whoami()
  store.current = user
}

if (document.cookie.includes('token=')) {
  store.fetchCurrentUser()
}

export default store
