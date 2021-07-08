# picgo-plugin-minio

![](https://img.shields.io/npm/l/picgo-plugin-minio)
![](https://img.shields.io/npm/dt/picgo-plugin-minio)

适用于MinIO的PicGo上传器

### 功能
* 支持上传
* 支持相册删除功能
* 如果图床中存在同名文件, 则跳过该文件的上传
* 支持跳过同名文件功能可配置(2.1.0+)
* 支持多级目录功能(2.2.0+)
* 将图片归档到当前日期目录功能(2.2.0+)
* 同名文件支持 `跳过`、`覆盖`、`保留两者` 三种操作(2.3.0+)
  * `覆盖` 有点小问题：GUI 的相册会同时出现新旧两张一样的图片
  * PicGO 2.3.0 可能提供了相册相关 API，等正式版出来，再看看是否可以解决该问题
* 自定义域名(2.3.0+)

### 安装
```bash
npm i picgo-plugin-minio
```

### 使用
* `endPoint`	    对象存储服务的URL
* `port`	        TCP/IP端口号。可选值，如果是使用HTTP的话，默认值是80；如果使用HTTPS的话，默认值是443。
* `useSSL`	        yes代表使用HTTPS
* `accessKey`	    Access key是唯一标识你的账户的用户ID。
* `secretKey`	    Secret key是你账户的密码。
* `bucket`          存储文件的桶名。
* `存放目录`         将图片上传指定目录下, 例如 `dir`、 `dir1/dir2`(2.2.0+)
* `自动归到当前日期`  yes表示开启，把上传的图片归档到当前日期目录下(2.2.0+)
* `同名文件`         默认: `跳过`(2.3.0+)
  * `跳过` 检查 minio 中是否存在同名的文件，存在则跳过该文件的上传
  * `覆盖` 不进行检查，直接上传
  * `保留两者` 检查 minio 中是否存在同名的文件，存在则重命名该文件名再上传（规则：原文件名_repeat_时间戳_随机数.扩展名）
* `自定义域名`       简单的替换 `endPoint` 的域名(2.3.0+)
  
![Demo](https://github.com/Herbertzz/picgo-plugin-minio/blob/master/static/demo.jpg?raw=true)

### Q&A
* Q: MinIO 无法公开访问？
  * A: 需要设置 Bucket Policy 为 `Read Only` 或 `Read and Write`(建议设置为 `Read Only`)
* Q: PicGo MinIO图床设置界面无法滚动问题
  * A: PicGo 的 bug 在最新版中已修复。可选方案：在插件设置 -> 点击 `minio` 的小齿轮 -> 配置 uploader - minio 中进行配置
  
### 参考
* [MinIO JavaScript Client API参考文档](https://docs.min.io/cn/javascript-client-api-reference.html)
* [PicGo-Core 插件开发](https://picgo.github.io/PicGo-Core-Doc/zh/dev-guide/cli.html#%E7%AE%80%E4%BB%8B)
