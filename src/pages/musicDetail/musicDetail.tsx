import Taro from '@tarojs/taro';
import { useState, useEffect, useContext, useRef } from 'react';
import { View, Slider, Text, Image } from '@tarojs/components';
import { musicTypeService } from '@/utils/music/musicTypeList';
import { MusicContext } from '@/app';
import { format, scrollToView } from '@/utils/utils';
import {
  lbxh,
  dqxh,
  sys,
  bf,
  zt,
  xys1,
  sys1,
  sjbf1,
  bfdl,
} from '@/assets/images';
import styles from './index.module.less';

const bflxKey = {
  0: lbxh,
  1: dqxh,
  2: sjbf1,
};

const MusicDetail = () => {
  const [lyricList, setLyricList] = useState([]);
  const [lyricCurrent, setLyricCurrent] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [bflx, setBflx] = useState(0);
  const lyricRef = useRef(0);
  const {
    innerAudioContext,
    setMusicInfo,
    musicInfo,
    isPlay,
    playList,
    isPlayListOpen,
  } = useContext(MusicContext);

  const {
    musicName,
    author = [],
    albumPicUrl,
    musicType,
    cid,
    bigPicUrl,
    lyric = '',
    id,
    url,
  } = musicInfo;

  useEffect(() => {
    const getMusicDetail = async (id) => {
      const detail = await musicTypeService[musicType]?.getSongDetail(id);
      Taro.setNavigationBarTitle({
        title: `${musicName}-${author.map((item) => item.name)}`,
      });
      setMusicInfo({
        musicInfo: { ...musicInfo, ...detail },
      });
    };
    getMusicDetail(cid);
  }, [cid]);

  useEffect(() => {
    const l = lyric.split(/[\n]/);
    const list = l.map((item, i) => {
      const d = item.split(/\[(.+?)\]/);
      const n = l[i + 1]?.split(/\[(.+?)\]/);
      const s = d?.[1]?.split(':');
      const e = n?.[1]?.split(':');
      const startTime = Number(s?.[0]) * 60 + Number(s?.[1]);
      const endTime = Number(e?.[0]) * 60 + Number(e?.[1]);
      return {
        time: d[1],
        lyc: d[2],
        lycTime: (endTime - startTime) * 1000 - 100,
      };
    });
    const currentList = list.reduce((p, v, i) => {
      return { ...p, [v.time?.split('.')[0]]: i };
    }, {});
    setLyricList(list);
    const update = () => {
      const ct = innerAudioContext.currentTime;
      const c = currentList[format(ct)];
      setCurrentTime(Math.floor(ct));
      if (c) {
        setLyricCurrent(c);
        scrollToView(lyricRef.current, Math.max(40 * c - 100, 0));
      }
    };
    innerAudioContext.onTimeUpdate(update);
    return () => {
      innerAudioContext.offTimeUpdate(update);
    };
  }, [lyric]);

  const handlePlay = () => {
    if (isPlay) {
      innerAudioContext.pause();
    } else {
      innerAudioContext.play();
    }
  };

  const handleSliderChange = ({ detail }) => {
    innerAudioContext.seek(detail.value);
    setCurrentTime(detail.value);
  };

  const handlePlayList = () => {
    setMusicInfo({
      isPlayListOpen: !isPlayListOpen,
    });
  };

  const handleJumpClick = async (type) => {
    const i = playList.findIndex((item) => item.id === id);

    let nextIndex = i + 1 + 1 > playList.length ? 0 : i + 1;
    if (type === 'prev') {
      nextIndex = i - 1 < 0 ? playList.length - 1 : i - 1;
    }
    if (bflx === 2) {
      nextIndex = Math.floor(playList.length * Math.random());
    }
    const d = playList[nextIndex];
    let mu = d?.url;
    if (!mu) {
      const u = await musicTypeService[d.musicType].getSongUrl(d.id);
      mu = u;
    }
    innerAudioContext.src = mu;

    setMusicInfo({ musicInfo: { ...d, url: mu } });
  };

  const handlebflx = () => {
    setBflx((v) => {
      if (v + 1 > 2) {
        return 0;
      }
      return v + 1;
    });
  };

  useEffect(() => {
    if (bflx === 1){
      innerAudioContext.loop = true;
    }
  },[bflx])

  return (
    <View className={styles['music-detail']}>
      <View
        className={styles['music-detail-bg']}
        style={{ backgroundImage: `url(${bigPicUrl})` }}
      >
        <View className={styles['bg-mask']} />
      </View>
      <View className={styles['music-content']}>
        <View className={styles['music-name']}>{musicName}</View>
        <View className={styles['music-author']}>
          {author.map((item) => item.name)}
        </View>
        <Image src={bigPicUrl} className={styles['music-pic']} />
        <View className={styles['music-lyric']} ref={lyricRef}>
          <View className={styles['lyric-box']}>
            {lyricList.map((item, i) => {
              return (
                <View className={styles.lyc} key={item.time + item.lyc}>
                  <View className={styles['lyc-base']}>
                    {item.lyc}
                    <View
                      className={styles['lyc-red']}
                      style={
                        lyricCurrent === i
                          ? {
                              width: '100%',
                              transition: `width ${item.lycTime}ms`,
                            }
                          : {}
                      }
                    >
                      {item.lyc}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View className={styles['control-bottom']}>
          <View className={styles.progress}>
            <Text>{format(currentTime)}</Text>
            <Slider
              className={styles['progress-bar']}
              blockSize={12}
              activeColor="#fff"
              backgroundColor="#696969"
              step={1}
              value={Math.floor(currentTime)}
              max={Math.floor(innerAudioContext.duration)}
              onChange={handleSliderChange}
            />
            {/*<View className={styles['progress-bar']}><View className={styles.}></View></View>*/}
            <Text>{format(innerAudioContext.duration)}</Text>
          </View>
          <View className={styles['control-icon']}>
            <Image
              className={styles.other}
              src={bflxKey[bflx]}
              onClick={handlebflx}
            />
            <Image
              className={styles.control}
              src={sys1}
              onClick={() => handleJumpClick('prev')}
            />
            <Image
              className={styles.play}
              src={isPlay ? zt : bf}
              onClick={handlePlay}
            />
            <Image
              className={styles.control}
              src={xys1}
              onClick={() => handleJumpClick('next')}
            />
            <Image
              className={styles.other}
              src={bfdl}
              onClick={handlePlayList}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MusicDetail;
