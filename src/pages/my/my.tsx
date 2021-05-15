import { useState, useContext, useRef } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import { avatar } from '@/assets/images';
import { AtAvatar, AtTabs, AtTabsPane, AtButton } from 'taro-ui';
import MusicList from '@/components/MusicList';
import  MusicContext from '../../MusicContext';
import { musicTypeService } from '@/utils/music/musicTypeList';
import MusicBar from '@/components/MusicBar';
import styles from './index.module.less';

const My = () => {
  const colorRef = useRef();
  const [current, setCurrent] = useState(0);
  const [latelyMusic, setLatelyMusic] = useState([]);
  const { innerAudioContext, setMusicInfo, musicInfo, playList } =
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
    if (innerAudioContext.src !== url) {
      innerAudioContext.src = url;
      setMusicInfo({ musicInfo: { ...detail, url }, playList: latelyMusic });
    }

    Taro.navigateTo({ url: '/pages/musicDetail/musicDetail' });
  };

  const onTabsClick = (c) => {
    setLatelyMusic(Taro.getStorageSync('lately') || []);
    setCurrent(c);
  };

  const setColorBrand = () => {
    document.documentElement.style.setProperty(
      '--color-brand',
      colorRef.current.value,
    );
  };

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
        tabList={[
          { title: `最近/${latelyMusic.length}` },
          { title: '收藏' },
          { title: '设置' },
        ]}
        onClick={onTabsClick}
      >
        <AtTabsPane current={current} index={0}>
          <MusicList
            height="auto"
            data={latelyMusic}
            onItemClick={handleItemClick}
          />
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View>收藏</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          <View>
            <View className={styles.color}>
              <Text>设置主题色</Text>
              <Input
                type="color"
                ref={colorRef}
                className={styles['color-input']}
              />
              <AtButton type="primary" size="small" onClick={setColorBrand}>
                确定
              </AtButton>
            </View>
          </View>
        </AtTabsPane>
      </AtTabs>
      <MusicBar />
    </View>
  );
};

export default My;
