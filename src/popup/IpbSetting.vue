<template>
  <div class="ipb-setting" :class="{open: toggle}">
    <span class="ipb-setting__entry" @click="toggle = !toggle"></span>

    <div class="ipb-setting__options">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga unde quaerat, consectetur mollitia consequatur minus sit qui, ex sint iusto impedit pariatur, nobis ut neque similique. Error optio tempore explicabo?
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'

export default {
  setup () {
    const toggle = ref(false)

    return { toggle }
  }
}
</script>

<style lang="scss">
.ipb-setting {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  &.open {
    background-color: rgba(#000, 0.5);
    pointer-events: all;
    
    .ipb-setting__options { transform: translateX(0); }
  }

  .ipb-setting__entry {
    position: absolute;
    z-index: 1;
    right: 10px;
    top: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ddd;
    cursor: pointer;
    pointer-events: all;
  }

  .ipb-setting__options {
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 100%;
    background-color: #ddd;
    transform: translateX(100%);
    transition: transform 0.3s;
  }
}
</style>