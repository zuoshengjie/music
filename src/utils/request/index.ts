import Taro from '@tarojs/taro';

interface requestParams {
  url: string;
  method?:
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT';
  data: any;
}
const request = ({ url, method = 'GET', data }: requestParams) => {
  return Taro.request({
    url,
    method,
    data,
  }).then((res) => {
    if (res.statusCode === 200) {
      return res.data;
    } else {
      Taro.atMessage({
        message: '请求错误',
        type: 'error',
      });
    }
  });
};

export default request;
