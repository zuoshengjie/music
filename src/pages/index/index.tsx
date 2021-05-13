import { useState, useContext } from 'react';
import { View } from '@tarojs/components';
import { AtSearchBar, AtTabs, AtTabsPane, AtMessage } from 'taro-ui';
import { search } from '@/utils/music/mg';
import {
  search as wyySearch,
  getSongUrl as wyyGetSongUrl,
} from '@/utils/music/wyy';
import MusicBar from '@/components/MusicBar';
import MusicList from '@/components/MusicList';
import { MusicContext } from '@/app';
import styles from './index.module.less';

const musicTypeList = [
  { title: '咪咕音乐' },
  { title: '酷我音乐' },
  { title: '网易云音乐' },
];

const Index = () => {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [current, setCurrent] = useState(0);

  const { innerAudioContext, setMusicInfo, musicInfo, isPlay } =
    useContext(MusicContext);

  const handleSearch = () => {
    setSearchValue(searchInputValue);
  };

  const mgService = async (params, pageNum) => {
    const { list = [], total = 0 } = await search(params, pageNum);
    return {
      success: true,
      data: {
        pageNum,
        pageSize: 20,
        rows: list,
        totalCount: total,
      },
    };
  };

  const wyyService = async (params, pageNum) => {
    const { list = [], total = 0 } = await wyySearch(params, pageNum);
    return {
      success: true,
      data: {
        pageNum,
        pageSize: 20,
        rows: list,
        totalCount: total,
      },
    };
  };

  const handleItemClick = async (detail, _, type) => {
    let { url } = detail;
    if (!url) {
      if (type === 'wyy') {
        const { data } = await wyyGetSongUrl(detail.id);
        url = data?.[0]?.url;
      }
    }
    innerAudioContext.src = url;
    setMusicInfo({ musicInfo: detail });
  };

  const handleMusicBarPlay = () => {
    if (isPlay) {
      innerAudioContext.pause();
    } else {
      innerAudioContext.play();
    }
  };
  return (
    <View className={styles.index}>
      <AtMessage />
      <AtSearchBar
        value={searchInputValue}
        onChange={setSearchInputValue}
        onActionClick={handleSearch}
      />
      <AtTabs
        current={current}
        scroll
        tabList={musicTypeList}
        onClick={setCurrent}
      >
        <AtTabsPane current={current} index={0}>
          <MusicList
            service={mgService}
            params={searchValue}
            onItemClick={handleItemClick}
            type='mg'
          />
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View>酷我音乐</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          <MusicList
            service={wyyService}
            params={searchValue}
            onItemClick={handleItemClick}
            type='wyy'
          />
        </AtTabsPane>
      </AtTabs>
      <MusicBar
        author={musicInfo.author}
        musicName={musicInfo.musicName}
        isPlay={isPlay}
        albumPicUrl={musicInfo.albumPicUrl}
        handlePlay={handleMusicBarPlay}
      />
    </View>
  );
};

export default Index;
