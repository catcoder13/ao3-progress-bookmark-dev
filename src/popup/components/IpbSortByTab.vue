<template>
  <div class="ao3pb-tab">
    <h2 class="ao3pb-title" v-if="title">{{ title }}</h2>
    <button :class="{current: opt.val == modelValue.val}" v-for="(opt,i) in options" :key="i" @click="() => onSelect(opt)" :tabindex="getTabIndex([0])">
      <IpbIcon v-if="opt.icon" :type="opt.icon" fill=""/>
      <span class="ao3pb-symbol" v-if="opt.symbol" v-html="opt.symbol"></span>
      <span>{{getOptLabel(opt)}}</span>
      <button class="ao3pb-sort" :title="`${opt.label} is sorted in ${settingsPU.descends[i] ? 'descending' : 'ascending'} order`"
        @click="e => updateDescends(e, i)" :tabindex="getTabIndex([0], opt.val === modelValue.val)">
        <IpbIcon type="sort" fill="#333" :open="!settingsPU.descends[i]"/>
      </button>
    </button>
  </div>
</template>

<script>
import IpbIcon from '@/common/IpbIcon.vue'

import { getTabIndex } from '../js/visibility'
import { settingsPU } from '../js/setting'

export default {
    components: { IpbIcon },
    props: ["modelValue", "options", "title"],
    emits: ["update:modelValue"],
    setup(p, { emit }) {
        const onSelect = (opt) => emit("update:modelValue", opt)
        const getOptLabel = opt => typeof opt === "string" ? opt : opt.label

        const updateDescends = (e, i) => {
          const descendRef = settingsPU.descends
          descendRef[i] = !descendRef[i]

          settingsPU.descends = descendRef

          e.preventDefault()
        }
        return { onSelect, getOptLabel, updateDescends, settingsPU, getTabIndex }
    }
}
</script>

<style lang="scss">
.ao3pb-tab {
  position: relative;

  h2 {
    display: inline-block;
    font-size: 12px;
    line-height: 1;
    margin: 0;
    padding-right: 5px;
  }

  & > button {
    display: inline-block;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 12px;
    line-height: 10px;
    padding: 3px 10px;
    margin-right: 5px;
    border-radius: 12px;
    border: 1px solid rgba(#333, 0.7);
    background-color: #FFF;
    transition: border 0.2s, background-color 0.2s, color 0.2s;
    opacity: 0.8;

    & > * {
      display: inline;
      vertical-align: middle;

      &:not(:last-child) { padding-right: 2px; }
    }

    .ao3pb-icon {
      width: 11px;
      height: 11px;

      path { fill: #333; }
    }

    button.ao3pb-sort {
      pointer-events: none;
      opacity: 0.2;
    }

    &:hover,
    &:focus-visible {
      border: 1px solid rgba(#333, 1);
      background-color: rgba(#333, 0.6);
      color: #FFF;

      .ao3pb-icon path { fill: #FFF; }
    }

    &.current {
      pointer-events: none;
      background-color: #333;
      color: #FFF;
      opacity: 1;
      
      .ao3pb-icon path { fill: #FFF; }

      .ao3pb-sort {
        pointer-events: all;
        cursor: pointer;
        opacity: 1;

        &:hover,
        &:focus-visible {
          .ao3pb-icon {
            transform: scale(1.2);
            
            path { fill: red; }
          }
        }
      } 
    }
  }
}
</style>
