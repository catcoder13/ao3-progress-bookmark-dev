import {ref, reactive, watch} from 'vue'
import { work, updateBookmarkStore, removeBookmarkStore } from './store'
import { workId, chapterInfos, mainContent } from './static'

const mainBM = reactive({chI: null, perc: null, chID: null, link: null, fwLink: null})

const bmInProgress = ref(false)

watch(() => work.value,
newWork => {
  if (!newWork) {
    mainBM.chI = null
  } else {
    const {chI, perc, chID} = newWork
    mainBM.chI = chI
    mainBM.perc = perc
    mainBM.chID = chID
    mainBM.link = `/works/${workId}/chapters/${chID}#chapter-${parseInt(chI) + 1}`
    mainBM.fwLink = `/works/${workId}?view_full_work=true#chapter-${parseInt(chI) + 1}`
  }
  
})

const updateBookmark = (chI, perc) => {
  updateBookmarkStore(chI, perc, chapterInfos[chI].chID, chapterInfos[chI].title)
  mainBM.chI = chI
  mainBM.perc = perc
  mainBM.chID = chapterInfos[chI].chID
  mainBM.link = `/works/${workId}/chapters/${chapterInfos[chI].chID}#chapter-${parseInt(chI) + 1}`
  mainBM.fwLink = `/works/${workId}?view_full_work=true#chapter-${parseInt(chI) + 1}`
}

const removeBookmark = () => {
  mainBM.chI = null
  removeBookmarkStore() // delete store record
}

const onBookmarkEnd = () => {
  console.log('on bookmark end')
  mainContent.classList.toggle('bmInProgress', false)
  bmInProgress.value = false
}

const toggleBookmarkEdit = chapters => {
  bmInProgress.value = !bmInProgress.value
  mainContent.classList.toggle('bmInProgress', bmInProgress.value)

  const bmAreaTop = chapters[Object.keys(chapters)[0]].dom.getBoundingClientRect().y
  console.log('bmAreaTop', bmAreaTop)
  if (bmAreaTop > window.innerHeight / 2) {
    window.scrollTo({ top: window.scrollY + bmAreaTop - window.innerHeight / 2, behavior: 'smooth' })
  }
  
}

export {
  mainBM, bmInProgress,
  toggleBookmarkEdit, updateBookmark, removeBookmark, onBookmarkEnd
}
