<template>
  <template v-if="settings.compact">
    <IpbPopupItemSmall :work="work" :hideAuthor="hideAuthor" />
  </template>
  <template v-else>
    <div class="ipb-popup-item">
      <div class="ipb-info">
        <h3>{{ work.workName }}</h3>
        <span v-if="!hideAuthor">by <a @click="() => visitURL(work.authorLink)">{{ work.authorName }}</a></span>
        <p>Visit bookmarked page via:</p>
        <div class="ipb-btn">
          <button :title="`One-shot: ${work.workName}`" v-if="work.isOneShot" @click="() => visitURL(`/works/${work.workID}`)">Entire work</button>
        <template v-else>
          <button :title="`Chapter ${parseInt(work.chI) + 1}${work.chTitle ? `: ${work.chTitle}` : ''}`" @click="() => visitURL(`/works/${work.workID}?view_full_work=true#chapter-${parseInt(work.chI) + 1}`)">Entire work</button>
          <button :title="`Chapter ${parseInt(work.chI) + 1}${work.chTitle ? `: ${work.chTitle}` : ''}`" @click="() => visitURL(`/works/${work.workID}/chapters/${work.chID}#chapter-${parseInt(work.chI) + 1}`)">Chapter {{parseInt(work.chI) + 1}}</button>
        </template>
        </div>

        <span class="ipb-popup__item__datetime"><IpbIcon type="clock" fill="#555"/>Bookmarked at {{ (new Date(work.t)).toLocaleString() }}</span>
      </div>

      <div class="ipb-record">
        <div class="ipb-record-content">
            
            <p v-if="!work.isOneShot">
              <IpbIcon type="bookmark" fill="#555"></IpbIcon>Bookmarked at<br />
              <b>{{`Chapter ${parseInt(work.chI) + 1}`}}</b>
            </p>
            <p v-else>
              <IpbIcon type="bookmark" fill="#555"></IpbIcon>
              <b>One-shot</b></p>
              <p>
                <IpbIcon type="location" fill="#555"></IpbIcon>Progress<br />
                <b class="ipb-perc">{{ (work.perc * 100).toFixed(2) }}%</b>
            </p>
            
        </div>
      </div>

      <span title="Delete this bookmark" class="ipb-close-btn" @click="() => removeWork(work.workID)">&#10006;</span>

    </div>

  </template>
  
</template>

<script>
import { removeWork, visitURL } from '@/popup/works'
import { settings } from '../setting'
import IpbIcon from '@/common/IpbIcon.vue'
import IpbPopupItemSmall from './IpbPopupItemSmall.vue'


export default {
  props: ['work', 'hideAuthor'],
  components: {IpbIcon, IpbPopupItemSmall},
  setup () {
    return { removeWork, visitURL, settings } 
  }
}
</script>

<style lang="scss">
.ipb-popup-item {
  position: relative;
  background-color: #eee;
  padding: 10px;
  margin-bottom: 15px;
  box-shadow: 0 0 3px #999;

  .ipb-info {
    padding-right: 120px;

    h3 {
      font-family: Georgia, serif;
      font-size: 18px;
      line-height: 1;
      min-width: 150px;
    }

    // .ipb-author {
    //   a {
    //     color: #166fce;
    //     text-decoration: none;
    //     border-bottom: 1px dashed #166fce;
    //     cursor: pointer;

    //     &:hover { border-bottom: 1px solid #166fce; }
    //   }
    // }

    p {
      margin: 10px 0 5px;
    }

    .ipb-btn {
      display: flex;

      button {
        border: 1px solid #bbb;
        border-bottom: 1px solid #aaa;
        border-radius: 0.25em;
        background: linear-gradient(#fff 2%,#ddd 95%,#bbb 100%);;
        margin-right: 5px;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
        padding: 5px 10px;

        &:hover {filter: brightness(0.95)};
      }
    }

    .ipb-popup__item__datetime {
      font-size: 11px;
      line-height: 1;
      display: inline-block;
      padding: 2px;
      color: #555;
      margin-top: 10px;
      opacity: 0.8;

      .ipb-icon {
        display: inline-block;
        width: 13px;
        height: 13px;
        padding-right: 5px;
        vertical-align: bottom;
      }
    }
  } // ipb-info

  .ipb-record {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 120px;
    background-color: #ccc;

    .ipb-record-content {
      position: absolute;
      top: calc(50% + 5px);
      left: 50%;
      transform: translate(-50%, -50%);
      // text-align: right;
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;

      p {
        font-size: 12px;
        line-height: 1;
        color: #555;
        &:not(:last-child) { margin-bottom: 15px; }
      }

      .ipb-icon {
        display: inline-block;
        width: 15px;
        height: 15px;
        vertical-align: bottom;
      }

      b {
        color: #444;
        font-size: 14px;
      }

      b.ipb-perc {
        font-size: 20px;
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
}
</style>