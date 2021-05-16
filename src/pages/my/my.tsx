import { useState, useContext, useRef, useEffect } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, Input, Picker } from '@tarojs/components';
import { avatar } from '@/assets/images';
import { AtAvatar, AtTabs, AtTabsPane, AtButton } from 'taro-ui';
import MusicList from '@/components/MusicList';
import MusicContext from '../../MusicContext';
import { musicTypeService } from '@/utils/music/musicTypeList';
import { themeColorList } from '@/utils/utils';
import MusicBar from '@/components/MusicBar';
import PlayList from '@/components/PlayList';
import styles from './index.module.less';

const My = () => {
  const colorRef = useRef();
  const [current, setCurrent] = useState(0);
  const [latelyMusic, setLatelyMusic] = useState([]);
  const [themeIndex, setThemeIndex] = useState(0);
  const { innerAudioContext, setMusicInfo, isPlayListOpen, style } = useContext(MusicContext);

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
    setMusicInfo({
      style: {
        ...style,
        '--color-brand': colorRef.current.value,
      },
    });
  };

  const onPickerChange = (e) => {
    setThemeIndex(e.detail.value);
    const d = themeColorList[e.detail.value];
    setMusicInfo({
      style: {
        ...style,
        '--color-brand': d.value,
      },
    });
  };

  useEffect(() => {
    // if (Taro.getEnv() === 'WEAPP'){
    //   Taro.getUserProfile({
    //     desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //     success: (res) => {
    //       console.log(res,'res');
    //     }
    //   })
    // }
  },[])

  return (
    <View style={style}>
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
            height='auto'
            data={latelyMusic}
            onItemClick={handleItemClick}
            id={'wd-scroll-list'}
          />
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View>暂未开放</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          <View>
            {Taro.getEnv() === 'WEB' ? (
              <View className={styles.color}>
                <Text>设置主题色</Text>
                <Input
                  type='color'
                  ref={colorRef}
                  className={styles['color-input']}
                />
                <AtButton type='primary' size='small' onClick={setColorBrand}>
                  确定
                </AtButton>
              </View>
            ) : (
              <Picker
                mode='selector'
                range={themeColorList}
                rangeKey='title'
                onChange={onPickerChange}
              >
                <View className={styles.color}>
                  <Text>设置主题色</Text>
                  <View
                    className={styles['theme-color']}
                    style={{ background: `${style['--color-brand']}` }}
                  ></View>
                  <Text className={styles['theme-title']}>
                    {themeColorList[themeIndex].title}
                  </Text>
                </View>
              </Picker>
            )}
          </View>
        </AtTabsPane>
      </AtTabs>
      <MusicBar />
      <PlayList isOpened={isPlayListOpen} />
    </View>
  );
};

export default My;
