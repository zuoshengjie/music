import Taro from '@tarojs/taro';

const searchServer = (keyword) => {
  return Taro.request({
    url: `/mg/search`,
    data: { keyword },
  });
};
export const search = async (keyword: string) => {
  const res = await searchServer(keyword);
  console.log(res, 'res');
  return res;
};
