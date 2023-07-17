import { computed, ref, reactive } from 'vue'

import { works } from "./works"

const partialText = ref('')
const selection = ref(null)
const hoverredItem = reactive({
  viaNav: false, // false: via hover, true: via up/down
  i: -1,
  id: null
})

const resetHoverredItem = () => {
  hoverredItem.viaNav = false
  hoverredItem.i = -1
  hoverredItem.id = null
}

const searchItems = computed(() => {
  const authorRef = {}
  const workArr = Object.keys(works).map(workID => {
    if (!authorRef[works[workID].author]) authorRef[works[workID].author] = works[workID].authorURL
    return {type: 'work', val: workID, text: works[workID].name, author: works[workID].author}
  })

  const authorArr = Object.keys(authorRef).map(author => {
    return { type: 'author', val: author, text: author, authorURL: authorRef[author] }
  })

   return [...workArr, ...authorArr]
    .sort((a,b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()))
    .map((item, i) => ({...item, id: i}))
})

const searchResults = computed(() => {
  let results = searchItems.value
  if (partialText.value.length) {
    const lowerPartialInput = partialText.value.toLocaleLowerCase()
    results = results.filter(item => item.text.toLocaleLowerCase().indexOf(lowerPartialInput) !== -1)
  }

  return results.map((item, i) => ({...item, i}))
})

const selectAuthor = author => {
  partialText.value = author
  selection.value = searchItems.value.filter(item => item.type === 'author' && item.val === author)[0]
}

const clearSelection = () => {
  selection.value = null
  partialText.value = ''
  resetHoverredItem()
}

export {
  selection,
  hoverredItem,
  resetHoverredItem,
  clearSelection,
  partialText,
  selectAuthor,
  searchResults
}
