import './App.scss'
import '@/styles/antd.less'
import { useRoutes } from 'react-router-dom'
import { useSetRem } from './utils/use-set-rem'
import Login from '@/modules/login'
import Layout from '@/modules/layout'
import Home from '@/modules/home'
export function App() {
  useSetRem()
  const routes = useRoutes([
    { path: 'login', element: <Login /> },
    {
      path: '/',
      element: <Layout />,
      children: [{ path: '', element: <Home /> }],
    },
  ])

  return routes
}
