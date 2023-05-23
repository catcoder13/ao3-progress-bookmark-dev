<template>
  <div class="ipb-popup-item">
    <div class="ipb-info">
      <h3>{{ work.workName }}</h3>
      <span v-if="!hideAuthor" class="ipb-author">by <a @click="() => visitURL(work.authorLink)">{{ work.authorName }}</a></span>
      <p>Visit bookmarked page via:</p>
      <div class="ipb-btn">
        <button v-if="work.isOneShot" @click="() => visitURL(`/works/${work.workID}`)">Entire work</button>
        <template v-else>
          <button @click="() => visitURL(`/works/${work.workID}?view_full_work=true#chapter-${parseInt(work.chI) + 1}`)">Entire work</button>
          <button @click="() => visitURL(`/works/${work.workID}/chapters/${work.chID}#chapter-${parseInt(work.chI) + 1}`)">Chapter by chapter</button>
        </template>
      </div>

      <span class="ipb-popup__item__datetime">Bookmarked at {{ (new Date(work.t)).toLocaleString() }}</span>
    </div>

    <div class="ipb-record">
      <div class="ipb-record-content">
          <IpbIcon type="bookmark"></IpbIcon>
          <p>Bookmarked at 
            <b class="ipb-perc">{{ (work.perc * 100).toFixed(2) }}%</b> of 
            <b v-if="work.isOneShot" :title="`One Shot: ${work.workName}`">{{work.workName}}</b>
            <b v-else :title="`Chapter ${parseInt(work.chI) + 1}${work.chTitle ? `: ${work.chTitle}` : ''}`">
              {{`Chapter ${parseInt(work.chI) + 1}`}}
            </b>
          </p>
      </div>
      
    </div>

    <span title="Delete this bookmark" class="ipb-close-btn" @click="() => removeWork(work.workID)">&#10006;</span>

  </div>
</template>

<script>
import {removeWork} from './works'
import IpbIcon from '@/content/components/IpbIcon.vue'

const AO3_DOMAIN = "https://archiveofourown.org"

export default {
  props: ['work', 'hideAuthor'],
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

    return {
      removeWork, visitURL
    } 
  }
}
</script>

<style lang="scss">
.ipb-popup-item {
  position: relative;
  background-color: #eee;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 0 3px #999;

  .ipb-info {
    padding-right: 120px;

    h3 {
      font-family: Georgia, serif;
      font-size: 18px;
      line-height: 20px;
      font-weight: normal;
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
    }
  } // ipb-info

  .ipb-record {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 115px;
    background-color: #ccc;

    .ipb-record-content {
      position: absolute;
      top: calc(50% + 5px);
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: right;
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;

      p {
        font-size: 13px;
        line-height: 16px;
      }

      .ipb-icon {
        display: inline-block;
        width: 15px;
        height: 15px;
        vertical-align: bottom;
      }

      b.ipb-perc {
        font-size: 18px;
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