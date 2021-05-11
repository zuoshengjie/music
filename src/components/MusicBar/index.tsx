import { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { play, stop, list } from '@/assets/images';
import styles from './index.module.less';

interface MusicBarProps {
  name: string;
  author: string;
  picUrl: string;
  isPlay: boolean;
}

const MusicBar = (props: MusicBarProps) => {
  const { name, author, picUrl, isPlay } = props;
  return (
    <View className={styles['music-bar']}>
      <View className={styles['music-bar-left']}>
        <Image src={picUrl} className={styles.pic} />
        <View>
          <Text>{name}</Text>
          <Text className={styles.author}> - {author}</Text>
        </View>
      </View>
      <View className={styles['music-bar-right']}>
        <Image src={isPlay ? play : stop} className={styles.icon} />
        <Image src={list} className={styles.icon} />
      </View>
    </View>
  );
};

export default MusicBar;
