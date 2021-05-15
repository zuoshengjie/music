import Taro from '@tarojs/taro';
import request from '@/utils/request';

const transList = (list) => {
  return list.map((item) => ({
    musicName: item.name,
    mvId: item.mv,
    url: item.url,
    id: item.id,
    author: item.ar,
    albumPicUrl: item.al.picUrl,
    bigPicUrl:item.al.picUrl,
    albumName: item.al.name,
    albumId: item.al.id,
    cid: item.id,
  }));
};

const wyyRequest = (params) => {
  return request(params).then((res) => {
    const { code } = res;
    if (code === 200) {
      return res;
    } else if (code === 500) {
      Taro.atMessage({
        message: '服务器错误',
        type: 'error',
      });
      return {};
    } else if (code === 400) {
      Taro.atMessage({
        message: 'node未知异常',
        type: 'error',
      });
      return {};
    }
  });
};

export const search = (keyword: string, pageNo: number = 1) => {
  return wyyRequest({
    url: `/wyy/cloudsearch`,
    data: { keywords: keyword, offset: (pageNo - 1) * 20, limit: 20 },
  }).then(({ result }) => {
    const { songCount, songs } = result;
    return { total: songCount, list: transList(songs || []) };
  });
};

export const getSongUrl = (id: number) => {
  return wyyRequest({
    url: `/wyy/song/url`,
    data: { id },
  }).then((res) => {
    return res.data[0].url;
  });
};

export const getSongDetail = (cid: number) => {
  return wyyRequest({
    url: `/wyy/lyric`,
    data: { id: cid },
  }).then(res => {
    return {lyric:res.lrc.lyric}
  })
};
