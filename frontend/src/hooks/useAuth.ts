import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'
import { isNil } from 'lodash-es'
import { Group } from '@/utils/Request/User'

const useAuth = () => {
  const { userInfo } = useSelector((state: RootState) => state.common)

  const isSubscriber = !isNil(userInfo) && userInfo.group! >= Group.SUBSCRIBER

  return {
    isSubscriber,
    isAdmin: isSubscriber && userInfo.group! >= Group.ADMIN,
    isSuperAdmin: isSubscriber && userInfo.group! >= Group.SUPER_ADMIN,
  }
}

export default useAuth
