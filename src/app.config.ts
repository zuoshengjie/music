export default {
  pages: [
    'pages/index/index',
    'pages/my/my',
    'pages/musicDetail/musicDetail',
  ],
  tabBar: {
    list: [{
      pagePath: 'pages/index/index',
      text: '搜索'
    }, {
      pagePath: 'pages/my/my',
      text: '我的'
    }],
    'color': '#000',
    'selectedColor': '#56abe4',
    'backgroundColor': '#fff',
    'borderStyle': 'white'
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
