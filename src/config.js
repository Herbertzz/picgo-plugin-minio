/**
 * @property {object} config
 * @property {string} config.endPoint
 * @property {string} config.port
 * @property {boolean} config.useSSL
 * @property {string} config.accessKey
 * @property {string} config.secretKey
 * @property {string} config.bucket
 * @property {string} config.isFilterSameNameImage
 * @property {string} config.directory
 * @property {string} config.customDomain
 * @property {boolean} config.isFilingDate
 */
module.exports = ctx => {
  let userConfig = ctx.getConfig('picBed.minio')
  if (!userConfig) {
    userConfig = {}
  }
  return [
    {
      name: 'endPoint',
      type: 'input',
      default: userConfig.endPoint,
      required: true,
      message: 'minio.com',
      alias: 'endPoint'
    },
    {
      name: 'port',
      type: 'input',
      default: userConfig.port,
      required: false,
      message: 'port',
      alias: 'port'
    },
    {
      name: 'useSSL',
      type: 'confirm',
      default: userConfig.useSSL || false,
      required: true,
      message: 'useSSL',
      alias: 'useSSL'
    },
    {
      name: 'accessKey',
      type: 'input',
      default: userConfig.accessKey,
      required: true,
      message: 'accessKey',
      alias: 'accessKey'
    },
    {
      name: 'secretKey',
      type: 'input',
      default: userConfig.secretKey,
      required: true,
      message: 'secretKey',
      alias: 'secretKey'
    },
    {
      name: 'bucket',
      type: 'input',
      default: userConfig.bucket,
      required: true,
      message: 'bucket',
      alias: 'bucket'
    },
    {
      name: 'isFilterSameNameImage',
      type: 'list',
      choices: ['跳过', '覆盖', '保留两者'],
      default: userConfig.isFilterSameNameImage || '跳过',
      required: false,
      message: '同名文件',
      alias: '同名文件'
    },
    {
      name: 'directory',
      type: 'input',
      default: userConfig.directory || '',
      required: false,
      message: '存放目录',
      alias: '存放目录'
    },
    {
      name: 'customDomain',
      type: 'input',
      default: userConfig.customDomain || '',
      required: false,
      message: '如:https://img.host.com',
      alias: '自定义域名'
    },
    {
      name: 'isFilingDate',
      type: 'confirm',
      default: userConfig.isFilingDate || false,
      required: false,
      message: '自动归到当前日期',
      alias: '自动归到当前日期'
    }
  ]
}
