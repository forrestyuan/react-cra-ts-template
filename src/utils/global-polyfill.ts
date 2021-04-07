import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import 'matchmedia-polyfill'
import 'matchmedia-polyfill/matchMedia.addListener'
//mobx on older javascript envirnoment
// 兼容ie
import { removePolyfill } from './remove-polyfill'
import './canvas-to-blob-polyfill'
import { configure } from 'mobx'
configure({ useProxies: 'never' }) // Or "ifavailable".

removePolyfill()
