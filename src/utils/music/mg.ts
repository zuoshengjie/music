import Taro from '@tarojs/taro';
import request from '@/utils/request';

const searchServer = (keyword: string, pageNo: number = 1) => {
  console.log(pageNo,'pageNo');
  return request({
    url: `/mg/search`,
    data: { keyword,pageNo },
  }).then(({ data, result }) => {
    if (result === 100) {
      return data;
    } else if (result === 500) {
      Taro.atMessage({
        message: '参数错误',
        type: 'error',
      });
    } else if (result === 400) {
      Taro.atMessage({
        message: 'node未知异常',
        type: 'error',
      });
    }
  });
};

export const search = async (keyword: string, pageNo: number = 1) => {
  const res = await searchServer(keyword, pageNo);
  return res;
};
