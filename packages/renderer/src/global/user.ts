import { useLocalStorage } from '@vueuse/core'
import { reactive, computed, ComputedRef, UnwrapNestedRefs, watch } from 'vue'
import API from '../apis'

interface UserStore {
  token: string
  isDisplayLoginDialog: boolean
  isLoaded: boolean
  isLogined: ComputedRef<boolean>
  current: BaseUserInfo
  fetchCurrentUser: () => Promise<void>
}

export const currentUser = useLocalStorage('APP_USER', {})

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

watch(
  () => currentUser.value,
  (user) => {
    store.fetchCurrentUser()
  }
)

export default store
