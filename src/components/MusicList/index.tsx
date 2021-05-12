
import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { View, ScrollView, Text, Image } from '@tarojs/components';
import {
  AtActivityIndicator,
} from 'taro-ui';
import { search } from '@/utils/music/mg';
import { video } from '@/assets/images';
import styles from './index.module.less';

const MusicList = () => {
  const [searchValue, setSearchValue] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [current, setCurrent] = useState(0);
  const [list, setList] = useState([]);
  const [noMore, setNoMore] = useState(false);
  const [loading, setLoading] = useState(false);
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

  return (
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
      {list.map((item,index) => {
        return (
          <View
            key={item.id}
            onClick={() => {
              // innerAudioContext.src = item.url;
            }}
            className={styles['list-item']}
          >
            <View className={styles['list-item-left']}>
              <View className={styles.num}>{index+1}</View>
              <View>
                <View className={styles['music-name']}>{item.name}</View>
                <Text>{item.artists[0].name}</Text> -
                <Text>{item.album.name}</Text>
              </View>
            </View>
            <Image src={video} className={styles['video-icon']} />
          </View>
        );
      })}
      {noMore && <View>到底了</View>}
    </ScrollView>
  );
};

export default MusicList;
