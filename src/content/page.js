import {reactive, ref} from 'vue'
import {workMode, chapterId} from './work'

const mainContent = document.querySelector('#workskin')
const chapterDoms = mainContent.querySelectorAll('#chapters > .chapter')
console.log('chapter length', chapterDoms.length)

let chapters = null
const chaptersRef = {}
const curChI = ref(0)

if (chapterDoms.length) { // multi chapter
  curChI.value = parseInt(chapterDoms[0].getAttribute('id').split('chapter-')[1]) - 1
} else { // one shot
  chaptersRef[0] = reactive({
    middle: -1, height: 0, progress: 0, id: chapterId,
    title: mainContent.querySelector('.title').innerText,
    dom: mainContent.querySelector('#chapters')
  })
}

chapterDoms.forEach(ch => {
  const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
  const chID = ch.querySelector('.title a').getAttribute('href').match(/\/works\/(\d+)(?:\/chapters\/(\d+))?/)[2]
  console.log('chapter id', chID, chIndex)
  chaptersRef[chIndex] = reactive({
    middle: -1, height: 0, progress: 0, id: chapterId,
    title: ch.querySelector('.title').innerHTML.replace(/<a[^>]*>(.*?)<\/a>(?:\s*:\s*)?(.*)/, '$2').trim(),
    dom: ch
  })
  
})

chapters = chaptersRef
console.log('chapters', chapters)

const onScroll = () => {
  const scrollBottom = window.scrollY + window.innerHeight
  let curChInView = chapterDoms.length > 0 ? curChI.value : 0
  if (workMode) {
    curChInView = Object.keys(chapters).filter(chI => chapters[chI].middle < scrollBottom).length
    curChInView = curChInView < 2 ? 0 : curChInView - 1
    Object.keys(chapters).forEach(chI => {
      if (chI < curChInView) chapters[chI].progress = 100
      else if (chI > curChInView) chapters[chI].progress = 0
    })
  }

  curChI.value = curChInView

  chapters[curChI.value].progress = (Math.min(1, Math.max(0, (scrollBottom - chapters[curChI.value].middle) / chapters[curChI.value].height)) * 100).toFixed(0)
}

const onResize = () => {
  Object.keys(chapters).forEach(chIndex => {
    const {height, top} = chapters[chIndex].dom.getBoundingClientRect()
    chapters[chIndex].middle = window.scrollY + top + window.innerHeight / 2
    chapters[chIndex].height = height
  })
  onScroll()
}

window.addEventListener('scroll', onScroll)
window.addEventListener('resize', onResize)

onResize()



export {mainContent, chapters, curChI}
