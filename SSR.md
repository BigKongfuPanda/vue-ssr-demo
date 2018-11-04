
# 目录
- 1. vue-ssr 的原理和流程
- 2. 如何对特定的页面（比如首页）进行服务端渲染，而其他的页面是客户端渲染
- 3. vue-ssr 服务端渲染过程中的注意点
- 4. vue-ssr 怎么部署服务
- 5. 疑问

# 1. vue-ssr 的原理和流程

# 2. 如何对特定的页面（比如首页）进行服务端渲染，而其他的页面是客户端渲染

可以在 context 对象中传入 url ，然后在 entry-server.js 中进行路由的匹配。但是有个问题，url 只有一个，那么要是想对多个页面进行 SSR ，那该怎么处理呢？

另外，在需要服务端渲染的组件中，添加了 `asyncData` 的方法，不需要服务端渲染的页面中可以不用 `asyncData` 方法，那么是否可以根据这一点来判断需要服务端渲染的页面呢？

最终了解到，服务端渲染只会渲染首页。因为将首页所需的组件和数据都渲染成整个首页完整的html字符串后，返给浏览器，然后由浏览器来接管整个应用。

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

另外，使用 `createBundleRenderer` 方法还有一个好处，在开发环境甚至部署过程中热重载（通过读取更新后的 `bundle`，然后重新创建 `renderer` 实例）；

- 3、在 entry-server.js 中的 context 对象的问题

问题1： 参数 context 会从哪里传过来
问题2： router.push(context.url) 中 url 是从哪儿传过来的，url 需要是路由的path才行，如果是 req.url 则不行吧

- 4. 使用「SSR + 客户端混合」时，需要了解的一件事是，浏览器可能会更改的一些特殊的 `HTML` 结构。例如，当你在 `Vue` 模板中写入：

```html
<table>
  <tr><td>hi</td></tr>
</table>
```

浏览器会在 `<table>` 内部自动注入 `<tbody>`，然而，由于 `Vue` 生成的虚拟 `DOM(virtual DOM)` 不包含 `<tbody>`，所以会导致无法匹配。为能够正确匹配，请确保在模板中写入有效的 `HTML`。


# 5. 疑问

- 1. 在 **客户端数据预取** 一节中，第一种方式`在路由导航之前解析数据`里面，使用了 `router.beforeResolve`，官方的原因说是：在初始路由 resolve 后执行，以便我们不会二次预取(double-fetch)已有的数据。这里不太理解。


# 参考资料

[基于vue现有项目的服务器端渲染SSR改造](https://www.cnblogs.com/xiaohuochai/p/9158675.html)