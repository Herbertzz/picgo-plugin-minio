// const logger = require('@varnxy/logger')
// logger.setDirectory('/Users/zhang/Work/WorkSpaces/WebWorkSpace/picgo-plugin-gitlab/logs')
// let log = logger('plugin')

module.exports = (ctx) => {
  const register = () => {
    ctx.helper.uploader.register('gitlab', {
      handle,
      name: 'GitLab图床',
      config: config
    })
  }
  const handle = async function (ctx) {
    let userConfig = ctx.getConfig('picBed.gitlab')
    if (!userConfig) {
      throw new Error('Can\'t find uploader config')
    }
    const url = userConfig.URL
    const group = userConfig.Group
    const project = userConfig.Project
    const token = userConfig.Token
    const realImgUrlPre = url + '/' + group + '/' + project
    const realUrl = url + '/api/v4/projects/' + group + '%2F' + project + '/uploads'

    try {
      let imgList = ctx.output
      for (let i in imgList) {
        let image = imgList[i].buffer
        if (!image && imgList[i].base64Image) {
          image = Buffer.from(imgList[i].base64Image, 'base64')
        }

        const postConfig = postOptions(realUrl, token, image, imgList[i].fileName)
        let body = await ctx.Request.request(postConfig)
        delete imgList[i].base64Image
        delete imgList[i].buffer
        body = JSON.parse(body)
        imgList[i]['imgUrl'] = realImgUrlPre + body['url']
      }
    } catch (err) {
      ctx.emit('notification', {
        title: '上传失败',
        body: JSON.stringify(err)
      })
    }
  }

  const postOptions = (url, token, image, fileName) => {
    let headers = {
      contentType: 'multipart/form-data',
      'User-Agent': 'PicGo',
      'PRIVATE-TOKEN': token
    }
    let formData = {
      'file': {
        'value': image,
        'options': {
          'filename': fileName
        }
      }
    }
    const opts = {
      method: 'POST',
      url: url,
      headers: headers,
      formData: formData
    }
    return opts
  }

  const config = ctx => {
    let userConfig = ctx.getConfig('picBed.gitlab')
    if (!userConfig) {
      userConfig = {}
    }
    return [
      {
        name: 'URL',
        type: 'input',
        default: userConfig.URL,
        required: true,
        message: 'https://gitlab.com',
        alias: 'URL'
      },
      {
        name: 'Group',
        type: 'input',
        default: userConfig.Group,
        required: true,
        message: 'Group',
        alias: 'Group'
      },
      {
        name: 'Project',
        type: 'input',
        default: userConfig.Project,
        required: true,
        message: 'Project',
        alias: 'Project'
      },
      {
        name: 'Token',
        type: 'input',
        default: userConfig.Token,
        required: true,
        message: 'aLS32eaxs1GLvKcv9f-k',
        alias: 'Token'
      }
    ]
  }
  return {
    uploader: 'gitlab',
    // transformer: 'gitlab',
    // config: config,
    register

  }
}
