import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const findItem = id => {
    const itemArr = [
        {
            id: 1,
            name: 'tom'
        },
        {
            id: 2,
            name: 'jack'
        },
        {
            id: 3,
            name: 'zahngsan'
        }
    ];
    return itemArr.find( item => id === item.id);
};

export function createStore() {
    return new Vuex.Store({
        state: {
            items: {}
        },
        mutations: {
            setItem (state, {id, item}) {
                Vue.set(state.items, id, item);
            }
        },
        actions: {
            getItem ({commit}, id) {
                const item = findItem(id);
                commit('setItem', {id, item});
            }
        }
    });
};