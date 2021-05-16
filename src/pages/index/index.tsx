import { useState, useContext } from 'react';
import { View } from '@tarojs/components';
import { AtSearchBar, AtTabs, AtTabsPane, AtMessage } from 'taro-ui';
import MusicBar from '@/components/MusicBar';
import MusicList from '@/components/MusicList';
import MusicContext from '../../MusicContext';
import { musicTypeList, musicTypeService } from '@/utils/music/musicTypeList';
import styles from './index.module.less';

const Index = () => {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [current, setCurrent] = useState(0);

  const { innerAudioContext, setMusicInfo, musicInfo, style } =
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
    let { url, musicName, author, albumPicUrl, albumName } = detail;
    if (!url) {
      const u = await musicTypeService[type].getSongUrl(detail.id);
      url = u;
    }
    innerAudioContext.title = musicName;
    innerAudioContext.epname = albumName;
    innerAudioContext.singer = author;
    innerAudioContext.coverImgUrl = albumPicUrl;
    innerAudioContext.src = url;
    setMusicInfo({ musicInfo: { ...detail, url } });
  };

  return (
    <View className={styles.index} style={style}>
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
        {musicTypeList.map((item, index) => {
          return (
            <AtTabsPane current={current} index={index} key={item.key}>
              <MusicList
                service={(params, pageNum) =>
                  service(params, pageNum, item.key)
                }
                params={searchValue}
                onItemClick={handleItemClick}
                type={item.key}
                height={`calc(var(--vh, 100vh) - 94PX - 53PX${
                  Object.keys(musicInfo).length ? ' - 55px' : ''
                })`}
              />
            </AtTabsPane>
          );
        })}
      </AtTabs>
      <MusicBar />
    </View>
  );
};

export default Index;
