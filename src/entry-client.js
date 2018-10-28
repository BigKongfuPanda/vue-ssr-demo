/* 客户端 entry 只需创建应用程序，并且将其挂载到 DOM 中 */

import Vue from 'vue';
import { createApp } from './app';

// 客户端特定引导逻辑...

/** 当路由组件重用（同一路由，但是 params 或 query 已更改，例如，从 user/1 到 user/2）时，也应该调用 asyncData 函数。我们也可以通过纯客户端(client-only)的全局 mixin 来处理这个问题： */
Vue.mixin({
    beforeUpdate (to, from, next) {
        const {asyncData} = this.$options;
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to
            }).then(next).catch(next);
        } else {
            next();
        }
    }
});

const { app, router, store } = createApp();

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
    // 添加路由钩子函数，用于处理 asyncData.
    // 在初始路由 resolve 后执行，
    // 以便我们不会二次预取(double-fetch)已有的数据。
    // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const prevMatched = router.getMatchedComponents(from);

        // 我们只关心非预渲染的组件
        // 所以我们对比它们，找出两个匹配列表的差异组件
        let diffed = false;
        const actived = matched.filter((c, i) => {
            return diffed || (diffed || (prevMatched[i] !== c));
        });

        if (actived.length) {
            return next();
        }

        // 这里如果有加载指示器(loading indicator)，就触发

        Promise.all(actived.map(c => {
            if (c.asyncData) {
                return c.asyncData({store, route: to});
            }
        })).then(() => {
            // 停止加载指示器(loading indicator)

            next();
        }).catch(next);
    });

    // 这里假定 App.vue 模板中根元素具有 'id="app"'
    app.$mount('#app');
});