import { computed, ref } from 'vue'

import { works } from "./works"

const partialText = ref('')
const selection = ref(null)

const MAX_DISPLAY_SEARCH_RESULT = 10

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

const onShiftDown = () => {
  
}

const onShiftUp = () => {

}

const selectAuthor = author => {
  partialText.value = author
  selection.value = searchItems.value.filter(item => item.type === 'author' && item.val === author)[0]
}

export {
  selection,
  partialText,
  searchItems,
  selectAuthor,
  searchResults
}
