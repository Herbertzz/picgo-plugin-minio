# picgo-plugin-minio

PicGo Uploader For MinIO

### 功能
* 支持上传
* 支持相册删除功能
* 如果图床中存在同名文件, 则跳过该文件的上传

### 安装
```bash
npm i picgo-plugin-minio
```

### 使用
* endPoint	对象存储服务的URL
* port	    TCP/IP端口号。可选值，如果是使用HTTP的话，默认值是80；如果使用HTTPS的话，默认值是443。
* useSSL	true代表使用HTTPS
* accessKey	Access key是唯一标识你的账户的用户ID。
* secretKey	Secret key是你账户的密码。
* bucket    存储文件的桶名。

### Q&A
* Q: MinIO 无法公开访问？
    * A: 需要设置 Bucket Policy 为 `Read Only` 或 `Read and Write`(建议设置为 `Read Only`)
  
### 参考
* [MinIO JavaScript Client API参考文档](https://docs.min.io/cn/javascript-client-api-reference.html)
* [PicGo-Core 插件开发](https://picgo.github.io/PicGo-Core-Doc/zh/dev-guide/cli.html#%E7%AE%80%E4%BB%8B)