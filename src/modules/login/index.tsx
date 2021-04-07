import { observer } from 'mobx-react-lite'
import { Image } from 'antd'
import { useLoginStore } from './store'
const Login = observer(() => {
  const store = useLoginStore()
  return (
    <div>
      <Image
        width={200}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
      hello{store.name}
    </div>
  )
})

export default Login
export { Login }
