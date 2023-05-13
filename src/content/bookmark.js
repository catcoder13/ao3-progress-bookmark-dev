import { fullViewMode } from './static'
import { updatePercKeyValue, removePercKeyValue } from './store'

const initBookmark = (work, chapters, curChI) => {
  if (fullViewMode) { // full view
    Object.keys(work).forEach(chI => {
      work[chI].percBM.forEach(({id, perc}) => {
        chapters[chI].percBM.push({id: id, perc: perc})
      })
    })
  } else { // one chapter/one shot per view
    if (work[curChI]) {
      work[curChI].percBM.forEach(({id, perc}) => {
        chapters[curChI].percBM.push({id: id, perc: perc})
      })
    }
  }
}

const addPercBookmark = (chapters, chI, perc) => {
  const bmID = (perc * 10000).toFixed(0)
  if (chapters[chI].percBM.some(({id}) => id === bmID)) return
  
  chapters[chI].percBM.push({id: bmID, perc: perc})
  updatePercKeyValue(chI, bmID, perc)
}

const removePercBookmark = (chapters, chI, bmID) => {
  chapters[chI].percBM = chapters[chI].percBM.filter(({id}) => id !== bmID) // delete local perc bm record
  removePercKeyValue(chI, bmID) // delete store record
}

const removeAllPercBookmark = chapters => {

}

export {initBookmark, addPercBookmark, removePercBookmark}
