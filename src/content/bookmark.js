import { ref } from 'vue'
import {mainContent, chapterDoms} from './page'
import { saveBookmark } from './store'

const paraEventRef = {}
const onBookmark = bookmarkInProgress => {
  chapterDoms.forEach(ch => {
    const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
    if (!paraEventRef[chIndex]) paraEventRef[chIndex] = {}
    ch.querySelectorAll('[role=article] > p').forEach((pElem, j) => {
      if (!paraEventRef[chIndex][j]) paraEventRef[chIndex][j] = () => {
        console.log(pElem.innerHTML)
        saveBookmark(chIndex, j, pElem)
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
