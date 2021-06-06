# picgo-plugin-minio

![](https://img.shields.io/npm/l/picgo-plugin-minio)
![](https://img.shields.io/npm/dt/picgo-plugin-minio)

PicGo Uploader For MinIO

[中文说明](https://github.com/Herbertzz/picgo-plugin-minio/blob/master/README.md)

### Features
* Support upload.
* Support GUI album delete function.
* If there is a file with the same name in the image bed, skip the upload of the file.
* Support for skipping files with the same name, configurable(2.1.0+)

### Installation
```bash
npm i picgo-plugin-minio
```

### Usage
* `endPoint`	URL to object storage service.
* `port`	    TCP/IP port number. This input is optional. Default value set to 80 for HTTP and 443 for HTTPs.
* `useSSL`	    Set this value to 'true' to enable secure (HTTPS) access.
* `accessKey`	Access key is like user ID that uniquely identifies your account.
* `secretKey`	Secret key is the password to your account.
* `bucket`      Bucket for storage
* `跳过同名图片`  When it is turned on, it will check whether there is a file with the same name in the image bed. If it exists, the upload of the file will be skipped; default: true, if not used, please set it to false.(2.1.0+)
  
![Demo](https://github.com/Herbertzz/picgo-plugin-minio/blob/master/static/demo.jpg?raw=true)

### Q&A
* Q: MinIO cannot publicly access？
    * A: Need to set Bucket Policy to `Read Only` or `Read and Write` (recommended to set to `Read Only`)
  
### Reference
* [JavaScript Client API Reference](https://docs.min.io/docs/javascript-client-api-reference.html)
* [PicGo-Core 插件开发](https://picgo.github.io/PicGo-Core-Doc/zh/dev-guide/cli.html#%E7%AE%80%E4%BB%8B)
