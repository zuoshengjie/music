const mg = 'https://zsjymy.top:3500/mg';
const wyy = 'https://zsjymy.top:3500/wyy';

const isH5 = process.env.TARO_ENV === 'h5';

module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {
    MG: isH5 ? '"/mg"' : mg,
    WYY: isH5 ? '"/wyy"' : wyy,
  },
  mini: {},
  h5: {
    devServer: {
      proxy: {
        '/mg': {
          target: 'https://zsjymy.top:3500',
          pathRewrite: { '^/mg': '/mg' },
        },
        '/wyy': {
          target: 'https://zsjymy.top:3500',
          pathRewrite: { '^/wyy': '/wyy' },
        },
      },
    },
  },
};
