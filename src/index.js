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

module.exports = (ctx) => {
  const register = () => {
    ctx.helper.uploader.register('minio', {
      handle,
      name: 'MinIO图床',
      config: config
    })
  }
  const handle = async function (ctx) {
    let userConfig = ctx.getConfig('picBed.minio')
    if (!userConfig) {
      throw new Error('Can\'t find uploader config')
    }
    const useSSL = userConfig.useSSL === 'true'
    const port = userConfig.port ? parseInt(userConfig.port)
      : (useSSL ? 443 : 80)
    const minioClient = new Minio.Client({
      endPoint: userConfig.endPoint,
      port: port,
      useSSL: useSSL,
      accessKey: userConfig.accessKey,
      secretKey: userConfig.secretKey
    })

    const bucket = userConfig.bucket
    try {
      // 检查bucket是否存在, 不存在则报错
      if (!await minioClient.bucketExists(bucket)) {
        throw 'Bucket: ' + bucket + '不存在，请先创建该Bucket'
        // 则创建该bucket(暂不实现该功能)
        // await minioClient.makeBucket(bucket, 'us-east-1')
      }
    } catch (err) {
      ctx.emit('notification', {
        title: '上传失败',
        body: JSON.stringify(err)
      })
      return
    }

    // 图片基本url拼接
    let realImgUrlPre = useSSL ? 'https://' : 'http://'
    realImgUrlPre += userConfig.endPoint + ':' + port
    realImgUrlPre += '/' + bucket + '/'

    // 上传图片
    try {
      let imgList = ctx.output
      for (let i = 0, len = imgList.length; i < len; i++) {
        let image = imgList[i].buffer
        if (!image && imgList[i].base64Image) {
          image = Buffer.from(imgList[i].base64Image, 'base64')
        }

        let ext = imgList[i].extname.replace('.', '')
        let metaData = {
          'Content-Type': imageMime[ext] ? imageMime[ext] : 'application/octet-stream'
        }
        await minioClient.putObject(bucket, imgList[i].fileName, image, image.length, metaData)

        delete imgList[i].base64Image
        delete imgList[i].buffer
        imgList[i]['imgUrl'] = realImgUrlPre + imgList[i].fileName
      }
    } catch (err) {
      ctx.emit('notification', {
        title: '上传失败',
        body: JSON.stringify(err)
      })
    }
  }

  const config = ctx => {
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
        type: 'input',
        default: userConfig.useSSL,
        required: true,
        message: 'true',
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
      }
    ]
  }
  return {
    uploader: 'minio',
    // config: config,
    register

  }
}
