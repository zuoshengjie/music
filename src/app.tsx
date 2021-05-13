import React, { Component } from 'react';
import { createInnerAudioContext } from '@/components/createInnerAudioContext';
import 'default-passive-events';
import 'taro-ui/dist/style/index.scss';
import './app.less';

const innerAudioContext = createInnerAudioContext();

export const MusicContext = React.createContext({
  innerAudioContext,
  musicInfo: {},
  setMusicInfo: () => {},
});

class App extends Component {
  constructor(props) {
    super(props);
    console.log('app constructor');
    innerAudioContext.autoplay = true;
    innerAudioContext.onPlay(() => {
      console.log('播放');
      this.setState({ isPlay: true });
    });
    innerAudioContext.onPause(() => {
      console.log('暂停');
      this.setState({ isPlay: false });
    });
    innerAudioContext.onStop(() => {
      console.log('停止');
      this.setState({ isPlay: false });
    });
    innerAudioContext.onError((res) => {
      this.setState({ isPlay: false });
      console.log(res.errMsg);
      console.log(res.errCode);
    });

    this.setMusicInfo = (v) => {
      this.setState(v);
    };
    this.state = {
      musicInfo: {},
      innerAudioContext,
      isPlay: false,
      setMusicInfo: this.setMusicInfo,
    };
  }

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
