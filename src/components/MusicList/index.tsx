import Taro from '@tarojs/taro';
import { useCallback, useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { View, ScrollView, Text, Image } from '@tarojs/components';
import { AtActivityIndicator } from 'taro-ui';
import { mv } from '@/assets/images';
import { useUpdateEffect, useLockFn, useDebounceFn } from 'ahooks';
import MusicContext from '../../MusicContext';
import styles from './index.module.less';

const MusicList = (props) => {
  const { service, params, onItemClick, type, data, height, id } = props;
  const [pageNo, setPageNo] = useState(1);
  const [list, setList] = useState(data || []);
  const [isNoMore, setIsNoMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const scrollListHeight = useRef(0);

  const { musicInfo, style } = useContext(MusicContext);

  const getData = useLockFn(async (pageN) => {
    setLoading(true);
    const { success, data: sData } = await service(params, pageN);
    if (success) {
      const { rows, totalCount, pageNum, pageSize } = sData;
      if (pageNum * pageSize >= totalCount) {
        setIsNoMore(true);
      }
      if (pageN === 1) {
        setList(rows);
      } else {
        setList((v): any => [...v, ...rows]);
      }
      setPageNo(pageNum);
    }
    setLoading(false);
  });

  const { run: debounceGetData } = useDebounceFn(
    () => {
      getData(pageNo + 1);
    },
    {
      wait: 500,
      leading: true,
      trailing: false,
    },
  );

  useEffect(() => {
    setList(data || []);
  }, [data]);

  useLayoutEffect(() =>{
    setTimeout(() => {
      if (Taro.getEnv() === 'WEAPP'){
        Taro.createSelectorQuery().select(`#${id}`).fields({ size: true,},function (res){
          scrollListHeight.current = res.height
        }).exec()
      }else if(Taro.getEnv() === 'WEB'){
        scrollListHeight.current = document.getElementById(id).clientHeight;
      }
    },1000)
  },[])

  const onScroll = async (e) => {
    if (data?.length) {
      return;
    }
    // if (Taro.getEnv() === 'WEAPP'){
    //   Taro.createSelectorQuery().select(`#${id}`).boundingClientRect(function (res){
    //     console.log(res,'res2222')
    //     scrollListHeight.current = res.height
    //   }).exec()
    // }else if(Taro.getEnv() === 'WEB'){
    //   scrollListHeight.current = document.getElementById(id).clientHeight;
    // }
    const { scrollTop, scrollHeight } = e.detail;
    if (scrollTop >= scrollHeight - scrollListHeight.current - 300) {
      debounceGetData();
    }
  };

  useUpdateEffect(() => {
    getData(1);
  }, [params]);

  const itemClick = (item, index) => {
    const val = Taro.getStorageSync('lately') || [];
    const newLately = { ...item, musicType: type || item.musicType };
    const i = val.findIndex(
      (v) => v.id + v.musicType === newLately.id + newLately.musicType,
    );
    if (i >= 0) {
      Taro.setStorageSync('lately', [...val.splice(i, 1), ...val]);
    } else {
      Taro.setStorageSync('lately', [newLately, ...val]);
    }
    onItemClick(item, index, type || item.musicType);
  };

  return (
    <ScrollView
      className={styles['scroll-view']}
      scrollY
      showScrollbar
      onScroll={onScroll}
      style={{ ...style,height }}
      // onScrollToLower={onScrollToLower}
      // lowerThreshold={300}
      enableFlex
      id={id}
    >
      {list.length
        ? list.map((item: any, index) => {
            return (
              <View
                key={item.id}
                onClick={() => {
                  itemClick(
                    { ...item, musicType: item.musicType || type },
                    index,
                  );
                }}
                className={styles['list-item']}
                style={
                  musicInfo.id + musicInfo.musicType ===
                  item.id + (item.musicType || type)
                    ? { color: 'var(--color-brand)' }
                    : {}
                }
              >
                <View className={styles['list-item-left']}>
                  <View className={styles.num}>{index + 1}</View>
                  <View>
                    <View className={styles['music-name']}>
                      {item.musicName}
                    </View>
                    <Text>{item.author?.map((author) => author.name)}</Text> -
                    <Text>{item.albumName}</Text>
                  </View>
                </View>
                {!!item.mvId && (
                  <Image src={mv} className={styles['video-icon']} />
                )}
              </View>
            );
          })
        : !loading && <View className={styles.empty}>搜你所想~</View>}
      {
        loading && <AtActivityIndicator
            content='加载中'
            size={32}
            className={styles.loading}
            isOpened={loading}
        />
      }
      {isNoMore && <View>到底了</View>}
    </ScrollView>
  );
};

export default MusicList;
