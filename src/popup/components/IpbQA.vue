<template>
  <div ref="scrollTarget" class="ipb-q-and-a">
    <button @click="onToggle" :class="{open}" :tabindex="getTabIndex([1])">{{ q }}</button>
    <div v-if="open">
      <p> {{ ans }}</p>
      <ul v-if="extra">
        <li v-for="(l, i) in extra" :key="i"> {{ l }}</li>
      </ul>
    </div>
    
  </div>
</template>

<script>
import { nextTick, ref } from 'vue'
import { getTabIndex } from '../js/visibility'

export default {
  props: {
    q: String,
    ans: String,
    extra: Array
  },
  setup () {
    const open = ref(false)
    const scrollTarget = ref(null)

    const onToggle = async () => {
      open.value = !open.value

      if (open.value) {
        await nextTick()
        scrollTarget.value.scrollIntoView({block: 'start', behavior: 'smooth'})
      }
    }
    return {open, onToggle, scrollTarget, getTabIndex}
  }
}
</script>

<style lang="scss">
.ipb-q-and-a {
  margin-bottom: 12px;
  color: #333;
  scroll-margin-top: 5px;

  button {
    position: relative;
    cursor: pointer;
    opacity: 0.75;
    padding-right: 15px;
    font-weight: bold;
    font-size: 11px;
    text-align: left;

    &:hover,
    &:focus-visible { opacity: 1; }

    &.open {
      opacity: 1;

      &::before {transform: rotate(-135deg); top: 6px; }
    }

    &:before {
      content: '';
      position: absolute;
      top: 1px;
      right: 0px;
      transform: rotate(45deg);
      border-right: 2px solid #888;
      border-bottom: 2px solid #888;
      height: 6px;
      width: 6px;
      transition: transform 0.2s, border-color 0.2s;
    }
  }
  
  ul {
    margin: 0;
    padding-left: 15px;
    list-style-type: decimal;
  }

}
</style>