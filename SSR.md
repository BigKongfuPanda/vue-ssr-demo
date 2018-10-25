# 1. vue-ssr 的原理
# 2. 如何对特定的页面（比如首页）进行服务端渲染，而其他的页面是客户端渲染
# 3. vue-ssr 服务端渲染过程中的注意点
# 4. vue-ssr 怎么部署服务


# 3. 注意点

- 1、 页面模板中，必须有 `<!--vue-ssr-outlet-->` 的注释，不然会报错。

```html
<!DOCTYPE html>
<html lang="en">
  <head><title>Hello</title></head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```