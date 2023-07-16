<template>
  <div class="ipb-popup">
    <button @click="clearLocalStorage" :style="{position: 'fixed', zIndex: 10, cursor: 'pointer'}">Clear sync storage</button>
    <h1 class="ipb-popup__title">AO3 Progress Bookmark</h1>
    <!-- <h1 class="ipb-popup__title">&nbsp;</h1> -->
    <IpbSearch />
    
    <div class="ipb-popup__filter">
      <IpbSortByTab  title="Sort works by:" :options="SORT_BY" v-model="settingsPU.sortBy" />
      <div class="ipb-popup__filter__sideBtn">
        <span class="ipb-icon-wrapper" :title="settingsPUUI.compact ? 'Compact layout' : 'Expand layout'">
          <IpbIcon type="compact" fill="#333" :open="!settingsPUUI.compact" @click="settingsPUUI.compact = !settingsPUUI.compact" />
        </span>
      </div>
    </div>

    <div class="ipb-popup__subhead">
      <div class="ipb-popup__subhead__summary">
        <button v-if="selection" @click="clearSelection">&#10006; Clear search result</button>
        <span>{{ Object.keys(works).length }}/{{ BOOKMARK_LIMIT }} work(s)</span>
      </div>
      
      <div class="ipb-popup__subhead__author" v-if="selection && selection.type === 'author'">
        <IpbIcon type="author" fill="#166fce" />
        <a :title="`Visit ${selection.val}'s AO3 page`" @click="() => visitURL(selection.authorURL)">{{ selection.val }}</a>
      </div>
    </div>
    
    <IpbScrollWrapper class="ipb-popup__wrapper" :options="sortedWorks" :animate="true" :maxResultAllowed="10">
      <template v-slot:item="{item}">
        <IpbPopupItem :work="item" />
        {{ item.i }}
      </template>
      
      <span v-if="!Object.keys(sortedWorks).length" class="ipb-no-bm-msg">No bookmark added.</span>
    </IpbScrollWrapper>
  </div>

  <IpbSetting></IpbSetting>
</template>

<script>
import '@/common/__base.scss'

import {computed, watch} from 'vue'
import {works, visitURL} from './js/works'
import { settings, settingsPU, settingsPUUI } from './js/setting'
import { partialText, selection, clearSelection } from './js/search'
import { BOOKMARK_LIMIT, SORT_BY } from '@/common/variables'

import IpbSortByTab from './components/IpbSortByTab.vue'
import IpbSetting from './components/IpbSetting.vue'
import IpbPopupItem from './components/IpbPopupItem.vue'
import IpbIcon from '@/common/IpbIcon.vue'

import IpbSearch from './components/IpbSearch.vue'
import IpbScrollWrapper from './components/IpbScrollWrapper.vue'

export default {
  name: 'App',
  components: { IpbSortByTab, IpbSetting, IpbPopupItem, IpbIcon, IpbSearch, IpbScrollWrapper },
  setup () {
    const sortedWorks = computed(() => {
      const workArr = Object.keys(selection.value ? selection.value.works : works)
        .filter(workID => !!works[workID]) // selection.value.works is not reactive, thus need manual filtering to filter out deleted work
        .map(workID => works[workID])

      // sort works
      let workArrRef = null
      if (settingsPU.sortBy.val == 'name') {
        workArrRef = workArr.sort((a,b) => {
          const tA = a[settingsPU.sortBy.val].toUpperCase()
          const tB = b[settingsPU.sortBy.val].toUpperCase()
          return tB.localeCompare(tA) // descend by default
        })
      } else {
        workArrRef = workArr.sort((a, b) => b[settingsPU.sortBy.val] - a[settingsPU.sortBy.val]) // descend by default
      }

      return settingsPU.descends[settingsPU.sortBy.i] ? workArrRef : workArrRef.reverse()
    })

    watch(() => sortedWorks.value,
    newSortedWorks => {
      if (selection.value && !newSortedWorks.length) {
        selection.value = null
        partialText.value = ''
      }
    })

    const clearLocalStorage =  () => {
      chrome.storage.local.clear()
    }


    return {
      works, selection, sortedWorks,
      clearSelection, 
      settingsPU, settingsPUUI, SORT_BY, visitURL, settings, clearLocalStorage,
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

  .ipb-popup__title {
    display: block;
    font-size: 18px;
    line-height: 1;
    font-family: Georgia, serif;
    padding: 10px 0;
    color: #FFF;
    text-align: center;
    background: linear-gradient(to bottom, transparent 0%, #4c0000 100%);
  }

  .ipb-popup__filter {
    position: relative;
    background-color: $bm_filter_bar_color;

    .ipb-tab {
      display: block;
      padding: 5px 10px;
    }

    &.ipb-popup__filter--author {
      .ipb-sortby {
        h2 { font-size: 12px; }
        span { font-size: 10px; }
      }
    }
    
    .ipb-popup__filter__sideBtn {
      display: flex;
      gap: 3px;
      position: absolute;
      right: 5px;
      top: 5px;

      .ipb-icon-wrapper {
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.2s;

        &:hover { opacity: 1; }
      }
    }
  }

  .ipb-popup__subhead {
    line-height: 1;
    padding: 2px 10px;
    background-color: #FFF;

    .ipb-popup__subhead__summary {
      button {
        border: 1px solid #888;
        padding: 4px 8px;
        box-sizing: border-box;
        border-radius: 18px;
        margin-top: 6px;
        cursor: pointer;
        opacity: .5;
        line-height: 1;

        &:hover { opacity: 1; }
      }

      span { float: right; }
    }

    .ipb-popup__subhead__author {
      padding-top: 5px;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .ipb-popup__wrapper {
    position: relative;
    min-height: 200px;
    padding: 5px 15px 15px;
    box-sizing: border-box;
    border-top: 2px solid $bg;
    border-bottom: 5px solid $bg;
    background-color: $bg;
    overflow-y: overlay;

    .ipb-no-bm-msg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 10px;
      white-space: nowrap;
    }

    a.ipb-author {
      font-size: 16px;
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
