// const logger = require('@varnxy/logger')
// logger.setDirectory('/Users/zhang/Work/WorkSpaces/WebWorkSpace/picgo-plugin-gitlab/logs')
// let log = logger('plugin')
const Minio = require('minio')

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
    const minioClient = new Minio.Client({
      endPoint: userConfig.endPoint,
      port: userConfig.port,
      useSSL: userConfig.useSSL,
      accessKey: userConfig.accessKey,
      secretKey: userConfig.secretKey
    });

    // 创建一个bucket
    minioClient.makeBucket('europetrip', 'picgo', function(err) {
      if (err) return console.log(err)


      try {
        let imgList = ctx.output
        console.log(imgList)
        // for (let i in imgList) {
        //   let image = imgList[i].buffer
        //   if (!image && imgList[i].base64Image) {
        //     image = Buffer.from(imgList[i].base64Image, 'base64')
        //   }
        //
        //   const postConfig = postOptions(realUrl, token, image, imgList[i].fileName)
        //   let body = await ctx.Request.request(postConfig)
        //   delete imgList[i].base64Image
        //   delete imgList[i].buffer
        //   body = JSON.parse(body)
        //   imgList[i]['imgUrl'] = realImgUrlPre + body['url']
        // }
      } catch (err) {
        ctx.emit('notification', {
          title: '上传失败',
          body: JSON.stringify(err)
        })
      }
      // const metaData = {
      //   'Content-Type': 'application/octet-stream',
      //   'X-Amz-Meta-Testing': 1234,
      //   'example': 5678
      // }
      // // Using fPutObject API upload your file to the bucket europetrip.
      // minioClient.fPutObject('europetrip', 'photos-europe.tar', file, metaData, function(err, etag) {
      //   if (err) return console.log(err)
      //   console.log('File uploaded successfully.')
      // });
    });

    // try {
    //   let imgList = ctx.output
    //   for (let i in imgList) {
    //     let image = imgList[i].buffer
    //     if (!image && imgList[i].base64Image) {
    //       image = Buffer.from(imgList[i].base64Image, 'base64')
    //     }
    //
    //     const postConfig = postOptions(realUrl, token, image, imgList[i].fileName)
    //     let body = await ctx.Request.request(postConfig)
    //     delete imgList[i].base64Image
    //     delete imgList[i].buffer
    //     body = JSON.parse(body)
    //     imgList[i]['imgUrl'] = realImgUrlPre + body['url']
    //   }
    // } catch (err) {
    //   ctx.emit('notification', {
    //     title: '上传失败',
    //     body: JSON.stringify(err)
    //   })
    // }
  }

  // const postOptions = (url, token, image, fileName) => {
  //   let headers = {
  //     contentType: 'multipart/form-data',
  //     'User-Agent': 'PicGo',
  //     'PRIVATE-TOKEN': token
  //   }
  //   let formData = {
  //     'file': {
  //       'value': image,
  //       'options': {
  //         'filename': fileName
  //       }
  //     }
  //   }
  //   const opts = {
  //     method: 'POST',
  //     url: url,
  //     headers: headers,
  //     formData: formData
  //   }
  //   return opts
  // }

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
        name: 'useSSL',
        type: 'input',
        default: userConfig.useSSL,
        required: true,
        message: 'true',
        alias: 'useSSL'
      }
    ]
  }
  return {
    uploader: 'minio',
    // transformer: 'gitlab',
    // config: config,
    register

  }
}
