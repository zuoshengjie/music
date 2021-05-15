import Taro from '@tarojs/taro';
import React, { Component } from 'react';
import { createInnerAudioContext } from '@/components/createInnerAudioContext';
import 'default-passive-events';
import './custom-variables.scss';
import './app.less';
import PlayList from '@/components/PlayList';
import MusicContext,{innerAudioContext} from './MusicContext';
import { play } from '@/assets/images';

// const innerAudioContext = Taro.createInnerAudioContext();

// export const MusicContext = React.createContext({
//   innerAudioContext,
//   musicInfo: {},
//   setMusicInfo: () => {},
// });

console.log(MusicContext,'MusicContext')
class App extends Component {
  constructor(props) {
    super(props);
    innerAudioContext.autoplay = true;
    innerAudioContext.onPlay(() => {
      console.log('播放');
      const musicInfo = Taro.getStorageSync('currentMusicInfo');
      if (musicInfo?.id !== this.state.musicInfo?.id) {
        Taro.setStorageSync('currentMusicInfo', this.state.musicInfo);
      }
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
      playList: [],
      isPlayListOpen: false,
    };
  }

  componentDidMount() {
    const vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--color-brand', `#31c27c`);
    if (!Object.keys(this.state.musicInfo).length) {
      const info = Taro.getStorageSync('currentMusicInfo');
      if (!info?.url) {
        return;
      }
      innerAudioContext.src = info.url;
      this.setState({ musicInfo: info });
    }
    const pl = Taro.getStorageSync('playList');
    if (!this.state.playList.length && pl?.length) {
      this.setState({ playList: pl });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.playList) !==
        JSON.stringify(prevState.playList) &&
      prevState.playList.length
    ) {
      Taro.setStorageSync('playList', prevState.playList);
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return (
      <MusicContext.Provider value={this.state}>
        {this.props.children}
        <PlayList isOpened={this.state.isPlayListOpen} />
      </MusicContext.Provider>
    );
  }
}

export default App;
