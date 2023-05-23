<template>
  <div class="ipb-popup">
    <span class="ipb-popup__title">AO3 In-page Bookmark</span>
    <button :style="{position: 'absolute', left: 0, fontSize: '8px', width: '70px'}" @click="clearChromeStorage">Clear chrome local storage</button>
    
    <IpbTab class="ipb-groupby" title="Group by:" :options="GROUP_BY" v-model="groupBy"></IpbTab>
    <IpbTab class="ipb-sortby" title="Sort by:" :options="SORT_BY" v-model="sortBy"></IpbTab>
      
    <div class="ipb-popup__wrapper">
      <div class="ipb-popup__item" v-for="({ authorName, authorLink, chI, chID, isOneShot, perc, t, workID, workName}) in sortedWorks" :key="workID">
        <span class="ipb-popup__item__datetime">Bookmarked at {{ (new Date(t)).toLocaleString() }}</span>
        <span title="Delete this bookmark" class="ipb-close-btn" @click="() => removeWork(workID)">&#10006;</span>
        <b class="ipb-popup__item__title">{{ workName }}</b>
        <span class="ipb-author">by <a @click="() => visitURL(authorLink)">{{ authorName }}</a></span>
        <div class="ipb-bm-record">
          <IpbIcon type="bookmark"></IpbIcon>
          <b>Chapter {{ parseInt(chI) + 1 }} | {{ (perc * 100).toFixed(2) }}%</b>
        </div>
        <div class="ipb-btn">
          <button v-if="isOneShot" @click="() => visitURL(`/works/${workID}`)">Entire work</button>
          <template v-else>
            <button @click="() => visitURL(`/works/${workID}?view_full_work=true#chapter-${parseInt(chI) + 1}`)">Entire work</button>
            <button @click="() => visitURL(`/works/${workID}/chapters/${chID}#chapter-${parseInt(chI) + 1}`)">Chapter by chapter</button>
          </template>
        </div>
      </div>
      <span v-if="!sortedWorks.length" class="ipb-no-bm-msg">No bookmark added.</span>
    </div>
  </div>

  <IpbSetting></IpbSetting>
</template>

<script>
import {computed, ref} from 'vue'
import {works, removeWork, clearChromeStorage} from './works'
import IpbIcon from '@/content/components/IpbIcon.vue'
import IpbTab from './IpbTab.vue'
import IpbSetting from './IpbSetting.vue'

const AO3_DOMAIN = "https://archiveofourown.org"

const GROUP_BY = [{label: 'All', val: 'all'}, {label: 'Author', val: 'author'}]
const SORT_BY = [{label: 'Recent', val: 't'}, {label: 'Progress', val: 'perc'}]

export default {
  name: 'App',
  components: { IpbIcon, IpbTab, IpbSetting },
  setup () {
    const sortBy = ref(SORT_BY[0])
    const groupBy = ref(GROUP_BY[0])

    const sortedWorks = computed(() => {
      return Object.keys(works)
        .map(wordID => ({wordID, ...works[wordID]}))
        .sort((a, b) => b[sortBy.value.val] - a[sortBy.value.val])
    })
    const visitURL = subURL => {
      chrome.runtime.sendMessage(
        {type: 'tab', url: AO3_DOMAIN + subURL},
        res => {
          console.log(res)
        }
      )
    }
    return {
      sortedWorks, removeWork,
      sortBy, SORT_BY, groupBy, GROUP_BY,
      visitURL, clearChromeStorage
    }
  }
}
</script>

<style lang="scss">
$ao3_red: #900;

body {
  margin: 0;
}

.ipb-popup {
  width: 500px;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: left;
  background-color: #ddd;

  .ipb-popup__title {
    margin: 0;
    display: block;
    font-size: 22px;
    line-height: 1;
    padding: 6px 0 10px;
    color: $ao3_red;
    font-weight: bold;
    text-align: center;
  }

  .ipb-groupby {
    border-bottom: 3px solid $ao3_red;
    font-size: 14px;
    font-weight: bold;
    text-align: center;

    span {
      vertical-align: bottom;
      padding: 6px 10px;
      opacity: 0.7;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;

      &.current { background-color: $ao3_red; color: #FFF; opacity: 1; }
    }
  }

  .ipb-sortby {
    font-size: 14px;
    padding: 5px 10px 5px 70px;
    background: linear-gradient(to bottom, rgba(#ddd, 1) 70%, rgba(#ddd, 0) 100%);

    span {
      padding: 4px 10px;
      margin-right: 5px;
      border-radius: 12px;
      border: 1px solid $ao3_red;

      &.current { background-color: $ao3_red; color: #FFF; }
    }
  }

  .ipb-popup__wrapper {
    position: relative;
    min-height: 200px;
    overflow-y: auto;
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 5px solid #ddd;

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

    .ipb-popup__item {
      position: relative;
      background-color: #fcfcfc;
      padding: 15px 5px 10px;
      margin-bottom: 10px;
      box-shadow: 0 0 3px #999;

      & > * {
        display: block;
        
        &:not(:last-child) { padding-bottom: 10px; }
      }

      .ipb-close-btn {
        position: absolute;
        right: 5px;
        top: 5px;
        padding: 0;
        font-size: 20px;
        line-height: 1;
        transform: scale(0.95);
        opacity: 0.8;
        transition: transform 0.2s opacity 0.2s;
        cursor: pointer;

        &:hover { transform: scale(1); opacity: 1; }
      }

      .ipb-popup__item__datetime {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 11px;
        line-height: 1;
        display: inline-block;
        background-color: #ddd;
        padding: 1px;
      }

      b.ipb-popup__item__title {
        font-size: 14px;
        line-height: 16px;
        padding: 0 30px 5px 0;
        min-width: 150px;
      }

      .ipb-author {
        a {
          color: #166fce;
          text-decoration: none;
          border-bottom: 1px dashed #166fce;
          cursor: pointer;

          &:hover { border-bottom: 1px solid #166fce; }
        }
      }

      .ipb-bm-record {
        & > * { display: inline-block; vertical-align: middle; }
        .ipb-icon { width: 15px; height: 15px;}
        
      }

      .ipb-btn {
        display: flex;
        font-size: 11px;

        button {
          margin-right: 5px;
          cursor: pointer;

          &:hover {filter: brightness(0.95)};
        }
      }
    }
  }
}
</style>
