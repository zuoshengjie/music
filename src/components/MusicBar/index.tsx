import Taro from '@tarojs/taro';
import { useState, useContext } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { play, stop, list } from '@/assets/images';
import MusicContext from '../../MusicContext';
import PlayList from '@/components/PlayList';

import styles from './index.module.less';


// interface MusicBarProps {
//   musicName: string;
//   author: [];
//   albumPicUrl: string;
//   isPlay: boolean;
//   handlePlay: () => void;
// }

const MusicBar = () => {
  const { innerAudioContext, setMusicInfo, musicInfo, isPlay, isPlayListOpen } =
    useContext(MusicContext);

  const { musicName, author = [], albumPicUrl } = musicInfo;

  const handlePlay = (e) => {
    e.stopPropagation();
    if (isPlay) {
      innerAudioContext.pause();
    } else {
      innerAudioContext.play();
    }
  };

  const handleMusicBar = () => {
    Taro.navigateTo({ url: '/pages/musicDetail/musicDetail' });
  };

  const handleList = (e) => {
    e.stopPropagation();
    setMusicInfo({ isPlayListOpen: !isPlayListOpen });
  }
  return (
    <View
      className={styles['music-bar']}
      style={{ display: musicName ? 'flex' : 'none',bottom:Taro.getEnv() === 'WEAPP' ? '0px' : '53px' }}
      onClick={handleMusicBar}
    >
      <View className={styles['music-bar-left']}>
        <Image src={albumPicUrl} className={styles.pic} />
        <View>
          <Text>{musicName}</Text>
          <Text className={styles.author}>
            - {author.map((item: any) => item.name)}
          </Text>
        </View>
      </View>
      <View className={styles['music-bar-right']}>
        <Image
          src={isPlay ? stop : play}
          className={styles.icon}
          onClick={handlePlay}
        />
        <Image
          src={list}
          className={styles.icon}
          onClick={handleList}
        />
      </View>
      {/* <PlayList isOpened={isPlayListOpen} /> */}
    </View>
  );
};

export default MusicBar;
