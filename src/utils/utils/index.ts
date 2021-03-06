import Taro from '@tarojs/taro'

export const format = (value: number) => {
  // 时间转换
  if (!value) return '00:00';
  let interval = Math.floor(value);
  let minute = Math.floor(interval / 60)
    .toString()
    .padStart(2, '0');
  let second = (interval % 60).toString().padStart(2, '0');
  return `${minute}:${second}`;
};

const tween = {
  linear: function (t, b, c, d) {
    return (c * t) / d + b;
  },
  easeIn: function (t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  strongEaseIn: function (t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  strongEaseOut: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  sineaseIn: function (t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  sineaseOut: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
};
/**
 * 缓动函数
 * @param t 动画已消耗时间
 * @param b 原始值
 * @param c 目标值
 * @param d 持续时间
 */
export function sineaseOut(t: number, b: number, c: number, d: number) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}
//      return (c * t) / d + b;
/**
 * 将元素滚动到可见位置
 * @param scroller 要滚动的元素
 * @param top
 */
export function scrollToView(scroller: HTMLElement, top: number = 0) {
  if (!scroller) {
    return;
  }
  const scrollStart = scroller.scrollTop || 0;
  let start = null;
  const step = (timestamp) => {
    if (!start) {
      start = timestamp;
    }
    if (top > scrollStart) {
      let stepScroll = tween.linear(
        timestamp - start,
        0,
        top - scrollStart,
        200,
      );
      // console.log(stepScroll,'stepScroll');
      let total = (scroller.scrollTop = scrollStart + stepScroll);
      if (total < top) {
        requestAnimationFrame(step);
      }
    } else {
      let stepScroll = tween.linear(
        timestamp - start,
        0,
        scrollStart - top,
        200,
      );
      let total = (scroller.scrollTop = scrollStart - stepScroll);
      if (total > top) {
        requestAnimationFrame(step);
      }
    }
  };
  requestAnimationFrame(step);
}

export const themeColorList = [
  { title: '默认', value: '#31c27c' },
  { title: '拂晓蓝', value: 'rgb(24, 144, 255)' },
  { title: '薄暮', value: 'rgb(245, 34, 45)' },
  { title: '火山', value: 'rgb(250, 84, 28)' },
  { title: '日暮', value: 'rgb(250, 173, 20)' },
  { title: '明青', value: 'rgb(19, 194, 194)' },
  { title: '极光绿', value: 'rgb(82, 196, 26)' },
  { title: '极客蓝', value: 'rgb(47, 84, 235)' },
  { title: '酱紫', value: 'rgb(114, 46, 209)' },
];


const NAVIGATOR_HEIGHT = 44
const TAB_BAR_HEIGHT = 50

/**
 * 返回屏幕可用高度
 * // NOTE 各端返回的 windowHeight 不一定是最终可用高度（例如可能没减去 statusBar 的高度），需二次计算
 * @param {*} showTabBar
 */
export function getWindowHeight(showTabBar = true) {
  const info = Taro.getSystemInfoSync()
  const { windowHeight, statusBarHeight, titleBarHeight } = info
  console.log(info,'infoinfoinfo')
  const tabBarHeight = showTabBar ? TAB_BAR_HEIGHT : 0

  if (process.env.TARO_ENV === 'rn') {
    return windowHeight - statusBarHeight - NAVIGATOR_HEIGHT - tabBarHeight
  }

  if (process.env.TARO_ENV === 'h5') {
    return `${windowHeight - tabBarHeight}px`
  }

  if (process.env.TARO_ENV === 'alipay') {
    // NOTE 支付宝比较迷，windowHeight 似乎是去掉了 tabBar 高度，但无 tab 页跟 tab 页返回高度是一样的
    return `${windowHeight - statusBarHeight - titleBarHeight + (showTabBar ? 0 : TAB_BAR_HEIGHT)}px`
  }

  return `${windowHeight}px`
}