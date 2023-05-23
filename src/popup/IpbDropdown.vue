<template>
  <div class="ipb-dropdown" :class="{open}">
    <h2 v-if="title">{{ title }}</h2>
    <div class="ipb-dropdown__entry" @click="open = !open">
      <span class="ipb-text">{{ modelValue || 'All' }}</span>
      <span class="ipb-close" v-if="modelValue" @click="onClear">&#10006;</span>

      <div class="ipb-dropdown__entry__options">
        <span :style="{pointerEvents: 'none'}" v-if="!options.length">empty.</span>
        <span v-for="(opt, i) in options" @click="e => onSelect(e, opt)" :key="i">{{ opt }}</span>
      </div>
    </div>
    
  </div>
</template>

<script>
import {ref} from 'vue'

export default {
  props: ['options', 'modelValue', 'title'],
  emits: ['update:modelValue'],
  setup(p, {emit}) {
    const open = ref(false)
    const onSelect = (e, opt) => {
      emit('update:modelValue', opt)
      open.value = false
      e.stopPropagation()
    }

    const onClear = e => {
      emit('update:modelValue', null)
      open.value = false
      e.stopPropagation()
    }
    return { open, onSelect, onClear }
  }
}
</script>

<style lang="scss">
.ipb-dropdown {
  & > * { display: inline-block; vertical-align: middle; }

  h2 {
    font-size: 14px;
    line-height: 1;
    padding-right: 10px;
  }

  .ipb-dropdown__entry {
    position: relative;
    width: 200px;
    height: 22px;
    box-sizing: border-box;
    border-radius: 25px;
    background-color: #FFF;
    border: 1px solid #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;

    font-size: 12px;
    line-height: 1;
    padding: 4px 10px;

    &:before {
      content: '';
      position: absolute;
      top: 4px;
      right: 10px;
      transform: rotate(45deg);
      border-right: 2px solid #333;
      border-bottom: 2px solid #333;
      height: 6px;
      width: 6px;
      transition: transform 0.2s;
    }

    span.ipb-close {
      position: absolute;
      top: 3px;
      right: 30px;
      font-size: 14px;
      color: #333;
      line-height: 1;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover { transform: scale(1.2);}
    }

    .ipb-dropdown__entry__options {
      display: none;
      position: absolute;
      z-index: 1;
      top: 21px;
      left: 10px;
      flex-direction: column;
      background-color: #FFF;
      font-size: 14px;
      box-shadow: 0px 2px 5px #999;
      max-height: 100px;
      overflow-y: overlay;
      min-width: calc(100% - 20px);

      span {
        line-height: 1;
        padding: 5px 20px 5px 10px;
        cursor: pointer;

        &:nth-child(2n+1) { background-color: #eee; }

        &:hover {
          background-color: #aaa;
          color: #FFF;
        }
      }

      &::-webkit-scrollbar { width: 15px; }

      &::-webkit-scrollbar-track { background-color: transparent; }

      &::-webkit-scrollbar-thumb {
        background-color: #bbb;
        border-radius: 17px;
        border: 6px solid transparent;
        background-clip: content-box;

        &:hover { background-color: #999;}
      }
    }
  } // ipb-dropdown__entry

  &.open {
    .ipb-dropdown__entry {
      overflow: visible;

      .ipb-text { color: #aaa; }

      &::before { transform: rotate(-135deg); top: 7px; }
    }

    .ipb-dropdown__entry__options { display: flex; }
  }

  
}
</style>