export default {
  pages: [
    'pages/index/index',
    'pages/my/my',
    'pages/musicDetail/musicDetail',
  ],
  tabBar: {
    list: [{
      pagePath: 'pages/index/index',
      iconPath:'./assets/images/ss.png',
      selectedIconPath:'./assets/images/ss1.png',
      text: '搜索'
    }, {
      pagePath: 'pages/my/my',
      iconPath:'./assets/images/wd.png',
      selectedIconPath:'./assets/images/wd1.png',
      text: '我的'
    }],
    'color': '#9b9b9b',
    'selectedColor': '#31c27c',
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
