<template>
  <div class="ipb-tab">
    <span :class="{current: opt === modelValue}" v-for="(opt,i) in options" :key="i" @click="() => onSelect(opt)"> {{ opt }}</span>
  </div>
</template>

<script>
export default {
  props: ['modelValue', 'options'],
  emits: ['update:modelValue'],
  setup(p, {emit}) {
    const onSelect = (opt) => emit('update:modelValue', opt)
    return { onSelect }
  }
}
</script>

<style lang="scss">
.ipb-tab {
  span {
    display: inline-block;
    line-height: 1;
    cursor: pointer;

    &.current { pointer-events: none; }
  }
}
</style>
