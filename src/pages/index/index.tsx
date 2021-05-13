import { useState, useContext } from 'react';
import { View } from '@tarojs/components';
import { AtSearchBar, AtTabs, AtTabsPane, AtMessage } from 'taro-ui';
import MusicBar from '@/components/MusicBar';
import MusicList from '@/components/MusicList';
import { MusicContext } from '@/app';
import { musicTypeList, musicTypeService } from '@/utils/music/musicTypeList';
import styles from './index.module.less';

const Index = () => {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [current, setCurrent] = useState(0);

  const { innerAudioContext, setMusicInfo, musicInfo, isPlay } =
    useContext(MusicContext);

  const handleSearch = () => {
    setSearchValue(searchInputValue);
  };

  const service = async (params, pageNum, type) => {
    const { list = [], total = 0 } = await musicTypeService[type].search(
      params,
      pageNum,
    );
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
      const u = await musicTypeService[type].getSongUrl(detail.id);
      url = u;
    }
    innerAudioContext.src = url;
    setMusicInfo({ musicInfo: detail });
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
            service={(params, pageNum) => service(params, pageNum, 'mg')}
            params={searchValue}
            onItemClick={handleItemClick}
            type="mg"
          />
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View>酷我音乐</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          <MusicList
            service={(params, pageNum) => service(params, pageNum, 'wyy')}
            params={searchValue}
            onItemClick={handleItemClick}
            type="wyy"
          />
        </AtTabsPane>
      </AtTabs>
      <MusicBar />
    </View>
  );
};

export default Index;
