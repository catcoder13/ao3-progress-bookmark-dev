<template>
  <div class="ipb-tab">
    <h2 class="ipb-title" v-if="title">{{ title }}</h2>
    <div :class="{current: opt.val == modelValue.val}" v-for="(opt,i) in options" :key="i" @click="() => onSelect(opt)">
      <IpbIcon v-if="opt.icon" :type="opt.icon" fill=""/>
      <span v-if="opt.symbol" v-html="opt.symbol"></span>
      {{ getOptLabel(opt) }}
    </div>
  </div>
</template>

<script>
import IpbIcon from '@/common/IpbIcon.vue'

export default {
    components: { IpbIcon },
    props: ["modelValue", "options", "title"],
    emits: ["update:modelValue"],
    setup(p, { emit }) {
        const onSelect = (opt) => emit("update:modelValue", opt);
        const getOptLabel = opt => typeof opt === "string" ? opt : opt.label;
        return { onSelect, getOptLabel };
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
    padding-right: 10px;
  }

  & > div {
    display: inline-block;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 12px;
    line-height: 11px;
    padding: 4px 10px;
    margin-right: 5px;
    border-radius: 12px;
    border: 1px solid rgba(#333, 0.7);
    background-color: #FFF;
    transition: border 0.2s, background-color 0.2s, color 0.2s;

    .ipb-icon { width: 11px; height: 11px; }
    &:hover {
      border: 1px solid rgba(#333, 1);
      background-color: rgba(#333, 0.6);
      color: #FFF;

      .ipb-icon path { fill: #FFF; }
    }

    &.current {
      pointer-events: none;
      background-color: #333;
      color: #FFF;

      .ipb-icon path { fill: #FFF; }
    }

    .ipb-icon path { fill: #333; }
  }
}
</style>
