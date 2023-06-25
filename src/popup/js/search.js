import { computed, ref, reactive, nextTick } from 'vue'

import { works } from "./works"

const partialText = ref('')
const selection = ref(null)
const curSelectedIndex = reactive({
  viaNav: false, // false: via hover, true: via up/down
  i: -1
})


const MAX_RESULT_DISPLAY = 20
const APPEND_OFFSET = 4

const resultAnchor = reactive({min: 0, max: MAX_RESULT_DISPLAY})

const resetResultAnchor = () => {
  resultAnchor.min = 0
  resultAnchor.max = MAX_RESULT_DISPLAY
}

const searchItems = computed(() => {
  const authorRef = {}
  const workArr = Object.keys(works).map((workID, i) => {
    if (!authorRef[works[workID].author]) authorRef[works[workID].author] = {}
    authorRef[works[workID].author][workID] = works[workID]
    return {type: 'work', val: workID, i, text: works[workID].name, works: {[workID]: works[workID]}}
  })

  const authorArr = Object.keys(authorRef).map((author, i) => {
    return {
      type: 'author', val: author, i: workArr.length + i, text: author, works: authorRef[author],
      authorURL: authorRef[author][Object.keys(authorRef[author])[0]].authorURL
    }
  })

  return [...workArr, ...authorArr].sort((a,b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()))
})

const searchResults = computed(() => {
  if (!partialText.value.length) return searchItems.value

  const lowerPartialInput = partialText.value.toLocaleLowerCase()
  return searchItems.value.filter(item => item.text.toLocaleLowerCase().indexOf(lowerPartialInput) !== -1)
})

const searchResultWindow = computed(() => {
  return searchResults.value.filter((item, i) => {
    return i >= resultAnchor.min && i < resultAnchor.max
  })
})
const resultAppendDown = async () => {
  const newMax = Math.min(searchResults.value.length, resultAnchor.max + APPEND_OFFSET)
  const diff = newMax - resultAnchor.max
  
  resultAnchor.max = newMax
  resultAnchor.min = Math.max(0, resultAnchor.max - MAX_RESULT_DISPLAY)
  // console.log('append d')
  
  curSelectedIndex.i -= diff
}

const resultAppendUp = async () => {
  const newMin = Math.max(0, resultAnchor.min - APPEND_OFFSET)
  const diff = resultAnchor.min - newMin
  resultAnchor.min = newMin
  resultAnchor.max = Math.min(searchResults.value.length, resultAnchor.min + MAX_RESULT_DISPLAY)

  curSelectedIndex.i += diff

  // console.log('append u')
}

const selectAuthor = author => {
  partialText.value = author
  selection.value = searchItems.value.filter(item => item.type === 'author' && item.val === author)[0]
}

export {
  selection,
  curSelectedIndex,
  partialText,
  selectAuthor,
  resetResultAnchor,
  searchResultWindow,
  resultAppendUp,
  resultAppendDown
}
