<template>
  <div class="ipb-tab">
    <h2 class="ipb-title" v-if="title">{{ title }}</h2>
    <span :class="{current: opt.val == modelValue.val}" v-for="(opt,i) in options" :key="i" @click="() => onSelect(opt)"> {{ getOptLabel(opt) }}</span>
  </div>
</template>

<script>
export default {
  props: ['modelValue', 'title', 'options'],
  emits: ['update:modelValue'],
  setup(p, {emit}) {
    const onSelect = (opt) => emit('update:modelValue', opt)

    const getOptLabel = opt => typeof opt === 'string' ? opt : opt.label

    return { onSelect, getOptLabel }
  }
}
</script>

<style lang="scss">
.ipb-tab {
  position: relative;

  h2 {
    display: inline-block;
    font-size: 14px;
    line-height: 1;
    margin: 0;
    font-weight: bold;
    padding-right: 10px;
  }

  span {
    display: inline-block;
    line-height: 1;
    cursor: pointer;
    transition: background-color 0.2s;

    &.current { pointer-events: none; }
  }
}
</style>
