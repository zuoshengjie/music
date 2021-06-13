const mg = '"https://zsjymy.top:3500/mg"';
const wyy = '"https://zsjymy.top:3500/wyy"';

module.exports = {
  env: {
    NODE_ENV: '"development"',
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
