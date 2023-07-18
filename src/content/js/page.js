import { reactive, computed, ref } from 'vue'
import { mainContent, chapterDoms, isEntireWork, oneShot } from './static'
import { scrollY, onScroll, activateScroll } from './scroll'

const pageReady = ref(false)
const windowLoaded = ref(false)

let chapters = null
const chaptersRef = {}
let initCurChI = 0

const view = reactive({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight})

const curChI = computed(() => {
  if (oneShot || chapterDoms.length === 1) return initCurChI

  const scrollBottom = scrollY.value + view.height
  const result = Object.keys(chapters).filter(chI => chapters[chI].top < scrollBottom).length

  return result < 2 ? 0 : result - 1
})


/**
 * only register resize/scroll event for valid work page (determined by mainContent)
 */
if (mainContent) {
  const onResize = () => {
    view.width = document.documentElement.clientWidth
    view.height = document.documentElement.clientHeight
    onScroll()
  }
  
  const updateChapterDomSize = () => {
    view.width = document.documentElement.clientWidth
    view.height = document.documentElement.clientHeight
  
    const chIs = Object.keys(chapters)
    chIs.forEach(chI => {
      const {top, height} = (chapters[chI].dom && chapters[chI].dom.getBoundingClientRect()) || {top: 0, height: 0}
      chapters[chI].top = window.scrollY + top
      chapters[chI].height = height
    })
    onScroll()
  }
  
  /**
   * initialise position/height reference multi chapter/one-shot content 
   */
  if (chapterDoms.length) { // multi chapter
    initCurChI = parseInt(chapterDoms[0].getAttribute('id').split('chapter-')[1]) - 1

    chapterDoms.forEach(ch => {
      const chIndex = parseInt(ch.getAttribute('id').split('chapter-')[1]) - 1
      chaptersRef[chIndex] = reactive({ top: -1, height: 0, dom: ch })
    })
  } else { // one shot
    chaptersRef[0] = reactive({ top: -1, height: 0, dom: mainContent && mainContent.querySelector('#chapters') })
  }
  chapters = chaptersRef
  

  /**
   * scroll event
   * initialise scroll event ON LOAD is only needed if the page is
   *  - is an Entire Work page(which chapterDoms.length must be > 1)
   *    in which curChI must stayed updated with scroll event that updates scrollY
   */
  if (isEntireWork) activateScroll()

  
  /**
   * update content's position/height reference when outer is resized
   * this is used instead of window.resize due to
   *  - window.resize is not triggered by page content growth/shrink
   *  - page content resize occurs when eg. expand comment section
   */
  const resizeObserver = new ResizeObserver(updateChapterDomSize)
  const outer = document.getElementById('outer')
  resizeObserver.observe(outer)
  updateChapterDomSize()

  
  /**
   * update viewport size reference when the browser is resized
   * this is needed on top of outer's resizeObserver due to
   *  - viewport change due to window resize vertically does not trigger outer's resize.
   */
  window.addEventListener('resize', onResize)
  onResize()


  window.addEventListener('load', () => windowLoaded.value = true)
  pageReady.value = true
}


export { chapters, curChI, view, pageReady, windowLoaded }
