<template>
  <label class="ipb-toggle">
    <input type="checkbox" :checked="modelValue" @input="onChange"/>
    <span></span>
  </label>
</template>

<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup (p, {emit}) {
    const onChange = e => emit('update:modelValue', e.target.checked)
    
    return { onChange }
  }
}
</script>

<style lang="scss">
.ipb-toggle {
  display: inline-block;
  width: 40px;
  height: 17px;
  cursor: pointer;

  input {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
    opacity: 0;

    &:checked ~ span::before {
      left: 100%;
      transform: translate(calc(-100% - 2px), -50%);
      background-color: $green;
    }
  }

  input ~ span {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: #FFF;
    border-radius: 15px;
    border: 1px solid #999;
    box-sizing: border-box;
    opacity: 0.7;

    &:hover { opacity: 1; }

    &::before {
      content: '';
      display: block;
      width: 13px;
      height: 13px;
      position: absolute;
      top: 50%;
      left: 2px;
      transform: translate(0, -50%);
      background-color: #888;
      border-radius: 50%;
      transition: left 0.2s, transform 0.2s;
    }
  }
}
</style>