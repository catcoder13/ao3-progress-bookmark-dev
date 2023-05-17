<template>
  <svg :class="`ipb-icon ipb-icon--${type}`" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path v-if="type === 'bookmark'" :fill="fill" d="M60.95745.81348H20.66508A16.0596,16.0596,0,0,0,4.62385,16.85471V99.84344l36.18053-22.558L76.99819,100V16.85471A16.05918,16.05918,0,0,0,60.95745.81348Z"/>
    <path v-if="type === 'jump'" :fill="fill" d="M21.64136,73.76636,12.241,62.0769,27.25806,49.99976,12.241,37.9231l9.40039-11.68946L51.1936,49.99976ZM87.759,49.99976,58.20728,26.23413l-9.4004,11.68848L63.82349,49.99976,48.80688,62.0769l9.4004,11.68946Z" />
  </svg>
</template>

<script>
export default {
  props: {
    type: { type: String, default: 'bookmark'},
    fill: { type: String, default: '#900' }
  }
}
</script>

