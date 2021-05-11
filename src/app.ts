import { Component } from 'react'
import 'taro-ui/dist/style/index.scss'
import './app.less'

class App extends Component {

  componentDidMount () {
    const vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
