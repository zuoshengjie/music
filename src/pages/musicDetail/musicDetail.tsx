import { useState, useEffect, useContext, useRef } from 'react';
import { View, ScrollView, Text, Image } from '@tarojs/components';
import { musicTypeService } from '@/utils/music/musicTypeList';
import { MusicContext } from '@/app';
import { format, scrollToView } from '@/utils/utils';
import { useUpdateEffect } from 'ahooks';
import styles from './index.module.less';

const MusicDetail = () => {
  const [lyricList, setLyricList] = useState([]);
  const [lyricCurrent, setLyricCurrent] = useState(0);
  const lyricRef = useRef(0);
  const { innerAudioContext, setMusicInfo, musicInfo, isPlay } =
    useContext(MusicContext);

  const {
    musicName,
    author = [],
    albumPicUrl,
    musicType,
    cid,
    bigPicUrl,
    lyric = '',
  } = musicInfo;
  console.log(musicInfo, 'musicInfo');
  useEffect(() => {
    const getMusicDetail = async (id) => {
      console.log(musicTypeService, 'musicTypeService');
      const detail = await musicTypeService[musicType]?.getSongDetail(id);
      setMusicInfo({
        musicInfo: { ...musicInfo, ...detail },
      });
    };
    getMusicDetail(cid);
  }, [cid]);

  useUpdateEffect(() => {
    const list = lyric.split(/[\n]/).map((item) => {
      const d = item.split(/\[(.+?)\]/);
      return { time: d[1], lyc: d[2] };
    });
    const currentList = list.reduce((p, v, i) => {
      return { ...p, [v.time?.split('.')[0]]: i };
    }, {});
    setLyricList(list);
    console.log('innerAudioContext');
    const update = (v) => {
      console.log(format(v.timeStamp / 1000), 'format(v.timeStamp / 1000)');
      const c = currentList[format(v.timeStamp / 1000)];
      if (c) {
        setLyricCurrent(c);
        scrollToView(lyricRef.current, Math.max(30 * c - 100, 0));
      }
    };
    innerAudioContext.onTimeUpdate(update);
    return () => {
      console.log('unEffect')
      innerAudioContext.offTimeUpdate(update);
    };
  }, [lyric]);

  return (
    <View className={styles['music-detail']}>
      <View
        className={styles['music-detail-bg']}
        style={{ backgroundImage: `url(${bigPicUrl})` }}
      />
      <View className={styles['music-content']}>
        <View>{musicName}</View>
        <View>{author.map((item) => item.name)}</View>
        <Image src={bigPicUrl} className={styles['music-pic']} />
        <View className={styles['music-lyric']} ref={lyricRef}>
          <View className={styles['lyric-box']}>
            {lyricList.map((item, i) => {
              return (
                <View
                  className={styles.lyc}
                  style={lyricCurrent - 1 === i ? { color: 'red' } : {}}
                  key={item.time + item.lyc}
                >
                  {item.lyc}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

export default MusicDetail;
