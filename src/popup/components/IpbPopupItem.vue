<template>
  <div class="ipb-popup-item" :class="ipbPopupItemClass()">
    <div class="ipb-info">
      <h3>{{ work.name }}</h3>
      <template v-if="!selection || selection.type !== 'author'">
        <a href="#" v-if="!selection || selection.type !== 'author'" class="ipb-author"
        @click="() => selectAuthor(work.author)" :tabindex="getTabIndex([0])" :title="`Search ${work.author}'s bookmarked works`">
          <IpbIcon type="author" fill="#166fce" />
          <span v-if="settingsPUUI.compact !== 2">{{ work.author }}</span>
        </a>
      </template>
      <span class="ipb-popup__item__datetime" :title="`Bookmark created/updated on ${time}`">
        <template v-if="settingsPUUI.compact === 0">&#x1F550; {{time}}</template>
        <template v-else>&#x1F550;</template>
      </span>
    </div>

    <div class="ipb-record">
      <div class="ipb-record-content">
        <button :class="{oneshot: work.oneShot}" :title="btnTitle" @click="onBtnClick" :tabindex="getTabIndex([0])">
          <b v-if="!settingsPUUI.compact">{{work.oneShot ? 'One-shot' : `Chapter ${parseInt(work.chI) + 1}`}}<br/></b>
          <span v-else class="ipb-chapter-num">{{ work.oneShot ? '' : parseInt(work.chI) + 1 }}</span>
          <p><span>{{ percStr }}</span><IpbIcon type="location" fill="#555" /></p>
        </button>
      </div>
    </div>

    <button title="Remove this bookmark" class="ipb-close-btn" @click="() => removeWork(work.id)" :tabindex="getTabIndex([0])">
      <span >&#10006;</span>
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { getTabIndex } from '../js/visibility'
import { removeWork, visitURL } from '../js/works'
import { settings, settingsPUUI } from '../js/setting'
import { selectAuthor, selection } from '../js/search'
import IpbIcon from '@/common/IpbIcon.vue'


export default {
  props: ['work'],
  components: {IpbIcon},
  setup (p) {
    const percStr = computed(() => (p.work.perc * 100).toFixed(2) + '%')
    const time = (new Date(p.work.t)).toLocaleString()
    const onBtnClick = () => {
      if (p.work.oneShot) {
        visitURL(`/works/${p.work.id}?jumptobm`)
      } else {
        visitURL(`/works/${p.work.id}/chapters/${p.work.chID}?jumptobm`)
      }
    }
    const btnTitle = computed(() => {
      if (p.work.oneShot) {
        return `Visit One-shot (${percStr.value})`
      }

      return `Visit Chapter ${parseInt(p.work.chI) + 1}${p.work.chTitle ? `: ${p.work.chTitle}` : ''} (${percStr.value})`
    })

    const ipbPopupItemClass = () => {
      return {
        'ipb-popup-item--compact': settingsPUUI.compact,
        [`ipb-compact-${settingsPUUI.compact}`]: settingsPUUI.compact
      }
    }
    return { percStr, btnTitle, time, removeWork, onBtnClick, settings, settingsPUUI, ipbPopupItemClass, selectAuthor, selection, getTabIndex } 
  }
}
</script>

<style lang="scss">
.ipb-popup-item.ipb-popup-item--compact {

  .ipb-popup__item__datetime { padding-left: 2px; }

  &.ipb-compact-1 {
    a.ipb-author,
    .ipb-popup__item__datetime {
      display: inline;
      vertical-align: middle;
    }

    .ipb-info {
      h3 { font-size: 14px; }
      a.ipb-author { font-size: 11px; }
    }
  }

  &.ipb-compact-2 {
    a.ipb-author {
      padding-left: 2px;

      .ipb-icon { width: 13px; height: 13px;}
    }
    .ipb-info > * { display: inline; font-size: 13px; }
  }

  

  .ipb-record .ipb-record-content button {
    padding: 4px 8px;

    &.oneshot .ipb-chapter-num {
      padding: 0;
      background-color: #ccc;
    }

    .ipb-chapter-num {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      padding: 2px 4px 2px 5px;
      box-sizing: border-box;
      background-color: #888;
      color: #FFF;
      font-size: 11px;
      font-weight: bold;
      line-height: 20px;
      min-width: 23px;
    }

    p {
      text-align: right;

      span { font-size: 11px;}
    }
  }
}

.ipb-popup-item {
  position: relative;
  background-color: #eee;
  margin-bottom: 7px;
  box-shadow: 0 0 3px #999;

  & > * { box-sizing: border-box; }
  
  .ipb-info {
    padding: 8px 18px 8px 8px;
    width: calc(100% - 135px);

    h3 {
      font-family: Georgia, serif;
      font-size: 16px;
      line-height: 1.2;
      word-wrap: break-word;

      & > span {
        display: inline;
        vertical-align: middle;

        &.ipb-datetime {
          padding-left: 2px;
          font-size: 12px;
          opacity: 0.6;
        }
      }
    }

    a.ipb-author {
      font-size: 12px;
      word-wrap: break-word;
      
      & > * { vertical-align: text-bottom; }
    }

    .ipb-popup__item__datetime {
      display: block;
      font-size: 11px;
      line-height: 1;
      color: #555;
      margin-top: 10px;
      opacity: 0.8;
      user-select: none;
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

      font-size: 12px;
      line-height: 1;
      color: #555;

      button {
        padding: 22px 8px 4px;
        margin: 4px 0;
        cursor: pointer;
        background-color: #FFF;
        border-radius: 12px;
        border: 1px solid #888;
        width: 110px;
        box-sizing: border-box;
        overflow: hidden;

        &.oneshot b { background-color: #ccc; color: #444; }

        b {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background-color: #888;
          padding: 4px 2px;
          box-sizing: border-box;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 13px;
          line-height: 1;
          overflow: hidden;
          color: #FFF;
        }

        span { font-size: 12px; }

        &:hover { filter: brightness(0.9); }
        &:active { filter: brightness(0.95); }
      }
    }
  } // ipb-record

  .ipb-close-btn {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0;
    height: 100%;
    width: 12px;
    background-color: #666;
    opacity: 0.2;
    transition: opacity 0.2s;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      transition: width 0.2s, opacity 0.2s;
      opacity: 1;
      width: 15px;
      background-color: red;
    }

    span {
      font-size: 11px;
      line-height: 1;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      color: #FFF;
    }
  }
} // ipb-popup-item
</style>
