const Minio = require('minio')
const imageMime = {
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  bmp: 'image/bmp',
  ico: 'image/x-icon',
  webp: 'image/webp'
}

module.exports = {
  // 存放目录配置
  genBasePath (directory) {
    if (!directory) return ''

    // 判断路径末尾是否为 '/'，不是则加上 '/'
    return directory + ([...directory].pop() !== '/' ? '/' : '')
  },

  // 生成日期路径
  genDatePath (isFilingDate) {
    if (!isFilingDate) return ''

    return (new Date()).toLocaleDateString() + '/'
  },

  // 获取配置信息
  getConfig (ctx) {
    let userConfig = ctx.getConfig('picBed.minio')
    if (!userConfig) {
      throw 'MinIO图床设置不存在[401]'
    }
    userConfig.port = userConfig.port ? userConfig.port : (userConfig.useSSL ? 443 : 80)
    return userConfig
  },

  // 生成基础的上传URL
  genRealImgUrlPre (config) {
    // 基础域名拼接
    let realImgUrlPre = config.useSSL ? 'https://' : 'http://'
    realImgUrlPre += config.endPoint + ':' + config.port

    // 自定义域名
    if (config.customDomain.length > 0 && config.customDomain.indexOf('http') >= 0) {
      realImgUrlPre = config.customDomain
    }

    realImgUrlPre += '/' + config.bucket + '/'
    return realImgUrlPre
  },

  // 初始化 minio 客户端
  async initMinioClient (config) {
    const minioClient = new Minio.Client({
      endPoint: config.endPoint,
      port: parseInt(config.port),
      useSSL: config.useSSL,
      accessKey: config.accessKey,
      secretKey: config.secretKey
    })

    // 检查bucket是否存在, 不存在则报错
    if (!await minioClient.bucketExists(config.bucket)) {
      throw `未找到 ${config.bucket} Bucket[404]`
      // 则创建该bucket(暂不实现该功能)
      // await minioClient.makeBucket(config.bucket, 'us-east-1')
    }

    return minioClient
  },

  // 在 minio 中检查是否存在该文件
  async isFileExistInMinio (minioClient, bucket, filename) {
    try {
      // 检查文件是否存在，不存在则会抛出NotFound异常
      await minioClient.statObject(bucket, filename)
      return true
    } catch (err) {
      if (err.code !== 'NotFound') {
        throw err
      }
      return false
    }
  },

  // 在 minio 中删除文件
  async deleteFileInMinio (minioClient, bucket, filename) {
    try {
      await minioClient.removeObject(bucket, filename)
    } catch (err) {
      throw err
    }
  },

  // 上传文件到 minio
  async uploadFileToMinio (minioClient, bucket, path, file, extname) {
    const metaData = {
      'Content-Type': imageMime[extname] ? imageMime[extname] : 'application/octet-stream'
    }
    await minioClient.putObject(bucket, path, file, file.length, metaData)
  }
}
