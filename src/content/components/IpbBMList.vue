<template>
  <div class="ipb-bm-list">
    <span class="ipb-bm-list__title" :style="{backgroundColor: Object.keys(works).length ? '#900' : '#555'}">Bookmarked works</span>
      
    <template v-if="Object.keys(works).length">
      <div> Sort by <div>
          <span>Recent</span>
          <span>Progress</span>
        </div>
      </div>
      <div class="ipb-bm-list__wrapper">
        <div class="ipb-bm-list__item" v-for="({workName, authorName, authorLink, chI, chID, perc, isOneShot}, workID) in works" :key="workID">
          <span title="Delete this bookmark" class="ipb-close-btn" @click="() => removeBookmarkByWorkID(workID)">&#10006;</span>
          <b class="ipb-bm-list__item__title">{{ workName }}</b>
          <span class="ipb-author">by <a :href="authorLink">{{ authorName }}</a></span>
          <div class="ipb-bm-record">
            <IpbIcon type="bookmark"></IpbIcon>
            <b>Chapter {{ parseInt(chI) + 1 }} | {{ (perc * 100).toFixed(2) }}%</b>
          </div>
          <!-- <span class="ipb-btn-title">Visit bookmarked chapter via:</span> -->
          <div class="ipb-btn">
            <a v-if="isOneShot" :href="`/works/${workID}`"><button>Entire work</button></a>
            <template v-else>
              <a :href="`/works/${workID}?view_full_work=true#chapter-${parseInt(chI) + 1}`"><button>Entire work</button></a>
              <a :href="`/works/${workID}/chapters/${chID}#chapter-${parseInt(chI) + 1}`"><button>Chapter by chapter</button></a>
            </template>
          </div>
        </div>
      </div>
    </template>
    <span v-else class="ipb-no-bm-msg">No bookmark added.</span>
  </div>
</template>

<script>
import IpbIcon from './IpbIcon.vue'
import {removeBookmarkByWorkID} from './../bookmark'
import { isOneShot } from '../static'
export default {
  components: { IpbIcon },
  props: ['works'],
  setup() {
    return { isOneShot, removeBookmarkByWorkID }
  }
}
</script>

<style lang="scss">
$ao3_red: #900;

.ipb-bm-list {
  max-width: 250px;
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
      }

      .ipb-author {
        a {
          color: #166fce;
          text-decoration: none;
          border-bottom: 1px dashed #166fce;

          &:hover { border-bottom: 1px solid #166fce; }
        }
      }

      .ipb-bm-record {
        & > * { display: inline-block; vertical-align: middle; }
        .ipb-icon { width: 15px; height: 15px;}
        
      }

      // .ipb-btn-title {
      //   padding-bottom: 5px;
      // }

      .ipb-btn {
        display: flex;
        font-size: 11px;

        a {
          text-decoration: none;
          border-bottom: none;
          margin-right: 5px;

          &:hover {filter: brightness(0.95)};

          button { cursor: pointer; }
        }
        
      }
    }
  }

  
  

  
}


</style>