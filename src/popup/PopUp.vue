<template>
  <div class="ipb-bm-list">
    <span class="ipb-bm-list__title">Bookmarked works</span>
    <button @click="clearChromeStorage">Clear chrome local storage</button>
    <template v-if="Object.keys(works).length">
      <div> Sort by <div>
          <span>Recent</span>
          <span>Progress</span>
        </div>
      </div>
      <div class="ipb-bm-list__wrapper">
        <div class="ipb-bm-list__item" v-for="({workName, authorName, authorLink, chI, chID, perc, isOneShot}, workID) in works" :key="workID">
          <span title="Delete this bookmark" class="ipb-close-btn" @click="() => removeWork(workID)">&#10006;</span>
          <b class="ipb-bm-list__item__title">{{ workName }}</b>
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
      </div>
    </template>
    <span v-else class="ipb-no-bm-msg">No bookmark added.</span>
  </div>
</template>

<script>
import IpbIcon from '@/content/components/IpbIcon.vue'
import {works, removeWork, clearChromeStorage} from './works'

const AO3_DOMAIN = "https://archiveofourown.org"

export default {
  name: 'App',
  components: {IpbIcon},
  setup () {
    const visitURL = subURL => {
      chrome.runtime.sendMessage(
        {type: 'tab', url: AO3_DOMAIN + subURL},
        res => {
          console.log(res)
        }
      )
    }
    return {works, removeWork, visitURL, clearChromeStorage}
  }
}
</script>

<style lang="scss">
$ao3_red: #900;

body {
  margin: 0;
}
.ipb-bm-list {
  width: 500px;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: left;
  background-color: #ddd;

  .ipb-no-bm-msg {
    padding: 10px;
    white-space: nowrap;
  }

  .ipb-bm-list__title {
    margin: 0;
    display: inline-block;
    font-size: 13px;
    line-height: 12px;
    padding: 9px 5px 9px 0px;
    color: #FFF;
    font-weight: 700;
    background-color: $ao3_red;
    white-space: nowrap;
  }

  .ipb-bm-list__wrapper {
    overflow-y: auto;
    padding: 10px 10px 10px 10px;
    border-bottom: 3px solid #ddd;

    &::-webkit-scrollbar { width: 17px; }

    &::-webkit-scrollbar-track { background-color: transparent; }

    &::-webkit-scrollbar-thumb {
      background-color: #bbb;
      border-radius: 17px;
      border: 6px solid transparent;
      background-clip: content-box;

      &:hover { background-color: #999;}
    }

    .ipb-bm-list__item {
      position: relative;
      padding-bottom: 10px;
      background-color: #fcfcfc;
      padding: 5px;
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

      b.ipb-bm-list__item__title {
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
