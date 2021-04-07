const {
  override,
  addWebpackAlias,
  addLessLoader,
  addWebpackPlugin,
  addPostcssPlugins,
} = require('customize-cra')
const path = require('path')
// const paths = require("react-scripts/config/paths");
// 由于x在ts中组件还是需要声明为moment.Moment，只有在打包之后才会自动替换成dayjs，
// 为了防止ts报错，更加优雅的使用ts，只能使用自定义date组件
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
// paths.appBuild = path.resolve(path.dirname(paths.appBuild), "../../build");

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
    },
  }),
  addPostcssPlugins([require('postcss-px2rem')({ remUnit: 100 })]),
  // 使babel支持除了src以外的文件
  (config) => {
    // Let Babel compile outside of src/.
    const tsRule = config.module.rules[1].oneOf[2]
    tsRule.include = undefined
    tsRule.exclude = /node_modules/
    return config
  },
  // dayjs 插件列表，在utils/dayjs里面配置
  addWebpackPlugin(
    new AntdDayjsWebpackPlugin({
      replaceMoment: true,
    }),
  ),
)
