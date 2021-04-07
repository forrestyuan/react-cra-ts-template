import './App.scss'
import '@/styles/antd.less'
import { useRoutes } from 'react-router-dom'
import { useSetRem } from './utils/use-set-rem'
import Login from '@/modules/login'
export function App() {
  useSetRem()
  const routes = useRoutes([
    { path: 'login', element: <Login /> },
    { path: '/', element: <div>hello world</div> },
  ])

  return routes
}
