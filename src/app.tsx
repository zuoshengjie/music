import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import 'default-passive-events';
import 'taro-ui/dist/style/index.scss';
import './app.less';

const innerAudioContext = Taro.createInnerAudioContext();
innerAudioContext.autoplay = true;
innerAudioContext.onPlay(() => {
  console.log('开始播放');
});
innerAudioContext.onError((res) => {
  console.log(res.errMsg);
  console.log(res.errCode);
});

const MusicContext = React.createContext({
  innerAudioContext,
  musicInfo: {},
  setMusicInfo: () => {},
});

class App extends Component {
  state = {
    musicInfo: {},
  };

  componentDidMount() {
    const vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return (
      <MusicContext.Provider value={this.state}>
        {this.props.children}
      </MusicContext.Provider>
    );
  }
}

export default App;
