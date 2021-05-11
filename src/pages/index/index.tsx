import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { View, Audio, ScrollView, Text, Image } from '@tarojs/components';
import {
  AtSearchBar,
  AtTabs,
  AtTabsPane,
  AtButton,
  AtActivityIndicator,
} from 'taro-ui';
import { search } from '@/utils/music/mg';
import MusicBar from '@/components/MusicBar';
import { video } from '@/assets/images';
import styles from './index.module.less';

const innerAudioContext = Taro.createInnerAudioContext();
innerAudioContext.autoplay = true;
// innerAudioContext.src =
//   'https://freetyst.nf.migu.cn/public%2Fproduct5th%2Fproduct35%2F2019%2F10%2F1618%2F2009%E5%B9%B406%E6%9C%8826%E6%97%A5%E5%8D%9A%E5%B0%94%E6%99%AE%E6%96%AF%2F%E5%85%A8%E6%9B%B2%E8%AF%95%E5%90%AC%2FMp3_64_22_16%2F60054701934.mp3';
innerAudioContext.onPlay(() => {
  console.log('开始播放');
});
innerAudioContext.onError((res) => {
  console.log(res.errMsg);
  console.log(res.errCode);
});

const musicTypeList = [
  { title: '咪咕音乐' },
  { title: '酷我音乐' },
  { title: '网易云音乐' },
];

const Index = () => {
  const [searchValue, setSearchValue] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [current, setCurrent] = useState(0);
  const [list, setList] = useState([]);
  const [noMore, setNoMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const playMusic = () => {
    innerAudioContext.play();
  };
  const handleSearch = async () => {
    if (!searchValue || noMore) {
      return;
    }
    setLoading(true);
    const { list, total } = await search(searchValue, pageNo);
    if (pageNo * 20 >= total) {
      setNoMore(true);
    }
    setLoading(false);
    setList((v) => [...v, ...list]);
  };
  const onScrollToLower = () => {
    setPageNo((v) => v + 1);
  };

  useEffect(() => {
    handleSearch();
  }, [pageNo]);
  return (
    <View className={styles.index}>
      <AtSearchBar
        value={searchValue}
        onChange={setSearchValue}
        onActionClick={handleSearch}
      />
      <AtTabs
        current={current}
        scroll
        tabList={musicTypeList}
        onClick={setCurrent}
      >
        <AtTabsPane current={current} index={0}>
          {/*<AtButton type='primary' onClick={playMusic}>*/}
          {/*  播放音乐*/}
          {/*</AtButton>*/}
          <ScrollView
            className={styles['scroll-view']}
            scrollY
            onScrollToLower={onScrollToLower}
            lowerThreshold={300}
          >
            <AtActivityIndicator
              mode="center"
              content="加载中"
              isOpened={loading}
            />
            {list.map((item) => {
              return (
                <View
                  key={item.id}
                  onClick={() => {
                    innerAudioContext.src = item.url;
                  }}
                  className={styles['list-item']}
                >
                  <View>
                    <View className={styles['music-name']}>{item.name}</View>
                    <Text>{item.artists[0].name}</Text> -
                    <Text>{item.album.name}</Text>
                  </View>
                  <Image src={video} className={styles['video-icon']} />
                </View>
              );
            })}
            {noMore && <View>到底了</View>}
          </ScrollView>
          {/*<Audio*/}
          {/*  src='https://freetyst.nf.migu.cn/public%2Fproduct5th%2Fproduct35%2F2019%2F10%2F1618%2F2009%E5%B9%B406%E6%9C%8826%E6%97%A5%E5%8D%9A%E5%B0%94%E6%99%AE%E6%96%AF%2F%E5%85%A8%E6%9B%B2%E8%AF%95%E5%90%AC%2FMp3_64_22_16%2F60054701934.mp3'*/}
          {/*  controls*/}
          {/*  muted={false}*/}
          {/*  autoplay={false}*/}
          {/*  loop={false}*/}
          {/*  initialTime='30'*/}
          {/*  name='测试'*/}
          {/*  id='video'*/}
          {/*/>*/}
          {/*<View style='font-size:18px;text-align:center;height:100px;'>*/}
          {/*  标签页一的内容*/}
          {/*</View>*/}
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View style="font-size:18px;text-align:center;height:100px;">
            标签页二的内容
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          <View style="font-size:18px;text-align:center;height:100px;">
            标签页三的内容
          </View>
        </AtTabsPane>
      </AtTabs>
      <MusicBar
        author="汪汪汪"
        name="月亮之上"
        isPlay
        picUrl="https://mcontent.migu.cn/newlv2/new/album/20200918/7949/s_XqFeoZdGOiPaNgY8.jpg"
      />
    </View>
  );
};

export default Index;
