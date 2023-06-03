<template>
  <div class="ipb-dropdown" :class="{open}">
    <h2 v-if="title">{{ title }}</h2>
    <div class="ipb-dropdown__entry">
      <input type="text" @click="open = !open" @blur="onBlur" readonly :value="modelValue || 'All'"/>
      <span class="ipb-close" v-if="modelValue" @click="onClear">&#10006;</span>

      <div class="ipb-style-scrollbar">
        <span :style="{pointerEvents: 'none'}" v-if="!options.length">empty.</span>
        <button class="ipb-input-blur-ref" v-for="(opt, i) in options" @click="e => onSelect(e, opt)" :key="i">{{ opt }}</button>
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

    const onBlur = e => {
      if (!e.relatedTarget || !e.relatedTarget.classList.contains('ipb-input-blur-ref')) {
        open.value = false
      }
    }
    return { open, onSelect, onBlur, onClear }
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
    width: 180px;
    height: 20px;
    overflow: hidden;

    &:before {
      content: '';
      position: absolute;
      top: 3px;
      right: 10px;
      transform: rotate(45deg);
      border-right: 2px solid #888;
      border-bottom: 2px solid #888;
      height: 6px;
      width: 6px;
      transition: transform 0.2s, border-color 0.2s;
    }

    &:hover {
      input { border: 1px solid #444; }

      &::before { border-color: #444; }
    }

    input {
      width: 100%;
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 4px 40px 4px 10px;
      box-sizing: border-box;
      background-color: #FFF;
      border: 1px solid #888;
      border-radius: 25px;
      caret-color: transparent;
      cursor: pointer;
      transition: border 0.2s;

      &:focus-visible { border: 1px solid #333; }
    }

    span.ipb-close {
      position: absolute;
      top: 50%;
      right: 30px;
      transform: translateY(-50%);
      font-size: 14px;
      color: #888;
      line-height: 1;
      cursor: pointer;
      transition: transform 0.2s, color 0.2s;

      &:hover { transform: translateY(-50%) scale(1.2); color: #333; }
    }

    .ipb-style-scrollbar {
      display: none;
      position: absolute;
      z-index: 1;
      top: 21px;
      left: 10px;
      flex-direction: column;
      font-size: 14px;
      box-shadow: 0px 2px 5px #999;
      max-height: 100px;
      min-width: calc(100% - 20px);
      overflow-y: overlay;

      span,
      button {
        line-height: 1;
        padding: 5px 10px;
        background-color: #FFF;
        text-align: left;

        &:nth-child(2n+1) { background-color: #eee; }
      }

      button {
        text-align: left;
        cursor: pointer;
        font-size: 13px;
        color: #333;

        &:hover {
          background-color: #aaa;
          color: #FFF;
        }
      }      
    }
  } // ipb-dropdown__entry

  &.open {
    .ipb-dropdown__entry {
      overflow: visible;

      input { color: #aaa; }

      &::before { transform: rotate(-135deg); top: 7px; }
    }

    .ipb-style-scrollbar { display: flex; }
  }

  
}
</style>