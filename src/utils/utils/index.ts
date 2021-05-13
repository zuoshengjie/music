export const format = (value: number) => {
  // 时间转换
  if (!value) return '';
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

/**
 * 将元素滚动到可见位置
 * @param scroller 要滚动的元素
 * @param top
 */
export function scrollToView(scroller: HTMLElement, top: number = 0) {
  if (!scroller) {
    return;
  }
  const scrollStart = scroller.scrollTop;
  let start = null;
  const step = (timestamp) => {
    if (!start) {
      start = timestamp;
    }
    let stepScroll = tween.linear(timestamp - start, 0, top, 1000);
    let total = (scroller.scrollTop = scrollStart + stepScroll);
    if (total < top) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}
