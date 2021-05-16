import Taro from '@tarojs/taro';
import React from 'react';
import { createInnerAudioContext } from '@/components/createInnerAudioContext';

let audioContext
if (Taro.getEnv() === 'WEAPP') {
  audioContext = Taro.getBackgroundAudioManager();
} else if (Taro.getEnv() === 'WEB') {
  audioContext = createInnerAudioContext();
}

export {
  audioContext as innerAudioContext
}

export default React.createContext({
  innerAudioContext: audioContext,
  musicInfo: {},
  setMusicInfo: () => { },
});
