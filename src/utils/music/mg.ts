import Taro from '@tarojs/taro';
import request from '@/utils/request';

const transList = (list) => {
  return list.map((item) => ({
    musicName: item.name,
    mvId: item.mvId,
    url: item.url,
    id: item.id,
    author: item.artists,
    albumPicUrl: item.album.picUrl,
    albumName: item.album.name,
    albumId: item.album.id,
    cid: item.cid,
  }));
};

const mgRequest = (params) => {
  return request(params).then(({ data, result }) => {
    if (result === 100) {
      return data;
    } else if (result === 500) {
      Taro.atMessage({
        message: '参数错误',
        type: 'error',
      });
      return {};
    } else if (result === 400) {
      Taro.atMessage({
        message: 'node未知异常',
        type: 'error',
      });
      return {};
    }
  });
};

export const search = (keyword: string, pageNo: number = 1) => {
  return mgRequest({
    url: `https://zsjymy.top:3500/mg/search`,
    data: { keyword, pageNo },
  }).then((res) => {
    return { ...res, list: transList(res.list || []) };
  });
};

export const getSongUrl = (id: number) => {
  return mgRequest({
    url: `/mg/song/url`,
    data: { id },
  }).then((res) => {
    return res.data;
  });
};

export const getSongDetail = (cid: number) => {
  return mgRequest({
    url: `/mg/song`,
    data: { cid },
  }).then((res) => {
    return { lyric: res.lyric, bigPicUrl: res.bigPicUrl };
  });
};
