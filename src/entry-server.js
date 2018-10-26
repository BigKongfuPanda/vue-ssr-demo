/** 服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。此时，除了创建和返回应用程序实例之外，还要执行服务器端路由匹配(server-side route matching)和数据预取逻辑(data pre-fetching logic) */

import { createApp } from './app';

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