<template>
  <div class="ipb-popup-item" :class="{'ipb-popup-item--compact': settingsPopup.compact}">
    <div class="ipb-info">
      <h3>
        <span>{{ work.name }}</span>
        <span v-if="settingsPopup.compact" class="ipb-datetime" :title="`Bookmark created/updated at ${time}`">&#x1F550;</span>
      </h3>
      <span v-if="!selection || selection.type !== 'author'" class="ipb-author" :title="`Click to search bookmarked works by ${work.author}`">by <a @click="() => selectAuthor(work.author)">{{ work.author }}</a></span>
      <span v-if="!settingsPopup.compact" class="ipb-popup__item__datetime" :title="`Bookmark created/updated at ${time}`">&#x1F550;{{time}}</span>
    </div>

    <div class="ipb-record">
      <div class="ipb-record-content">
        <button :title="btnTitle" @click="onBtnClick">
          <!-- <b>{{work.oneShot ? 'One-shot' : `Chapter ${parseInt(work.chI) + 1}`}}<br/></b> -->
          <b v-if="!settingsPopup.compact">{{work.oneShot ? 'One-shot' : `Chapter ${parseInt(work.chI) + 1}`}}<br/></b>
          <span class="ipb-chapter-num" v-else-if="!work.oneShot">{{ parseInt(work.chI) + 1 }}</span>
          <p><span>{{ percStr }}</span><IpbIcon type="location" fill="#555" /></p>
        </button>
      </div>
    </div>

    <div title="Remove this bookmark" class="ipb-close-btn" @click="() => removeWork(work.id)">
      <span >&#10006;</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { removeWork, visitURL } from '../js/works'
import { settings, settingsPopup } from '../js/setting'
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
        return `Visit one-shot (${percStr.value})`
      }

      return `Visit chapter ${parseInt(p.work.chI) + 1}${p.work.chTitle ? `: ${p.work.chTitle}` : ''} (${percStr.value})`
    })
    return { percStr, btnTitle, time, removeWork, onBtnClick, settings, settingsPopup, selectAuthor, selection } 
  }
}
</script>

<style lang="scss">
.ipb-popup-item.ipb-popup-item--compact {
  .ipb-info {
    h3 { font-size: 14px; }
    .ipb-author a { font-size: 10px; }
  }

  .ipb-record .ipb-record-content button {
    padding: 4px 8px;

    .ipb-chapter-num {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      padding: 2px 4px 2px 5px;
      box-sizing: border-box;
      background-color: grey;
      color: #FFF;
      font-size: 11px;
      font-weight: bold;
      line-height: 20px;
      min-width: 23px;
    }

    p { text-align: right; }
  }
}

.ipb-popup-item {
  position: relative;
  background-color: #eee;
  margin-bottom: 7px;
  box-shadow: 0 0 3px #999;

  & > * { box-sizing: border-box; }
  
  &:hover .ipb-close-btn { display: block; }
  
  .ipb-info {
    padding: 8px;
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
        }
      }
    }

    p { margin: 10px 0 5px; }

    .ipb-author {
      font-size: 11px;
      word-wrap: break-word;
      padding-left: 2px;
    }

    .ipb-popup__item__datetime {
      display: block;
      font-size: 11px;
      line-height: 1;
      padding: 2px 0;
      color: #555;
      margin-top: 10px;
      opacity: 0.8;

      & > * { vertical-align: text-bottom; }

      .ipb-icon {
        padding-right: 5px;
        vertical-align: bottom;
        width: 13px;
        height: 13px;
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

      font-size: 12px;
      line-height: 1;
      color: #555;

      button {
        padding: 22px 8px 4px;
        margin: 4px 0;
        cursor: pointer;
        border-radius: 12px;
        border: 1px solid #888;
        width: 110px;
        box-sizing: border-box;
        overflow: hidden;

        b {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background-color: grey;
          padding: 4px 2px;
          box-sizing: border-box;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 13px;
          line-height: 1;
          overflow: hidden;
          color: #FFF;
        }

        span {
          font-size: 12px;
        }

        &:hover { filter: brightness(0.9); }
        &:active { filter: brightness(0.95); }
      }
    }
  } // ipb-record

  .ipb-close-btn {
    display: none;
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

    &:hover {
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
