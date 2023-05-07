import { workMode } from './work'
import { updateParaKeyValue, updatePercKeyValue } from './store'

const paraEventRef = {}

const initBookmark = (work, chapters, curChI) => {
  if (workMode) {
    Object.keys(work).forEach(cIndex => {
      const paras = chapters[cIndex].dom.querySelectorAll(':scope > p')
      Object.keys(work[cIndex].paraBM).forEach(i => {
        chapters[cIndex].paraBM[i] = 1
        paras[i].classList.add('bookmarked')
      })
    })
  } else {
    if (work[curChI.value]) {
      const paras = chapters[curChI.value].dom.querySelectorAll(':scope > p')
      Object.keys(work[curChI.value].paraBM).forEach(i => {
        chapters[curChI.value].paraBM[i] = 1
        paras[i].classList.add('bookmarked')
      })
    }
  }
}

const onBookmark = (bookmarkInProgress, chapters) => {
  Object.keys(chapters).forEach(chIndex => {
    if (!paraEventRef[chIndex]) paraEventRef[chIndex] = {}
    chapters[chIndex].dom.querySelectorAll('.userstuff > p').forEach((pElem, j) => {
      if (!paraEventRef[chIndex][j]) paraEventRef[chIndex][j] = () => {
        console.log(pElem.innerHTML)
        chapters[chIndex].paraBM[j] = 1
        pElem.classList.add('bookmarked')
        
        // update local store
        updateParaKeyValue(chIndex, j)
      }

      if (bookmarkInProgress) pElem.addEventListener('click', paraEventRef[chIndex][j])
      else pElem.removeEventListener('click', paraEventRef[chIndex][j])
      
    })
  })
}

export {initBookmark, onBookmark}
