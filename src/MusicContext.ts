import Taro from '@tarojs/taro';
import React from 'react';

export const innerAudioContext = Taro.createInnerAudioContext();

export default React.createContext({
    innerAudioContext,
    musicInfo: {},
    setMusicInfo: () => {},
  });
  