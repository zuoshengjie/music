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
  }));
};

const mgRequest = (params) => {
  return request(params)
    .then(({ data, result }) => {
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
    })
    .then((res) => {
      return { ...res, list: transList(res.list || []) };
    });
};

export const search = (keyword: string, pageNo: number = 1) => {
  return mgRequest({
    url: `/mg/search`,
    data: { keyword, pageNo },
  });
};
