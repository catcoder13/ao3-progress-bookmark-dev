import { reactive, ref } from "vue"

const mainContent = document.querySelector('#workskin')
const chapterDoms = mainContent.querySelectorAll('#chapters > .chapter')

const chProgress = reactive({})
chapterDoms.forEach(ch => {
  const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
  chProgress[chIndex] = {
    // top: -1,
    middle: -1,
    height: 0,
    progress: 0,
    title: ch.querySelector('.title').innerHTML.replace(/<a[^>]*>(.*?)<\/a>(?:\s*:\s*)?(.*)/, '$2').trim()
    // title: ch.querySelector('.title').innerHTML.replace(/<a[^>]*>.*?<\/a>:\s*/g, '').trim()
  }
})

const urlParams = (new URLSearchParams(window.location.search)).get('view_full_work')
const pageMode = (urlParams && urlParams.toLowerCase() === 'true') ? 1 : 0

const curChI = ref(parseInt(mainContent.querySelector(".chapter").getAttribute('id').split('chapter-')[1]) - 1)


// get localstorage data
const localStore = JSON.parse(localStorage.getItem("ao3ReadAssistObj")) || {
  bookmarks: {}, // work's id -> chapter id -> para id
}
console.log('localStore', localStore)

const onScroll = () => {
  const scrollBottom = window.scrollY + window.innerHeight
  if (pageMode) {
    curChI.value = Object.keys(chProgress).filter(chI => chProgress[chI].middle < scrollBottom).length
    curChI.value = curChI.value < 2 ? 0 : curChI.value - 1
    Object.keys(chProgress).forEach(chI => {
      if (chI < curChI.value) chProgress[chI].progress = 100
      else if (chI > curChI.value) chProgress[chI].progress = 0
    })
  }

  chProgress[curChI.value].progress = (Math.min(1, Math.max(0, (scrollBottom - chProgress[curChI.value].middle) / chProgress[curChI.value].height)) * 100).toFixed(0)
  // console.log(curChI.value, chProgress[curChI.value].progress)
}

const onResize = () => {
  // update each chapter progress, height and start position
  chapterDoms.forEach(ch => {
    const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
    const {height, top} = ch.getBoundingClientRect()
    // chProgress[chIndex].top = window.scrollY + top
    chProgress[chIndex].middle = window.scrollY + top + window.innerHeight / 2
    chProgress[chIndex].height = height
  })

  onScroll()
}

window.addEventListener('scroll', onScroll)
window.addEventListener('resize', onResize)

onResize()




export {chProgress, curChI, mainContent, chapterDoms}
