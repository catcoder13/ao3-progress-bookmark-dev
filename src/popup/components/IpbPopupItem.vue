<template>
  <template v-if="settingPopup.compact">
    <div class="ipb-popup-item" :class="{'ipb-popup-item--small': settingPopup.compact}">
      <div class="ipb-info">
        <h3>{{ work.name }} </h3>
          <span class="ipb-author">by <a @click="() => visitURL(work.authorURL)">{{ work.author }}</a></span>
          <span class="ipb-popup__item__datetime"><IpbIcon type="clock" fill="#555"/>{{ (new Date(work.t)).toLocaleString() }}</span>
      </div>

      <div class="ipb-record">
        <div class="ipb-record-content">
          <p>
            <button v-if="work.oneShot" :title="`One-shot: ${work.name}`" @click="() => visitURL(`/works/${work.workID}`)">
              <IpbIcon type="bookmark" fill="#555" />One-shot</button>
            <button v-else :title="`Chapter ${parseInt(work.chI) + 1}${work.chTitle ? `: ${work.chTitle}` : ''}`" @click="() => visitURL(`/works/${work.workID}/chapters/${work.chID}#chapter-${parseInt(work.chI) + 1}`)">
              <IpbIcon type="bookmark" fill="#555" />Chapter {{parseInt(work.chI) + 1}}</button>
          </p>
          <p>
            <IpbIcon type="location" fill="#555" /><b>{{ (work.perc * 100).toFixed(2) }}%</b>
        </p> 
        </div>
      </div>

      <span title="Delete this bookmark" class="ipb-close-btn" @click="() => removeWork(work.workID)">&#10006;</span>
    </div>
  </template>

  <template v-else>
    <div class="ipb-popup-item">
      <div class="ipb-info">
        <h3>{{ work.name }}</h3>
        <span>by <a @click="() => visitURL(work.authorURL)">{{ work.author }}</a></span>
        <span class="ipb-popup__item__datetime"><IpbIcon type="clock" fill="#555"/>Bookmarked at {{ (new Date(work.t)).toLocaleString() }}</span>
      </div>

      <div class="ipb-record">
        <div class="ipb-record-content">
            <p>
              <span class="ipb-pretitle">
                <IpbIcon type="bookmark" fill="#555"></IpbIcon>
                <b v-if="work.oneShot">One-shot</b>
                <span v-else>Bookmarked at</span><br />
            </span>
              <button v-if="work.oneShot" :title="`One-shot: ${work.name}`" @click="() => visitURL(`/works/${work.workID}`)">Entire work</button>
              <button v-else :title="`Chapter ${parseInt(work.chI) + 1}${work.chTitle ? `: ${work.chTitle}` : ''}`" @click="() => visitURL(`/works/${work.workID}/chapters/${work.chID}#chapter-${parseInt(work.chI) + 1}`)">Chapter {{parseInt(work.chI) + 1}}</button>
            </p>
            <p>
              <IpbIcon type="location" fill="#555"></IpbIcon><b>{{ (work.perc * 100).toFixed(2) }}%</b>
            </p> 
            
        </div>
      </div>
      <span title="Delete this bookmark" class="ipb-close-btn" @click="() => removeWork(work.workID)">&#10006;</span>
    </div>
  </template>
  
</template>

<script>
import { removeWork, visitURL } from '../js/works'
import { settings, settingPopup } from '../js/setting'

import IpbIcon from '@/common/IpbIcon.vue'


export default {
  props: ['work'],
  components: {IpbIcon},
  setup () {
    return { removeWork, visitURL, settings, settingPopup } 
  }
}
</script>

<style lang="scss">
.ipb-popup-item {
  position: relative;
  background-color: #eee;
  margin-bottom: 15px;
  box-shadow: 0 0 3px #999;

  & > * { box-sizing: border-box; }
  
  .ipb-info {
    padding: 10px;
    width: calc(100% - 135px);

    h3 {
      font-family: Georgia, serif;
      font-size: 18px;
      line-height: 1.2;
    }

    p { margin: 10px 0 5px; }

    .ipb-author { font-size: 13px; }

    .ipb-popup__item__datetime {
      display: block;
      font-size: 11px;
      line-height: 1;
      padding: 2px;
      color: #555;
      margin-top: 10px;
      opacity: 0.8;

      .ipb-icon {
        padding-right: 5px;
        vertical-align: bottom;
      }
    }
  } // ipb-info

  .ipb-record {
    position: absolute;
    top: 0;
    right: 0;
    width: 135px;
    height: 100%;
    padding: 8px;
    padding-right: 20px;
    background-color: #ccc;
    

    .ipb-record-content {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);

      p {
        font-size: 12px;
        line-height: 1;
        color: #555;

        .ipb-pretitle {
          white-space: nowrap;
        }

        button {
          padding: 2px 5px;
          margin: 2px 0;
          cursor: pointer;

          &:hover { filter: brightness(0.9); }
          &:active { filter: brightness(0.95); }
        }
      }

      .ipb-icon { vertical-align: bottom; }

      b {
        color: #444;
        font-size: 14px;
      }
      
    }
  } // ipb-record

  .ipb-close-btn {
    position: absolute;
    right: 3px;
    top: 3px;
    padding: 0;
    font-size: 17px;
    line-height: 1;
    transform: scale(1);
    opacity: 0.8;
    transition: transform 0.2s, opacity 0.2s;
    cursor: pointer;

    &:hover { transform: scale(1.2); opacity: 1; }
  }
} // ipb-popup-item

.ipb-popup-item.ipb-popup-item--small {
  margin-bottom: 5px;
  
  .ipb-info {
    padding: 8px;
    
    h3 { font-size: 16px; }

    .ipb-author { font-size: 11px; }

    .ipb-popup__item__datetime {
      margin-top: 4px;
      vertical-align: text-bottom;
      font-size: 11px;

      .ipb-icon { width: 13px; height: 13px;}
    }
  }

  .ipb-record {
    .ipb-record-content {
      b {
        line-height: 1;
        font-size: 12px;
      }
    }
  }
}
</style>