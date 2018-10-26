
# 目录
- 1. vue-ssr 的原理
- 2. 如何对特定的页面（比如首页）进行服务端渲染，而其他的页面是客户端渲染
- 3. vue-ssr 服务端渲染过程中的注意点
- 4. vue-ssr 怎么部署服务

# 1. vue-ssr 的原理

# 2. 如何对特定的页面（比如首页）进行服务端渲染，而其他的页面是客户端渲染

可以在 context 对象中传入 url ，然后在 entry-server.js 中进行路由的匹配。但是有个问题，url 只有一个，那么要是想对多个页面进行 SSR ，那该怎么处理呢？

```js
export default context => {
    // 因为有可能会是异步路由钩子函数或者组件，所以需要返回一个 Promise，以便服务器能够等待所有的内容在渲染前，就已经准备就绪
    return new Promise((resolve, reject) => {
        const { app, router } = createApp();

        // 设置服务器 router 的位置
        router.push(context.url);

        // 等待 router 将可能的异步组件和钩子函数解析完
        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();
            // 匹配不到的路由，执行 reject 函数，并返回 404
            if (!matchedComponents.length) {
                return reject({ code: 404 });
            }

            // Promise 应该 resolve 应用程序实例，以便于它可以渲染
            resolve(app);
        }, reject);
    });
};
```


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

- 2、 `createRenderer` 和 `createBundleRenderer` 方法的区别

`createRenderer` 和 `createBundleRenderer` 都是 `vue-server-renderer` 库里面的方法。

使用 `createRenderer` 方法创建 `Renderer` 实例，并且需要将 `Vue` 实例作为参数传入 `renderToString` 方法中，将 `Vue` 实例转成 `html` 字符串。

```js
const { createRenderer } = require('vue-server-renderer')
const renderer = createRenderer({ /* 选项 */ })
renderer.renderToString(vm, context?, callback?): ?Promise<string>
```

使用 `createBundleRenderer` 方法创建 `BundleRenderer` 实例，在创建实例的时候就需要将 `bundle` 文件（`bundle` 文件由 `Vue` 实例转化而来）传入 `createBundleRenderer` 方法中去。在调用 `renderToString` 方法的时候，不需要将 `Vue` 实例作为参数。

```js
const { createBundleRenderer } = require('vue-server-renderer')
const bundleRenderer = createBundleRenderer(serverBundle, { /* 选项 */ })
bundleRenderer.renderToString([context, callback]): ?Promise<string>
```

- 3、在 entry-server.js 中的 context 对象的问题

问题1： 参数 context 会从哪里传过来
问题2： router.push(context.url) 中 url 是从哪儿传过来的，url 需要是路由的path才行，如果是 req.url 则不行吧