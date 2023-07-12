<template>
  <div class="ipb-popup-item">
    <div class="ipb-info">
      <h3>{{ work.name }} </h3>
        <span v-if="!selection || selection.type !== 'author'" class="ipb-author">by <a @click="() => selectAuthor(work.author)">{{ work.author }}</a></span>
        <span class="ipb-popup__item__datetime"><IpbIcon type="clock" fill="#555"/>{{ (new Date(work.t)).toLocaleString() }}</span>
    </div>

    <div class="ipb-record">
      <div class="ipb-record-content">
        <button v-if="work.oneShot" :title="`Visit one-shot (${percStr})`"
          @click="() => visitURL(`/works/${work.id}?jumptobm`)">
          <b>One-shot</b><br/>
          <IpbIcon type="location" fill="#555" /><span>{{ percStr }}</span>
        </button>
        <button v-else :title="`Visit chapter ${parseInt(work.chI) + 1}${work.chTitle ? `: ${work.chTitle}` : ''} (${percStr})`"
          @click="() => visitURL(`/works/${work.id}/chapters/${work.chID}?jumptobm`)">
          <!-- @click="() => visitURL(`/works/${work.id}/chapters/${work.chID}#chapter-${parseInt(work.chI) + 1}?jumptobm`)"> -->
          <b>Chapter {{parseInt(work.chI) + 1}}</b><br/>
          <IpbIcon type="location" fill="#555" /><span>{{ percStr }}</span>
        </button>
      </div>
    </div>

    <div title="Delete this bookmark" class="ipb-close-btn" @click="() => removeWork(work.id)">
      <span >&#10006;</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { removeWork, visitURL } from '../js/works'
import { settings } from '../js/setting'
import { selectAuthor, selection } from '../js/search'
import IpbIcon from '@/common/IpbIcon.vue'


export default {
  props: ['work'],
  components: {IpbIcon},
  setup (p) {
    const percStr = computed(() => (p.work.perc * 100).toFixed(2) + '%')

    return { percStr, removeWork, visitURL, settings, selectAuthor, selection } 
  }
}
</script>

<style lang="scss">
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
    }

    p { margin: 10px 0 5px; }

    .ipb-author {
      font-size: 11px;
      word-wrap: break-word;
    }

    .ipb-popup__item__datetime {
      display: block;
      font-size: 11px;
      line-height: 1;
      padding: 2px;
      color: #555;
      margin-top: 4px;
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
        padding: 4px 8px;
        margin: 4px 0;
        cursor: pointer;
        border-radius: 12px;
        border: 1px solid #888888;
        width: 110px;
        box-sizing: border-box;

        b {
          display: inline-block;
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 13px;
          line-height: 1;
          overflow: hidden;
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
      color: #FFFFFF;
    }
  }
} // ipb-popup-item
</style>
