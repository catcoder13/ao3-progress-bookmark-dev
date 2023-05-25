<template>
  <div class="ipb-popup-item ipb-popup-item--small">
    <div class="ipb-info">
      <h3>{{ work.workName }} 
        <span v-if="!hideAuthor" class="ipb-author" :title="work.authorName" @click="() => visitURL(work.authorLink)"><IpbIcon type="author" fill="#166fce"/></span>
        <span :title="`Bookmarked at ${(new Date(work.t)).toLocaleString()}`"><IpbIcon type="clock" fill="#555"/></span>
      </h3>
      <div class="ipb-btn">
        <button :title="`One-shot: ${work.workName}`" v-if="work.isOneShot" @click="() => visitURL(`/works/${work.workID}`)">Entire work</button>
        <template v-else>
          <button :title="`Chapter ${parseInt(work.chI) + 1}${work.chTitle ? `: ${work.chTitle}` : ''}`" @click="() => visitURL(`/works/${work.workID}?view_full_work=true#chapter-${parseInt(work.chI) + 1}`)">Entire work</button>
          <button :title="`Chapter ${parseInt(work.chI) + 1}${work.chTitle ? `: ${work.chTitle}` : ''}`" @click="() => visitURL(`/works/${work.workID}/chapters/${work.chID}#chapter-${parseInt(work.chI) + 1}`)">Chapter {{parseInt(work.chI) + 1}}</button>
        </template>
      </div>
    </div>

    <div class="ipb-record">
      <div class="ipb-record-content">
        <b v-if="work.isOneShot"><IpbIcon type="bookmark" fill="#555" />One-shot</b>
        <b v-else>
          <IpbIcon type="bookmark" fill="#555" />
          {{`Chapter ${parseInt(work.chI) + 1}`}}
        </b>
        
        <b class="ipb-perc"><IpbIcon type="location" fill="#555" />{{ (work.perc * 100).toFixed(2) }}%</b>
      </div>
    </div>

    <span title="Delete this bookmark" class="ipb-close-btn" @click="() => removeWork(work.workID)">&#10006;</span>

  </div>
</template>

<script>
import {removeWork, visitURL } from '@/popup/works'
import IpbIcon from '@/common/IpbIcon.vue'

export default {
  props: ['work', 'hideAuthor'],
  components: { IpbIcon },
  setup () {

    return { removeWork, visitURL } 
  }
}
</script>

<style lang="scss">
.ipb-popup-item.ipb-popup-item--small {
  .ipb-info {
    h3 {
      font-size: 16px;
      margin-bottom: 10px;

      span {
        padding-right: 5px;

        &.ipb-author {
          cursor: pointer;
          opacity: 0.7;

          &:hover { opacity: 1; }
        }

        .ipb-icon {
          display: inline-block;
          width: 13px;
          height: 13px;
        }
      }
    }
  }

  .ipb-record {
    .ipb-record-content {
      b {
        display: block;
        line-height: 1;
        font-size: 12px;

        &.ipb-perc { font-size: 17px; }

        &:not(:last-child) { margin-bottom: 5px; }
      }
    }
  }
}
</style>