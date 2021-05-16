import Taro from '@tarojs/taro';
import React from 'react';

console.log(Taro.getEnv(), 'Taro.getEnv()')

let audioContext
if (Taro.getEnv() === 'WEAPP') {
  audioContext = Taro.getBackgroundAudioManager();
} else if (Taro.getEnv() === 'WEB') {
  audioContext = Taro.createInnerAudioContext();
}

export {
  audioContext as innerAudioContext
}

export default React.createContext({
  innerAudioContext: audioContext,
  musicInfo: {},
  setMusicInfo: () => { },
});
