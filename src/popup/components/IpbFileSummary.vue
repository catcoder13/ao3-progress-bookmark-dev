<template>
  <div class="ipb-file-summary">
    <h2>Import summary</h2>
    <div class="ipb-file-summary__content">
      <h3>Total work(s) from file: {{ summaries.workCount }}</h3>
      <div class="ipb-author-work ipb-style-scrollbar">
        <h3>Authors</h3>
        <div class="" v-for="(authorWorkCount, authorName) in summaries.authors" :key=authorName>
          <IpbIcon type="author" fill="#999" />
          <span>{{ authorName }}: {{ authorWorkCount }} work{{ authorWorkCount > 1 ? 's' : ''}}</span>
        </div>
      </div>
    </div>
    <div class="ipb-remark">
      Note: existing <b>matched</b> bookmark will be overwritten.<br />
      However, any existing bookmark that does not match the imported data will not be deleted.
    </div>
    <div class="ipb-button">
      <button @click="onImport">Confirm import</button>
      <button @click="onCancel">Cancel</button>
    </div>
  </div>
</template>

<script>
import { onUnmounted, reactive } from 'vue'
import { importData } from '../js/data'
import { STORE_ALL_WORK_KEYS, STORE_SETTING_KEY, STORE_SETTING_EXTRA_BTN_KEY, STORE_WORK_KEY_PREFIX } from '@/common/variables'
import IpbIcon from '@/common/IpbIcon.vue'
export default {
    props: ["file"],
    emits: ['complete', 'cancel'],
    setup(p, { emit }) {
        const reader = new FileReader()
        const summaries = reactive({ workCount: 0, authors: {} })
        let resultObj = {}
        const onFileRead = () => {
            resultObj = JSON.parse(reader.result)
            const { [STORE_ALL_WORK_KEYS]: workIDs, [STORE_SETTING_KEY]: mainSettings, [STORE_SETTING_EXTRA_BTN_KEY]: extraBtnSettings } = resultObj
            console.log('to import ', resultObj)
            summaries.workCount = workIDs.length
            summaries.authors = workIDs.reduce((acc, workID) => {
                const { author } = resultObj[STORE_WORK_KEY_PREFIX + workID]
                if (!acc[author]) acc[author] = 0
                acc[author]++
                return acc
            }, {})
        }
        reader.addEventListener("load", onFileRead)
        reader.readAsText(p.file)
        onUnmounted(() => {
            reader.removeEventListener("load", onFileRead)
        });
        const onImport = () => {
            importData(resultObj)
            emit('complete')
        };
        const onCancel = () => emit("cancel")
        return { summaries, onImport, onCancel }
    },
    components: { IpbIcon }
}
</script>

<style lang="scss">
.ipb-file-summary {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  color: #FFF;

  & > * { margin-bottom: 10px; }

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
    opacity: 0.7;
    font-size: 13px;
  }

  .ipb-button {
  }
}
</style>
