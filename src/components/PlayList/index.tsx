import Taro from '@tarojs/taro';
import React, { useState, useContext } from 'react';
import { AtFloatLayout } from 'taro-ui';
import { View } from '@tarojs/components';
import { play, stop, list } from '@/assets/images';
import styles from './index.module.less';
import { MusicContext } from '@/app';
import MusicList from '@/components/MusicList';
import { musicTypeService } from '@/utils/music/musicTypeList';

interface PlayListProps {
  isOpened: boolean;
}

const PlayList = ({ isOpened }: PlayListProps) => {
  const {
    innerAudioContext,
    setMusicInfo,
    musicInfo,
    isPlayListOpen,
    playList,
  } = useContext(MusicContext);

  const { musicName, author = [], albumPicUrl } = musicInfo;

  const handleItemClick = async (detail, _, type) => {
    let { url } = detail;
    if (!url) {
      const u = await musicTypeService[type].getSongUrl(detail.id);
      url = u;
    }
    innerAudioContext.src = url;
    setMusicInfo({ musicInfo: { ...detail, url } });
  }

  return (
    <AtFloatLayout
      isOpened={isOpened}
      onClose={() => setMusicInfo({ isPlayListOpen: !isPlayListOpen })}
      className={styles['play-list']}
    >
      <MusicList
        height="auto"
        data={playList}
        onItemClick={handleItemClick}
      />
    </AtFloatLayout>
  );
};

export default React.memo(PlayList);
