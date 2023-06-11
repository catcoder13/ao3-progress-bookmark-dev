<template>
  <div class="ipb-popup" :class="{compact: settingPopup.compact}">
    <button @click="clearLocalStorage" :style="{position: 'fixed', zIndex: 10, cursor: 'pointer'}">Clear sync storage</button>
    <h1 class="ipb-popup__title">AO3 In-page Bookmark</h1>
    <IpbSearch />
    
    <div class="ipb-popup__filter">
      <IpbTab class="ipb-sortby" title="Sort by:" :options="SORT_BY" v-model="sortBy"></IpbTab>
      <span class="ipb-icon-wrapper" :title="`Sort ${sortBy.label.toLowerCase()} in ${ascend ? 'ascending' : 'descending'} order`">
        <IpbIcon type="sort" fill="#333" :open="ascend" @click="ascend = !ascend" />
      </span>
      <span class="ipb-icon-wrapper" :title="settingPopup.compact ? 'Compact layout' : 'Expand layout'">
        <IpbIcon type="compact" fill="#333" :open="!settingPopup.compact" @click="settingPopup.compact = !settingPopup.compact" />
      </span>
    </div>
    <div class="ipb-popup__work-count">{{ Object.keys(works).length }}/{{ BOOKMARK_LIMIT }} work(s)</div>
    
    <div class="ipb-popup__wrapper ipb-style-scrollbar">
      <TransitionGroup name="fade-in">
        <IpbPopupItem v-for="work in sortedWorks" :key="work.workID" :work="work" />
      </TransitionGroup>
      <span v-if="!Object.keys(sortedWorks).length" class="ipb-no-bm-msg">No bookmark added.</span>
    </div>
  </div>

  <IpbSetting></IpbSetting>
</template>

<script>
import '@/common/__base.scss'

import {computed, ref, watch} from 'vue'
import {works, visitURL} from './js/works'
import { settings, settingPopup } from './js/setting'
import { partialText, selection } from './js/search'

import IpbTab from './components/IpbTab.vue'
import IpbSetting from './components/IpbSetting.vue'
import IpbPopupItem from './components/IpbPopupItem.vue'
import IpbIcon from '@/common/IpbIcon.vue'
import { BOOKMARK_LIMIT } from '@/common/variables'
import IpbSearch from './components/IpbSearch.vue'

const VIEW_MODES = [{label: 'All', val: 'all'}, {label: 'Author', val: 'author'}]
const SORT_BY = [{label: 'Recent bookmark', val: 't'}, {label: 'Progress', val: 'perc'}, {label: 'Title', val: 'name'}]

export default {
  name: 'App',
  components: { IpbTab, IpbSetting, IpbPopupItem, IpbIcon, IpbSearch },
  setup () {
    const sortBy = ref(SORT_BY[0])
    const viewMode = ref(VIEW_MODES[0])
    const ascend = ref(true)

    const sortedWorks = computed(() => {
      if (selection.value) targetWorks = selection.value.works

      const workArr = Object.keys(selection.value ? selection.value.works : works)
        .filter(workID => !!works[workID]) // selection.value.works is not reactive, thus need manual filtering to filter out deleted work
        .map(workID => works[workID])

      // sort works
      let workArrRef = null
      if (sortBy.value.val == 'name') {
        workArrRef = workArr.sort((a, b) => {
          const tA = a[sortBy.value.val].toUpperCase()
          const tB = b[sortBy.value.val].toUpperCase()
          return tA < tB ? -1 : (tA > tB) ? 1 : 0
        })
      } else {
        workArrRef = workArr.sort((a, b) => b[sortBy.value.val] - a[sortBy.value.val])
      }

      return ascend.value ? workArrRef : workArrRef.reverse()
    })

    watch(() => sortedWorks.value,
    newSortedWorks => {
      console.log('new sorted work', newSortedWorks)
      if (selection.value && !newSortedWorks.length) {
        selection.value = null
        partialText.value = ''
        console.log('result become empty. clear selection')
      }
    })

    const clearLocalStorage =  () => {
      chrome.storage.local.clear()
    }


    return {
      works, selection, sortedWorks,
      sortBy, SORT_BY, viewMode, VIEW_MODES, visitURL, settings, settingPopup, ascend, clearLocalStorage,
      BOOKMARK_LIMIT
    }
  }
}
</script>

<style lang="scss">
$bg: #FFF;

.ipb-popup {
  width: 450px;
  max-height: 350px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: left;
  background-color: $ao3_red;
  user-select: none;

  &.compact .ipb-popup__author-works .ipb-author { font-size: 16px; }

  .ipb-popup__title {
    display: block;
    font-size: 18px;
    line-height: 1;
    font-family: Georgia, serif;
    padding: 10px 0 20px;
    color: #FFF;
    text-align: center;
    background: linear-gradient(to bottom, #4c0000 0%, transparent);
  }

  .ipb-sortby {
    span {
      font-size: 12px;
      line-height: 11px;
      padding: 4px 10px;
      margin-right: 5px;
      border-radius: 12px;
      border: 1px solid rgba(#333, 0.7);
      background-color: #FFF;
      transition: border 0.2s, background-color 0.2s, color 0.2s;

      &:hover {
        border: 1px solid rgba(#333, 1);
        background-color: rgba(#333, 0.6);
        color: #FFF;
      }

      &.current {
        background-color: #333;
        color: #FFF;
      }
    }
  }

  .ipb-popup__filter {
    position: relative;
    background-color: $bm_filter_bar_color;
    padding-bottom: 2px;

    & > div {
      display: block;
      padding: 5px 10px;
    }

    &.ipb-popup__filter--author {
      .ipb-sortby {
        h2 { font-size: 12px; }
        span { font-size: 10px; }
      }
    }

    .ipb-icon-wrapper {
      position: absolute;
      right: 5px;
      top: 5px;
      cursor: pointer;
      opacity: 0.8;
      transition: opacity 0.2s;

      &:hover { opacity: 1; }

      &:first-of-type { right: 25px; }
    }
  }

  .ipb-popup__work-count {
    line-height: 1;
    padding: 2px 10px;
    background-color: #FFF;
  }

  .ipb-popup__wrapper {
    position: relative;
    min-height: 200px;
    padding: 15px 15px;
    box-sizing: border-box;
    border-top: 2px solid $bg;
    border-bottom: 5px solid $bg;
    background-color: $bg;

    .ipb-no-bm-msg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 10px;
      white-space: nowrap;
    }

    a.ipb-author {
      font-size: 18px;
      font-weight: bold;
      display: inline-block;
      line-height: 1;
      padding-bottom: 2px;
      margin-bottom: 5px;
      color: $link_blue;
      border-color: $link_blue;
    }

    .ipb-popup__author-works {
      padding-bottom: 10px;
    }
  }
}

.fade-in-enter-active {
  transition: all 0.5s ease;
}

.fade-in-leave-active {
  transition: all 0.5s ease;
}

.fade-in-enter,
.fade-in-leave-to {
  opacity: 0;
}
</style>
