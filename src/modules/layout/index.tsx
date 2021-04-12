import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'

const Layout = observer(() => {
  return <Outlet />
})
export default Layout
export { Layout }
