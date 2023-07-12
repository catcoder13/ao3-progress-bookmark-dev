<template>
  <div class="ipb-file-summary">
    <h2>Import summary</h2>
    <div v-if="!summaries.workCount">
      <span>No bookmark data found in this file!</span>
    </div>
    <div v-else-if="summaries.workCount > BOOKMARK_LIMIT">
      <span>Bookmark data exceeds limit! (Limit: {{ BOOKMARK_LIMIT }}, bookmark data in file: {{ summaries.workCount }})</span>
    </div>
    <div v-else class="ipb-file-summary__content">
      <h4>Total work(s) from file: {{ summaries.workCount }}</h4>
      <div class="ipb-author-work">
        <h4>Authors</h4>
        <div class="" v-for="(authorWorkCount, authorName) in summaries.authors" :key=authorName>
          <IpbIcon type="author" fill="#999" />
          <span>{{ authorName }}: {{ authorWorkCount }} work{{ authorWorkCount > 1 ? 's' : ''}}</span>
        </div>
      </div>
      <div class="ipb-remark">
        <b>Note: All existing bookmarks will be removed before importing the above bookmark records!</b>!
      </div>
    </div>
    
    <div class="ipb-button">
      <button :class="{'ipb-disable': !summaries.workCount || summaries.workCount > BOOKMARK_LIMIT }" @click="onConfirmImport">Confirm import</button>
      <button @click="onCancel">Cancel</button>
    </div>
  </div>
</template>

<script>
import { onUnmounted, reactive } from 'vue'
import { importData } from '../js/data'
import { STORE_ALL_WORK_KEYS, STORE_WORK_KEY_PREFIX, BOOKMARK_LIMIT } from '@/common/variables'
import IpbIcon from '@/common/IpbIcon.vue'
export default {
    props: ["file"],
    emits: ['complete', 'cancel'],
    components: { IpbIcon },
    setup(p, { emit }) {
        const reader = new FileReader()
        const summaries = reactive({ workCount: 0, authors: {} })
        let resultObj = {}
        const onFileRead = () => {
          try {
            resultObj = JSON.parse(reader.result)
            const { [STORE_ALL_WORK_KEYS]: workIDs } = resultObj
            
            summaries.workCount = workIDs.length
            summaries.authors = workIDs.reduce((acc, workID) => {
                const { author } = resultObj[STORE_WORK_KEY_PREFIX + workID]
                if (!acc[author]) acc[author] = 0
                acc[author]++
                return acc
            }, {})
          } catch (e) {
            console.warn('[AO3 IPB] Error occurs when parsing the imported bookmark data')
          }
            
        }
        reader.addEventListener("load", onFileRead)
        reader.readAsText(p.file)
        onUnmounted(() => {
            reader.removeEventListener("load", onFileRead)
        });
        const onConfirmImport = () => {
          if (!summaries.workCount || summaries.workCount > BOOKMARK_LIMIT) return
          importData(resultObj)
          emit('complete')
        };
        const onCancel = () => emit("cancel")


        return { summaries, onConfirmImport, onCancel, BOOKMARK_LIMIT }
    }
}
</script>

<style lang="scss">
.ipb-setting .ipb-file-summary {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  color: #FFF;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  // & > * { margin-bottom: 10px; }

  h3 {
    font-size: 18px;
  }
  span {
    font-size: 13px;
    line-height: 1;
  }

  .ipb-file-summary__content {
    & > *:not(:last-child) { padding-bottom: 5px; }

    .ipb-author-work {
      max-height: 110px;
      overflow-y: overlay;
      background-color: #333;

      & > div:not(:last-child) { padding-bottom: 2px; }
    }
  }

  

  .ipb-remark {
    font-size: 13px;
    color: red;
  }

  .ipb-button {
    button.ipb-disable {
      opacity: 0.5;
      cursor: not-allowed;

      &:hover { filter: brightness(1); }
    }
  }
}
</style>
