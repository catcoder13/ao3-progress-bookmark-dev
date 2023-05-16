<template>
  <svg class="bm-icon" :class="{['mode-' + mode]: true}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M60.95745.81348H20.66508A16.0596,16.0596,0,0,0,4.62385,16.85471V99.84344l36.18053-22.558L76.99819,100V16.85471A16.05918,16.05918,0,0,0,60.95745.81348Z"/>
    <polygon points="49.658 93.321 8.378 64.098 19.934 47.774 45.37 65.78 84.748 13.532 100.721 25.569 49.658 93.321" stroke-miterlimit="10" stroke-width="3"/>
  </svg>
</template>

<script>
export default {
  props: {
    mode: {
      type: Number,
      default: 0
    }
    
  }
}
  
</script>

<style lang="scss">
svg.bm-icon {
  display: inline-block;
  
  path { fill: #900; }
  polygon { display: none; }

  &.mode-1 {
    path { fill: #FFF; }
  }

  &.mode-2 {
    path { fill: #900; }
    polygon { display: block; fill: green; stroke: #FFF; }
  }

  &.mode-3 {
    path { fill: #FFF; }
    polygon { display: block; fill: #FFF; stroke: #900 }
  }
}
</style>