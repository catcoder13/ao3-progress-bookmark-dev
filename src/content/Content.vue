<template v-if="chapters">
  <div :class="{'ipb-left': !settings.alignRight}">
    <IpbSidebar v-if="!bmInProgress"></IpbSidebar>
    <IpbEditor v-else :chapters="chapters"></IpbEditor>
    
    <IpbBookmark v-if="canShowBookmark" :chapters="chapters"></IpbBookmark>

    <IpbNavbar v-if="settings.progressBar"></IpbNavbar>
  </div>
</template>

<script>
import '@/common/__base.scss'

import {ref, computed} from 'vue'
import {chapters, curChI} from './js/page'
import { mainBM, bmInProgress } from './js/bookmark'
import { fullViewMode, mainContent } from './js/static'
import { settings } from './js/setting'

import IpbBookmark from './components/IpbBookmark.vue'
import IpbEditor from './components/IpbEditor.vue'
import IpbNavbar from './components/IpbNavbar.vue'
import IpbSidebar from './components/IpbSidebar.vue'

export default {
  name: 'App',
  components: { IpbNavbar, IpbSidebar, IpbEditor, IpbBookmark },
  setup () {
    const canShowBookmark = computed(() => {
      if (!mainBM.chI) return false
      if (fullViewMode) return true

      return mainBM.chI == curChI.value
    })

    return {
      chapters,
      bmInProgress, canShowBookmark, mainContent,
      settings
    }
  }
}
</script>

<style lang="scss">
#workskin {
  &.bmInProgress #chapters > .chapter,
  &.bmInProgress.oneshot #chapters {
    background-color: rgba(#aaaaaa, 0.3);
  }
}
</style>
