# picgo-plugin-minio

![](https://img.shields.io/npm/l/picgo-plugin-minio)
![](https://img.shields.io/npm/dt/picgo-plugin-minio)

适用于 MinIO 的 PicGo 上传器

### 功能

- 支持上传
- 支持相册删除功能
- 如果图床中存在同名文件, 则跳过该文件的上传
- 支持跳过同名文件功能可配置(2.1.0+)
- 支持多级目录功能(2.2.0+)
- 将图片归档到当前日期目录功能(2.2.0+)
- 同名文件支持 `跳过`、`覆盖`、`保留两者` 三种操作(2.3.0+)
  - `覆盖` 有点小问题：GUI 的相册会同时出现新旧两张一样的图片
    - 可使用「插件设置 -> ⚙️ -> 相册-清理重复项」进行清理（要求: PicGO 2.3.0+, 本插件 2.4.0+）
- 自定义域名(2.3.0+)
- 自定义路径拼接方式(2.5.0+)
- 插件设置 -> ⚙️ -> 相册-拉取云端数据，用于拉取云端数据到相册（要求: PicGO 2.3.0+, 本插件 2.4.0+）

### 安装

在插件界面的搜索栏搜索 `minio` (PicGo 的插件名以 `picgo-plugin-` 为前缀，所以只需搜前缀后的名字即可)

搜到了插件之后只要点击右下角的安装即可。

### 使用

- `endPoint` 对象存储服务的 URL
- `port` TCP/IP 端口号。可选值，如果是使用 HTTP 的话，默认值是 80；如果使用 HTTPS 的话，默认值是 443。
- `useSSL` yes 代表使用 HTTPS
- `accessKey` Access key 是唯一标识你的账户的用户 ID。
- `secretKey` Secret key 是你账户的密码。
- `bucket` 存储文件的桶。
- `存放目录` 将图片上传指定目录下, 例如 `dir`、 `dir1/dir2`(2.2.0+)
- `自动归档` yes 表示开启，把上传的图片归档到当天日期目录下(2.2.0+)
- `同名文件` 默认: `跳过`(2.3.0+)
  - `跳过` 检查 minio 中是否存在同名的文件，存在则跳过该文件的上传
  - `覆盖` 不进行检查，直接上传
  - `保留两者` 检查 minio 中是否存在同名的文件，存在则重命名该文件名再上传（规则：原文件名*repeat*时间戳\_随机数.扩展名）
- `自定义域名` 简单的替换 `endPoint` 的域名(2.3.0+)
- `自定义MIME` 自定义扩展名为指定 MIME，多个用|分隔，格式：ext1:mime1|ext2:mime2|ext3:mime3(2.4.0+)
- `允许不安全证书` 允许使用自签名或无效的证书，如果提示证书错误可尝试开启该项，其他情况下不要开启(2.4.0+)

### Q&A

- Q: MinIO 无法公开访问？
  - A: 需要设置 Bucket Policy 为 `Read Only` 或 `Read and Write`(建议设置为 `Read Only`)
- Q: PicGo MinIO 图床设置界面无法滚动问题
  - A: PicGo 的 bug 在最新版中已修复。可选方案：在插件设置 -> 点击 `minio` 的小齿轮 -> 配置 uploader - minio 中进行配置

### 参考

- [MinIO JavaScript Client API 参考文档](https://docs.min.io/cn/javascript-client-api-reference.html)
- [PicGo-Core 插件开发](https://picgo.github.io/PicGo-Core-Doc/zh/dev-guide/cli.html#%E7%AE%80%E4%BB%8B)
