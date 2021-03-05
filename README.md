# picgo-plugin-minio

PicGo Uploader For MinIO

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