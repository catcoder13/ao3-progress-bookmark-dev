import { computed, ref, reactive, nextTick } from 'vue'

import { works } from "./works"

const partialText = ref('')
const selection = ref(null)
const lastScrollPos = ref(0)
const hoverredItem = reactive({
  viaNav: false, // false: via hover, true: via up/down
  i: -1,
  id: null,
  // elem: null
})

const activeSearchResults = ref([])


// const MAX_RESULT_DISPLAY = 20
// const APPEND_OFFSET = 4

// const resultAnchor = reactive({min: 0, max: MAX_RESULT_DISPLAY})

// const resetResultAnchor = () => {
//   resultAnchor.min = 0
//   resultAnchor.max = MAX_RESULT_DISPLAY
//   lastScrollPos.value = 0
// }

const resetHoverredItem = () => {
  hoverredItem.viaNav = false
  hoverredItem.i = -1
  hoverredItem.id = null
  // hoverredItem.elem = null
}

const searchItems = computed(() => {
  const authorRef = {}
  const workArr = Object.keys(works).map((workID, i) => {
    if (!authorRef[works[workID].author]) authorRef[works[workID].author] = {}
    authorRef[works[workID].author][workID] = works[workID]
    return {type: 'work', val: workID, text: works[workID].name, works: {[workID]: works[workID]}}
    // return {type: 'work', val: workID, i, text: works[workID].name, works: {[workID]: works[workID]}}
  })

  const authorArr = Object.keys(authorRef).map((author, i) => {
    return {
      type: 'author', val: author, text: author, works: authorRef[author],
      // type: 'author', val: author, i: workArr.length + i, text: author, works: authorRef[author],
      authorURL: authorRef[author][Object.keys(authorRef[author])[0]].authorURL
    }
  })

   return [...workArr, ...authorArr]
    .sort((a,b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()))
    .map((item, i) => ({...item, id: i}))


  // return sortedAllSearchItems
})

const searchResults = computed(() => {
  let results = searchItems.value.map((item, i) => ({...item, i}))
  if (!partialText.value.length) return results

  const lowerPartialInput = partialText.value.toLocaleLowerCase()
  return results.filter(item => item.text.toLocaleLowerCase().indexOf(lowerPartialInput) !== -1)
})

const selectAuthor = author => {
  partialText.value = author
  selection.value = searchItems.value.filter(item => item.type === 'author' && item.val === author)[0]
}

export {
  selection,
  hoverredItem,
  resetHoverredItem,
  partialText,
  lastScrollPos,
  selectAuthor,
  searchResults,
  activeSearchResults
}
