<template>
  <div class="ipb-popup">
    <h1 class="ipb-popup__title">AO3 In-page Bookmark</h1>
    <button :style="{position: 'absolute', left: 0, fontSize: '8px', width: '70px'}" @click="clearChromeStorage">Clear chrome local storage</button>
    
    <IpbTab class="ipb-groupby" title="View mode:" :options="VIEW_MODES" v-model="viewMode"></IpbTab>

    <template v-if="viewMode.val === 'all'">
      <div class="ipb-popup-filter">
        <IpbTab class="ipb-sortby" title="Sort by:" :options="SORT_BY" v-model="sortBy"></IpbTab>
      </div>
      <div class="ipb-popup__wrapper">
        <TransitionGroup name="fade-in">
          <IpbPopupItem v-for="(work, i) in sortWorks(allGroup)" :key="i" :work="work"></IpbPopupItem>
        </TransitionGroup>
        <span v-if="!allGroup.length" class="ipb-no-bm-msg">No bookmark added.</span>
      </div>
    </template>

    <template v-else>
      <div class="ipb-popup-filter ipb-popup-filter--author">
        <IpbDropdown :options="Object.keys(worksGroupByAuthor)" v-model="selectedAuthor" title="Filter by author:"></IpbDropdown>
        <IpbTab v-if="selectedAuthor && worksGroupByAuthor[selectedAuthor].length > 1" class="ipb-sortby" title="Sort by:" :options="SORT_BY" v-model="sortBy"></IpbTab>
      </div>
      
      <div class="ipb-popup__wrapper">
        <div class="ipb-popup__author-works" v-for="(authorWorks, authorName) in filteredWorksGroupByAuthor" :key="authorName">
          <h2 class="ipb-author">{{ authorName }}</h2>
          <TransitionGroup name="fade-in">
            <IpbPopupItem v-for="(work, j) in sortWorks(authorWorks)" :key="j" :work="work" :hideAuthor="true"></IpbPopupItem>
          </TransitionGroup>
        </div>
        <span v-if="!Object.keys(filteredWorksGroupByAuthor).length" class="ipb-no-bm-msg">No bookmark added.</span>
      </div>
    </template>
      
  </div>

  <IpbSetting></IpbSetting>
</template>

<script>
import {computed, ref} from 'vue'
import {works, worksGroupByAuthor, clearChromeStorage} from './works'

import IpbTab from './IpbTab.vue'
import IpbSetting from './IpbSetting.vue'
import IpbPopupItem from './IpbPopupItem.vue'
import IpbDropdown from './IpbDropdown.vue'

const VIEW_MODES = [{label: 'All', val: 'all'}, {label: 'Author', val: 'author'}]
const SORT_BY = [{label: 'Recent bookmark', val: 't'}, {label: 'Read progress', val: 'perc'}, {label: 'Title', val: 'workName'}]

export default {
  name: 'App',
  components: { IpbTab, IpbSetting, IpbPopupItem, IpbDropdown },
  setup () {
    const sortBy = ref(SORT_BY[0])
    const viewMode = ref(VIEW_MODES[0])
    const selectedAuthor = ref(null)


    const sortWorks = workGroup => {
      if (sortBy.value.val == 'workName') {
        return workGroup.sort((a, b) => {
          const tA = a[sortBy.value.val].toUpperCase()
          const tB = b[sortBy.value.val].toUpperCase()
          return tA < tB ? -1 : (tA > tB) ? 1 : 0
        })
      }

      return workGroup.sort((a, b) => b[sortBy.value.val] - a[sortBy.value.val])
    }

    const allGroup = computed(() => {
      return Object.keys(works).map(workID => ({workID, ...works[workID]}))
    })

    const filteredWorksGroupByAuthor = computed(() => {
      if (selectedAuthor.value) {
        return {[selectedAuthor.value]: worksGroupByAuthor.value[selectedAuthor.value]}
      }

      return worksGroupByAuthor.value
    })

    return {
      allGroup, worksGroupByAuthor, filteredWorksGroupByAuthor, sortWorks, selectedAuthor,
      sortBy, SORT_BY, viewMode, VIEW_MODES,
      clearChromeStorage
    }
  }
}
</script>

<style lang="scss">
$ao3_red: #900;
$bg: #ddd;

body {
  margin: 0;
  color: #333;
}

p,
h1,
h2, 
h3 {
  margin: 0;
}

.ipb-popup {
  width: 400px;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: left;
  background-color: $ao3_red;
  user-select: none;

  .ipb-popup__title {
    display: block;
    font-size: 22px;
    line-height: 1;
    padding: 6px 0 10px;
    color: #FFF;
    font-weight: bold;
    text-align: center;
  }

  .ipb-groupby {
    border-bottom: 3px solid #FFF;
    font-size: 14px;
    text-align: center;

    h2 {
      color: #FFF;
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
    }

    span {
      vertical-align: bottom;
      padding: 6px 10px;
      opacity: 0.7;
      color: #FFF;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;

      &.current { background-color: #FFF; opacity: 1; color: #333; font-weight: bold; }

      &:hover { opacity: 1;}
    }
  }

  .ipb-sortby {
    span {
      font-size: 12px;
      line-height: 11px;
      padding: 4px 10px;
      margin-right: 5px;
      border-radius: 12px;
      border: 1px solid rgba(#333, 0.7);

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

  .ipb-popup-filter {
    background-color: #FFF;

    & > * {
      display: block;
      padding: 5px 10px;
    }

    &.ipb-popup-filter--author {
      .ipb-sortby {
        h2 { font-size: 12px; }
        span { font-size: 10px; }
      }
    }

    
  }

  .ipb-popup__wrapper {
    position: relative;
    min-height: 200px;
    overflow-y: overlay;
    padding: 10px 15px;
    box-sizing: border-box;
    border-top: 2px solid $bg;
    border-bottom: 5px solid $bg;
    background-color: $bg;

    &::-webkit-scrollbar { width: 15px; }

    &::-webkit-scrollbar-track { background-color: transparent; }

    &::-webkit-scrollbar-thumb {
      background-color: #bbb;
      border-radius: 17px;
      border: 6px solid transparent;
      background-clip: content-box;

      &:hover { background-color: #999;}
    }

    .ipb-no-bm-msg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 10px;
      white-space: nowrap;
    }

    h2.ipb-author {
      line-height: 1;
      padding: 0 5px 10px;
      // padding-bottom: 10px;
    }

    .ipb-popup__author-works {
      // &:not(:first-child) h2 { margin-top: 25px; }
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
  position: absolute;
  opacity: 0;
}
</style>
