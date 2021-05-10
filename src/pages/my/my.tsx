import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.less'

export default class My extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>我的</Text>
      </View>
    )
  }
}
