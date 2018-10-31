/* main.js 是我们应用程序的「通用 entry」。在纯客户端应用程序中，我们将在此文件中创建根 Vue 实例，并直接挂载到 DOM。但是，对于服务器端渲染(SSR)，责任转移到纯客户端 entry 文件。main.js 简单地使用 export 导出一个 createApp 函数 */

// 如果main.js中引入了全局的css文件，则要将全局css从main.js移动到App.vue中的内联style样式中，因为main.js中未设置css文件解析

import Vue from 'vue';
import App from './app';
import { createRouter } from './router';
import { createStore } from './store';
import { sync } from 'vuex-router-sync';

// 导出一个工厂函数，用于创建新的 Vue 应用程序、router 和 store 实例
export function createApp (){
  // 创建 router 和 store 实例
  const router = createRouter();
  const store = createStore();

  // 同步路由状态(route state) 到store, Sync vue-router's current $route as part of vuex store's state.
  sync(store, router);

  const app = new Vue({
    // 注入 router到根 Vue 实例
    router,
    store,
    //根实例简单的渲染应用程序组件
    render: h => h(App)
  });

  // 暴露 app, router 和 stsore
  return { app, router, store };
};
