import { ref } from 'vue'
import {mainContent, chapters} from './page'
import { workId } from './work'
import { localStore, updateLocalStorage } from './store'

const paraEventRef = {}
const onBookmark = bookmarkInProgress => {
  Object.keys(chapters).forEach(chIndex => {
    if (!paraEventRef[chIndex]) paraEventRef[chIndex] = {}
    chapters[chIndex].dom.querySelectorAll('.userstuff > p').forEach((pElem, j) => {
      if (!paraEventRef[chIndex][j]) paraEventRef[chIndex][j] = () => {
        console.log(pElem.innerHTML)
        
        // update local store
        if (!localStore.bookmarks[workId]) localStore.bookmarks[workId] = {}
        if (!localStore.bookmarks[workId][chIndex]) localStore.bookmarks[workId][chIndex] = {}

        localStore.bookmarks[workId][chIndex][j] = {type: 1}
        updateLocalStorage()
      }

      if (bookmarkInProgress) pElem.addEventListener('click', paraEventRef[chIndex][j])
      else pElem.removeEventListener('click', paraEventRef[chIndex][j])
      
    })
  })
}

const bookmarkInProgress = ref(false)
const toggleBookmark = () => {
  bookmarkInProgress.value = !bookmarkInProgress.value
  mainContent.classList.toggle('bookmarkInProgress', bookmarkInProgress.value)
  onBookmark(bookmarkInProgress.value)
}

export {bookmarkInProgress, toggleBookmark}
