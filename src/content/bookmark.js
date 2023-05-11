import { fullViewMode, mainContent } from './static'
import { updatePercKeyValue, removePercKeyValue } from './store'


const createPercBMElem = (chapters, chI, bmID, bmPerc) => {
  // update local record
  chapters[chI].percBM.push({id: bmID, perc: bmPerc})
  chapters[chI].percBMCount++

  const bmPercVal = bmPerc * 100
  const percBMElem = document.createElement('div')
  percBMElem.classList.add('perc-bm')
  percBMElem.style.top = bmPercVal + '%'

  percBMElem.innerHTML = `
    <span class='perc-bm__desc'>Chapter ${parseInt(chI) + 1} | ${bmPercVal.toFixed(2)}%</span>
    <span class='remove'>Remove</span>`

  const onDelete = () => {
    chapters[chI].percBM = chapters[chI].percBM.filter(({id}) => id !== bmID) // delete local perc bm record
    removePercKeyValue(chI, bmID) // delete store record
    percBMElem.querySelector('.remove').removeEventListener('click', onDelete)
    percBMElem.remove()
  }
  percBMElem.querySelector('.remove').addEventListener('click', onDelete)

  return percBMElem
}

// const createParaBMElem = (chapters, chI, paraElems, paraIndex) => {
//   if (!paraElems[[paraIndex]]) console.log(`chapter ${parseInt(chI) + 1} paragraph ${paraIndex} does not exist.`)
//   else {
//     chapters[chI].paraBM[paraIndex] = 1
//     chapters[chI].paraBMCount++
//     paraElems[paraIndex].classList.add('bookmarked')
//   }
// }

const initBookmark = (work, chapters, curChI) => {
  if (fullViewMode) { // full view
    
    Object.keys(work).forEach(chI => {
      // // init para bm
      // const paras = chapters[chI].dom.querySelectorAll(':scope > .userstuff > p')
      // Object.keys(work[chI].paraBM).forEach(i => {
      //   createParaBMElem(chapters, chI, paras, i)
      // })

      // init perc bm
      work[chI].percBM.forEach(({id, perc}) => {
        chapters[chI].dom.appendChild(createPercBMElem(chapters, chI, id, perc))
      })
    })

  } else { // one chapter/one shot per view
    if (work[curChI.value]) {
      // // init para bm
      // const paras = chapters[curChI.value].dom.querySelectorAll(':scope > .userstuff > p')
      // Object.keys(work[curChI.value].paraBM).forEach(i => {
      //   createParaBMElem(chapters, curChI.value, paras, i)
      // })

      // init perc bm
      work[curChI.value].percBM.forEach(({id, perc}) => {
        chapters[curChI.value].dom.appendChild(createPercBMElem(chapters, curChI.value, id, perc))
      })
    }
  }
}

// const paraEventRef = {}
// const setupParaBookmark = (canBookmark, chapters) => {
//   // setup p tag click event listener's callback: paraEventRef
//   mainContent.classList.toggle('canBookmarkPara', canBookmark)
//   Object.keys(chapters).forEach(chI => {
//     if (!paraEventRef[chI]) paraEventRef[chI] = {}
//     chapters[chI].dom.querySelectorAll(':scope > .userstuff > p').forEach((pElem, j) => {
//       if (!paraEventRef[chI][j]) paraEventRef[chI][j] = () => {
//         console.log(pElem.innerHTML)
//         chapters[chI].paraBM[j] = 1
//         chapters[chI].paraBMCount++
//         pElem.classList.add('bookmarked')
        
//         // update local store
//         updateParaKeyValue(chI, j)
//       }

//       if (canBookmark) pElem.addEventListener('click', paraEventRef[chI][j])
//       else pElem.removeEventListener('click', paraEventRef[chI][j])
      
//     })
//   })
// }

const addPercBookmark = (chapters, chI, perc) => {
  const bmID = (perc * 10000).toFixed(0)

  chapters[chI].dom.appendChild(createPercBMElem(chapters, chI, bmID, perc))
  updatePercKeyValue(chI, bmID, perc)
}

const removePercBookmark = (ch, perc) => {

}

export {initBookmark, addPercBookmark, removePercBookmark}
