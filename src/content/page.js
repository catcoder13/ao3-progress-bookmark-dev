import {reactive, ref} from 'vue'
import {workMode} from './work'

const mainContent = document.querySelector('#workskin')
const chapterDoms = mainContent.querySelectorAll('#chapters > .chapter')

const chapters = reactive({})
const curChI = ref(parseInt(mainContent.querySelector(".chapter").getAttribute('id').split('chapter-')[1]) - 1)

chapterDoms.forEach(ch => {
  const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
  const chID = ch.querySelector('.title a').getAttribute('href').match(/\/works\/(\d+)(?:\/chapters\/(\d+))?/)[2]
  console.log('chapter id', chID)
  chapters[chIndex] = {
    middle: -1,
    height: 0,
    progress: 0,
    id: chID,
    title: ch.querySelector('.title').innerHTML.replace(/<a[^>]*>(.*?)<\/a>(?:\s*:\s*)?(.*)/, '$2').trim()
  }
})

const onScroll = () => {
  const scrollBottom = window.scrollY + window.innerHeight
  if (workMode) {
    curChI.value = Object.keys(chapters).filter(chI => chapters[chI].middle < scrollBottom).length
    curChI.value = curChI.value < 2 ? 0 : curChI.value - 1
    Object.keys(chapters).forEach(chI => {
      if (chI < curChI.value) chapters[chI].progress = 100
      else if (chI > curChI.value) chapters[chI].progress = 0
    })
  }

  chapters[curChI.value].progress = (Math.min(1, Math.max(0, (scrollBottom - chapters[curChI.value].middle) / chapters[curChI.value].height)) * 100).toFixed(0)
  // // console.log(curChI.value, chProgress[curChI.value].progress)
}

const onResize = () => {
  // update each chapter progress, height and start position
  chapterDoms.forEach(ch => {
    const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
    const {height, top} = ch.getBoundingClientRect()
    chapters[chIndex].middle = window.scrollY + top + window.innerHeight / 2
    chapters[chIndex].height = height
  })

  onScroll()
}

window.addEventListener('scroll', onScroll)
window.addEventListener('resize', onResize)

onResize()




export {mainContent, chapterDoms, chapters, curChI}
