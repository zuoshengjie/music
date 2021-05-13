import { useState, useContext } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { avatar } from '@/assets/images';
import { AtAvatar, AtTabs, AtTabsPane } from 'taro-ui';
import styles from './index.module.less';
import MusicList from '@/components/MusicList';
import { MusicContext } from '@/app';
import { getSongUrl as mgGetSongUrl } from '@/utils/music/mg';
import { getSongUrl as wyyGetSongUrl } from '@/utils/music/wyy';

import MusicBar from '@/components/MusicBar';

const musicTypeList = [
  { title: '咪咕音乐', key: 'mg', service: { getSongUrl: mgGetSongUrl } },
  { title: '酷我音乐', key: 'kw' },
  { title: '网易云音乐', key: 'wyy', service: { getSongUrl: wyyGetSongUrl } },
];

const musicTypeService = musicTypeList.reduce((p, v) => {
  return { ...p, [v.key]: v.service };
}, {});

const My = () => {
  const [current, setCurrent] = useState(0);
  const [latelyMusic, setLatelyMusic] = useState([]);
  const { innerAudioContext, setMusicInfo, musicInfo, isPlay } =
    useContext(MusicContext);

  useDidShow(() => {
    setLatelyMusic(Taro.getStorageSync('lately') || []);
  });

  const handleItemClick = async (detail, _, type) => {
    let { url } = detail;
    if (!url) {
      const u = await musicTypeService[type].getSongUrl(detail.id);
      url = u;
    }
    if (innerAudioContext.src !== url){
      innerAudioContext.src = url;
      setMusicInfo({ musicInfo: detail });
    }
    Taro.navigateTo({url:'/pages/musicDetail/musicDetail'})
  };

  const onTabsClick = (c) => {
    setLatelyMusic(Taro.getStorageSync('lately') || []);
    setCurrent(c);
  };
  console.log(musicInfo,'my-musicInfo');
  return (
    <View>
      <View className={styles.top}>
        <View className={styles['top-bg']} />
        <View className={styles['top-center']}>
          <AtAvatar image={avatar} circle className={styles.avatar} />
          <Text style={{ textShadow: '2px 2px 8px #000' }}>啦啦啦</Text>
        </View>
      </View>
      <AtTabs
        current={current}
        scroll
        tabList={[{ title: `最近/${latelyMusic.length}` }, { title: '收藏' }]}
        onClick={onTabsClick}
      >
        <AtTabsPane current={current} index={0}>
          <MusicList
            height='auto'
            data={latelyMusic}
            onItemClick={handleItemClick}
          />
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View>酷我音乐</View>
        </AtTabsPane>
      </AtTabs>
      <MusicBar />
    </View>
  );
};

export default My;
