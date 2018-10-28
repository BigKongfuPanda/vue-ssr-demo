<template>
    <div>
        {{item.title}}
    </div>
</template>

<script>
export default {
    asyncData ({store, route}) {
        // 出发action后, dispatch方法会返回promise
        return store.dispatch('getItem', route.params.id);
    },
    data() {
        return {};
    },
    computed: {
        item() {
            return this.$store.state.items[this.$route.params.id];
        }
    }
};
</script>
<style lang='scss' scoped>
</style>