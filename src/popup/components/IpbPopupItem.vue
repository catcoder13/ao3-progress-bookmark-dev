<template>
  <div class="ipb-popup-item ipb-popup-item--small">
    <div class="ipb-info">
      <h3>{{ work.name }} </h3>
        <span v-if="!selection || selection.type !== 'author'" class="ipb-author">by <a @click="() => selectAuthor(work.author)">{{ work.author }}</a></span>
        <span class="ipb-popup__item__datetime"><IpbIcon type="clock" fill="#555"/>{{ (new Date(work.t)).toLocaleString() }}</span>
    </div>

    <div class="ipb-record">
      <div class="ipb-record-content">
        <p>
          <button v-if="work.oneShot" :title="`One-shot: ${work.name}`" @click="() => visitURL(`/works/${work.id}?jumptobm`)">
            <IpbIcon type="bookmark" fill="#555" />One-shot</button>
          <button v-else :title="`Chapter ${parseInt(work.chI) + 1}${work.chTitle ? `: ${work.chTitle}` : ''}`" @click="() => visitURL(`/works/${work.id}/chapters/${work.chID}#chapter-${parseInt(work.chI) + 1}?jumptobm`)">
            <IpbIcon type="bookmark" fill="#555" />Chapter {{parseInt(work.chI) + 1}}</button>
        </p>
        <p>
          <IpbIcon type="location" fill="#555" /><b>{{ (work.perc * 100).toFixed(2) }}%</b>
      </p> 
      </div>
    </div>

    <div title="Delete this bookmark" class="ipb-close-btn" @click="() => removeWork(work.id)">
      <span >&#10006;</span>
    </div>
  </div>
</template>

<script>
import { removeWork, visitURL } from '../js/works'
import { settings } from '../js/setting'
import { selectAuthor, selection } from '../js/search'
import IpbIcon from '@/common/IpbIcon.vue'


export default {
  props: ['work'],
  components: {IpbIcon},
  setup () {
    return { removeWork, visitURL, settings, selectAuthor, selection } 
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
  
  .ipb-info {
    padding: 8px;
    width: calc(100% - 135px);

    h3 {
      font-family: Georgia, serif;
      font-size: 16px;
      line-height: 1.2;
    }

    p { margin: 10px 0 5px; }

    .ipb-author { font-size: 11px; }

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
        font-size: 12px;
        line-height: 1;
      }
      
    }
  } // ipb-record

  .ipb-close-btn {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0;
    height: 100%;
    width: 13px;
    background-color: red;
    opacity: 0.3;
    transition: opacity 0.2s;
    cursor: pointer;

    &:hover {
      opacity: 1;
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
