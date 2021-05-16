import Taro from '@tarojs/taro';
import { Component } from 'react';
import 'default-passive-events';
import MusicContext,{innerAudioContext} from './MusicContext';
import { getWindowHeight } from '@/utils/utils'
import './custom-variables.scss';
import './app.less';

const style = { '--color-brand': '#31c27c' }

class App extends Component {
  constructor(props) {
    super(props);
    if (Taro.getEnv() === 'WEB'){
      innerAudioContext.autoplay = true;
    }
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
      style
    };
  }

  componentDidMount() {
    let vh = getWindowHeight();
    this.setState((prev) => ({
      style:{...prev.style,'--vh':`${vh}`}
    }))
    if (!Object.keys(this.state.musicInfo).length) {
      const info = Taro.getStorageSync('currentMusicInfo');
      if (!info?.url) {
        return;
      }
      innerAudioContext.src = info.url;
      innerAudioContext.title = info.musicName;
      innerAudioContext.epname = info.albumName;
      innerAudioContext.singer = info.author;
      innerAudioContext.coverImgUrl = info.albumPicUrl;
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
      </MusicContext.Provider>
    );
  }
}

export default App;
