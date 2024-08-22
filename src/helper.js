const Minio = require('minio')
const mimes = {
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  bmp: 'image/bmp',
  ico: 'image/x-icon',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
}
let minioClient, bucket

// 检查 Minio Client 是否已初始化
function checkMinioInited() {
  return minioClient && bucket
}

module.exports = {
  // 生成基础URL
  genBaseURL (config) {
    let protocol = config.useSSL ? 'https' : 'http'
    let origin = `${protocol}://${config.endPoint}:${config.port}`

    // 自定义域名
    if (config.customDomain.length > 0 && config.customDomain.indexOf('http') >= 0) {
      origin = config.customDomain
    }

    return `${origin}/${config.bucket}/`
  },

  // 基础目录配置
  genBasePath (baseDir) {
    if (!baseDir) return ''

    let arr = [...baseDir]
    // 判断路径开头是否为 '/'，是则去除
    if (arr[0] === '/') baseDir = baseDir.replace('/', '')
    // 判断路径末尾是否为 '/'，不是则加上
    if (arr.pop() !== '/') baseDir += '/'

    return baseDir
  },

  // 生成日期路径
  genDatePath (isAutoArchive) {
    if (!isAutoArchive) return ''

    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    return `${year}/${month}/${day}/`
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

  // 初始化 minio 客户端
  async initMinioClient (config) {
    minioClient = new Minio.Client({
      endPoint: config.endPoint,
      port: parseInt(config.port),
      useSSL: config.useSSL,
      accessKey: config.accessKey,
      secretKey: config.secretKey
    })

    // 是否允许不安全的证书
    if (config.allowInsecureCert) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
    }

    // 检查bucket是否存在, 不存在则报错
    if (!await minioClient.bucketExists(config.bucket)) {
      throw `未找到 ${config.bucket} Bucket[404]`
      // 则创建该bucket(暂不实现该功能)
      // await minioClient.makeBucket(config.bucket, 'us-east-1')
    }
    bucket = config.bucket
  },

  // 在 minio 中检查是否存在该文件
  async isFileExistInMinio (filename) {
    if (!checkMinioInited()) throw 'Minio Client 未初始化'

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
  async deleteFileInMinio (filename) {
    if (!checkMinioInited()) throw 'Minio Client 未初始化'

    try {
      await minioClient.removeObject(bucket, filename)
    } catch (err) {
      throw err
    }
  },

  // 上传文件到 minio
  async uploadFileToMinio (path, file, metaData) {
    if (!checkMinioInited()) throw 'Minio Client 未初始化'

    await minioClient.putObject(bucket, path, file, file.length, metaData)
  },

  // 获取minio中的文件列表
  async getListObjectsOfMinio () {
    if (!checkMinioInited()) throw 'Minio Client 未初始化'

    const objects = []
    const stream = minioClient.listObjects(bucket, '', true)

    for await (const obj of stream) {
      objects.push(obj)
    }

    return objects
  },

  // 合并 内置MIME 和 自定义MIME
  mergeMimes (config) {
    if (!config.customMimes) {
      return mimes
    }

    let data = { ...mimes }
    config.customMimes.split('|').forEach(item => {
      const [ext, mime] = item.split(':')
      if (ext && mime) {
        data[ext.toLowerCase()] = mime
      }
    })
    return data
  }
}
