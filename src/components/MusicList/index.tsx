import { useState } from 'react';
import { View, ScrollView, Text, Image } from '@tarojs/components';
import { AtActivityIndicator, AtLoadMore } from 'taro-ui';
import { video } from '@/assets/images';
import { useUpdateEffect, useLockFn, useDebounceFn } from 'ahooks';
import styles from './index.module.less';

const differenceBy = (arr, key) => {
  return Object.values(
    arr.reduce((p, c) => {
      return { ...p, [c[key]]: c };
    }, {}),
  );
};

const MusicList = (props) => {
  const { service, params, onItemClick, type } = props;
  const [pageNo, setPageNo] = useState(1);
  const [list, setList] = useState([]);
  const [isNoMore, setIsNoMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const getData = useLockFn(async (pageN) => {
    setLoading(true);
    const { success, data } = await service(params, pageN);
    if (success) {
      const { rows, totalCount, pageNum, pageSize } = data;
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

  const onScroll = async (e) => {
    const { scrollTop, scrollHeight } = e.detail;
    if (scrollTop >= scrollHeight - e.target.clientHeight - 300) {
      debounceGetData();
    }
  };

  useUpdateEffect(() => {
    getData(1);
  }, [params]);

  return (
    <ScrollView
      className={styles['scroll-view']}
      scrollY
      showScrollbar
      onScroll={onScroll}
      // onScrollToLower={onScrollToLower}
      // lowerThreshold={300}
    >
      {list.length ? (
        list.map((item: any, index) => {
          return (
            <View
              key={item.id}
              onClick={() => {
                onItemClick(item, index, type);
              }}
              className={styles['list-item']}
            >
              <View className={styles['list-item-left']}>
                <View className={styles.num}>{index + 1}</View>
                <View>
                  <View className={styles['music-name']}>{item.musicName}</View>
                  <Text>{item.author.map((author) => author.name)}</Text> -
                  <Text>{item.albumName}</Text>
                </View>
              </View>
              {!!item.mvId && (
                <Image src={video} className={styles['video-icon']} />
              )}
            </View>
          );
        })
      ) : (
        <View className={styles.empty}>搜你所想~</View>
      )}
      <AtActivityIndicator
        // mode="center"
        content="加载中"
        size={32}
        className={styles.loading}
        isOpened={loading}
      />
      {isNoMore && <View>到底了</View>}
    </ScrollView>
  );
};

export default MusicList;
