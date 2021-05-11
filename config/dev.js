module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  mini: {},
  h5: {
    devServer: {
      proxy: {
        '/mg': {
          target: 'http://zsjymy.top:3400',
          pathRewrite: { '^/mg': '' },
        },
      },
    },
  },
};
