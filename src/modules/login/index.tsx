import { observer } from 'mobx-react-lite'
import { Image, Button } from 'antd'
import { Link } from 'react-router-dom'
import { useLoginStore } from './store'
import { useRef } from 'react'
import useMount from 'react-use/esm/useMount'
const Login = observer(() => {
  const store = useLoginStore()
  const count = useRef(0)
  const handleClick = () => {
    count.current++
    console.log(
      '%c 🌰 count: ',
      'font-size:20px;background-color: #FCA650;color:#fff;',
      count,
    )
  }
  useMount(() => {
    console.log(
      '%c 🥤 count: ',
      'font-size:20px;background-color: #E41A6A;color:#fff;',
      count,
    )
  })
  return (
    <div>
      <Image
        width={200}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
      hello{store.name}
      <Button type="primary" onClick={handleClick}>
        count增加一下吧
      </Button>
      <Link to="/">首页</Link>
    </div>
  )
})

export default Login
export { Login }
