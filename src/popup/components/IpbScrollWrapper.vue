<template>
  <div ref="wrapper" class="ipb-scroll-wrapper" @scroll="onScroll">
    <slot></slot>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
export default {
  setup (p, {emit}) {
    const wrapper = ref(null)

    const onScroll = e => {
      console.log('scroll~')
    }

    onMounted(() => {
      emit('ready', wrapper.value)
    })

    return {wrapper, onScroll}
  }
}
</script>

<style lang="scss">
.ipb-scroll-wrapper {

}
</style>
