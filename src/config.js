/**
 * @property {object} config
 * @property {string} config.endPoint
 * @property {string} config.port
 * @property {boolean} config.useSSL
 * @property {boolean} config.allowInsecureCert           允许不安全证书
 * @property {string} config.accessKey
 * @property {string} config.secretKey
 * @property {string} config.bucket
 * @property {string} config.sameNameFileProcessingMode   同名文件
 * @property {string} config.baseDir                      基础目录
 * @property {string} config.customDomain                 自定义域名
 * @property {boolean} config.isAutoArchive               自动归档
 * @property {string} config.customMimes                  自定义MIME
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
      name: 'allowInsecureCert',
      type: 'confirm',
      default: userConfig.allowInsecureCert || false,
      required: false,
      message: '允许不安全证书',
      alias: '允许不安全证书'
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
      name: 'sameNameFileProcessingMode',
      type: 'list',
      choices: ['跳过', '覆盖', '保留两者'],
      default: userConfig.sameNameFileProcessingMode || '跳过',
      required: false,
      message: '同名文件',
      alias: '同名文件'
    },
    {
      name: 'baseDir',
      type: 'input',
      default: userConfig.baseDir || '',
      required: false,
      message: '存放文件的基础目录',
      alias: '基础目录'
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
      name: 'isAutoArchive',
      type: 'confirm',
      default: userConfig.isAutoArchive || false,
      required: false,
      message: '将上传文件存放到当天日期的目录下',
      alias: '自动归档'
    },
    {
      name: 'customMimes',
      type: 'input',
      default: userConfig.customMimes || '',
      required: false,
      message: '格式：ext1:mime1|ext2:mime2|ext3:mime3',
      alias: '自定义 MIME'
    }
  ]
}
