const config = require('./config')
const helper = require('./helper')

module.exports = ctx => {
  const register = () => {
    ctx.helper.uploader.register('minio', {
      handle,
      name: 'MinIO图床',
      config: config
    })

    ctx.on('remove', async files => {
      try {
        const config = helper.getConfig(ctx)
        await helper.initMinioClient(config)

        for (let i = 0, len = files.length; i < len; i++) {
          let file = files[i]
          if (file.type === 'minio' && await helper.isFileExistInMinio(file.fileName)) {
            await helper.deleteFileInMinio(file.fileName)
          }
        }
      } catch (err) {
        ctx.log.error(JSON.stringify(err))
        ctx.emit('notification', {
          title: '删除失败',
          body: JSON.stringify(err)
        })
      }
    })
  }

  const handle = async function (ctx) {
    try {
      const config = helper.getConfig(ctx)
      await helper.initMinioClient(config)

      /**
       * 获取要上传的图片列表
       * @property {object[]} ctx.output
       * @property {string} ctx.output.buffer         图片的buffer值，buffer和base64值二选一即可，默认
       * @property {string} ctx.output.base64Image    图片的base64值，buffer和base64值二选一即可
       * @property {string} ctx.output.fileName       文件名
       * @property {string} ctx.output.width          宽度
       * @property {string} ctx.output.height         高度
       * @property {string} ctx.output.extname        图片格式的扩展名 比如.jpg | .png
       */
      let imgList = ctx.output
      const len = imgList.length

      let baseURL = helper.genBaseURL(config) // 基础地址
      let path = helper.genBasePath(config.baseDir) // 基础目录配置
      path += helper.genDatePath(config.isAutoArchive) // 是否自动归档
      for (let i = 0; i < len; i++) {
        let file = `${path}${imgList[i].fileName}`

        imgList[i]['imgUrl'] = baseURL + file
        imgList[i]['fileName'] = file
      }

      // 同名文件处理
      switch (config.sameNameFileProcessingMode) {
        case '覆盖':
          break
        case '保留两者':
          for (let i = 0; i < len; i++) {
            let ext = imgList[i].extname
            let filename = imgList[i].fileName.replace(ext, '')
            let timestamp = new Date().getTime().toString() + '_'
            let random = Math.random().toString().slice(-6)
            let file = `${filename}_repeat_${timestamp}_${random}${ext}`

            imgList[i]['imgUrl'] = baseURL + file
            imgList[i]['fileName'] = file
          }
          break
        case '跳过':
        default: // 默认：跳过
          for (let i = 0; i < len; i++) {
            if (await helper.isFileExistInMinio(imgList[i].fileName)) {
              delete imgList[i]
            }
          }

          // 清除数组中的空值的匿名函数
          imgList = imgList.filter(e => e)
          if (len !== imgList.length) {
            let s = len - imgList.length
            let msg = `存在${s}个同名文件(处理方式: 跳过)`
            // ctx.log.warn(msg)
            ctx.emit('notification', {
              title: '上传提示',
              body: msg
            })
          }
      }

      // 获取合并后mimes
      const allMimes = helper.mergeMimes(config)

      // 上传图片
      for (let i = 0, len = imgList.length; i < len; i++) {
        let ext = imgList[i].extname.replace('.', '')
        let image = imgList[i].buffer
        if (!image && imgList[i].base64Image) {
          image = Buffer.from(imgList[i].base64Image, 'base64')
        }

        ext = ext.toLowerCase()
        const metaData = {
          'Content-Type': allMimes[ext] ? allMimes[ext] : 'application/octet-stream'
        }
        await helper.uploadFileToMinio(imgList[i].fileName, image, metaData)

        delete imgList[i].base64Image
        delete imgList[i].buffer
      }

      ctx.output = imgList
    } catch (err) {
      ctx.log.warn(err)
      ctx.emit('notification', {
        title: '上传失败',
        body: JSON.stringify(err)
      })
    }
  }
  return {
    uploader: 'minio',
    register
  }
}
