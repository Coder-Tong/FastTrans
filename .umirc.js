
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  proxy: { // 解决跨域问题
    '/api': {
      target: 'http://api.fanyi.baidu.com/api',
      pathRewrite: { '^/api': ''},
      changeOrigin: true,
    }
  },
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        { path: '/', component: '../pages/index' },
        { path: '/login', component: '../pages/Login' }
      ]
    }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'FastTrans',
      dll: true,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
}
