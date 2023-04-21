// initialise html entry
const ao3AssistDom = document.createElement('div')
ao3AssistDom.classList.add(['ao3-read-assist'])
ao3AssistDom.innerHTML = `
  <div class="progress-visual">
    <div class="circle"></div>
    <span></span>
  </div>
  <button class="ao3-read-assist-bookmark">start bookmark</button>
`
document.querySelector('body').appendChild(ao3AssistDom)

// identify work type, pageMode = 0: chapter by chapter, 1: full work
const urlParams = (new URLSearchParams(window.location.search)).get('view_full_work')
let pageMode = (urlParams && urlParams.toLowerCase() === 'true') ? 1 : 0
// console.log(pageMode)

// get localstorage data
const localStore = JSON.parse(localStorage.getItem("ao3ReadAssistObj")) || {
  bookmarks: {}, // work's id -> chapter id -> para id
}

const addBookmark = (workID, ch, pID) => {

}
console.log('localStore', localStore)

const progressHTML = ao3AssistDom.querySelector('.circle')
const bookmarkBtn = ao3AssistDom.querySelector('.ao3-read-assist-bookmark')
const mainContent = document.querySelector('#workskin')
const chapterDoms = mainContent.querySelectorAll('#chapters > .chapter')

let bookmarkInProgress = false

const chProgress = {}
chapterDoms.forEach(ch => {
  const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
  chProgress[chIndex] = { top: -1, height: 0, progress: 0 }
})


const onScroll = () => {
  // progressHTML.innerHTML = (Math.min(1, Math.max(0, (window.scrollY - mcDim.top + window.innerHeight) / mcDim.height)) * 100).toFixed(0) + "%"
  const scrollBottom = window.scrollY + window.innerHeight

  let curChI = Object.keys(chProgress).filter(chI => chProgress[chI].top < scrollBottom).length
  curChI = curChI < 2 ? 0 : curChI - 1
  Object.keys(chProgress).forEach(chI => {
    if (chI < curChI) chProgress[chI].progress = 100
    else if (chI > curChI) chProgress[chI].progress = 0
    else chProgress[chI].progress = (Math.min(1, Math.max(0, (scrollBottom - chProgress[chI].top) / chProgress[chI].height)) * 100).toFixed(0)
    
    console.log(chI, chProgress[chI].progress)
  })
}

const onResize = () => {
  // update each chapter progress, height and start position
  chapterDoms.forEach(ch => {
    const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
    const {height, top} = ch.getBoundingClientRect()
    chProgress[chIndex] = {
      top: window.scrollY + top,
      height: height
    }
  
  })
  onScroll()
}

const paraEventRef = {}

const onBookmark = bookmarkInProgress => {
  chapterDoms.forEach(ch => {
    const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
    if (!paraEventRef[chIndex]) paraEventRef[chIndex] = {}
    ch.querySelectorAll('[role=article] > p').forEach((pElem, j) => {
      if (!paraEventRef[chIndex][j]) paraEventRef[chIndex][j] = () => {
        console.log(pElem.innerHTML)
        console.log('ch', chIndex, 'p', j)
      }

      if (bookmarkInProgress) pElem.addEventListener('click', paraEventRef[chIndex][j])
      else pElem.removeEventListener('click', paraEventRef[chIndex][j])
      
    })
  })
}

const toggleBookmark = () => {
  bookmarkInProgress = !bookmarkInProgress
  bookmarkBtn.innerHTML = bookmarkInProgress ? 'stop bookmark' : 'start bookmark'
  mainContent.classList.toggle('bookmarkInProgress', bookmarkInProgress)
  onBookmark(bookmarkInProgress)
}



const onParaClick = (arg0, arg1, arg2) => {
  console.log('click para ', arg0, arg1, arg2)
}

window.addEventListener('scroll', onScroll)
window.addEventListener('resize', onResize)
bookmarkBtn.addEventListener('click', toggleBookmark)

onResize()
onScroll()

// const onMainContentMouseOver = e => {
//   // console.log(e)
// }

// mainContent.addEventListener('mouseover', onMainContentMouseOver)



