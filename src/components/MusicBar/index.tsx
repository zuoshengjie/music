import Taro from '@tarojs/taro';
import { useState, useContext } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { play, stop, list } from '@/assets/images';
import styles from './index.module.less';
import MusicContext from '../../MusicContext';

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

  return (
    <View
      className={styles['music-bar']}
      style={{ display: musicName ? 'flex' : 'none' }}
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
          onClick={(e) => {
            e.stopPropagation();
            setMusicInfo({ isPlayListOpen: !isPlayListOpen });
          }}
        />
      </View>
    </View>
  );
};

export default MusicBar;
