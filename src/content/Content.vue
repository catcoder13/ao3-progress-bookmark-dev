<template>
  <div class="navbar">
    Chapter X: 123
  </div>
  <div class="toolbar">
    <div class="circle"></div>
    <span></span>
    <button class="ao3-read-assist-bookmark">start bookmark</button>
  </div>  
</template>

<script>

import {chProgress} from './store'
export default {
  name: 'App'
}
</script>

<style lang="scss">
.ao3-in-page-bookmark {
  width: 300px;
  padding: 10px;

  .navbar {
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
    background-color: orange;
  }

  .toolbar {
    position: fixed;
    z-index: 99;
    right: 0;
    top: 50%;
    padding: 10px;
    transform: translateY(-50%);
    background-color: red;
  }
}
</style>
