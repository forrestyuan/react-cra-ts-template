import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

const Home = observer(() => {
  return (
    <div>
      <Link to="/login">
        <Button>去登录页</Button>
      </Link>
    </div>
  )
})
export default Home
export { Home }
