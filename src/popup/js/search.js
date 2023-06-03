import { computed, ref } from 'vue'

import { works } from "./works"

const partialText = ref('')
const selection = ref(null)

const searchItems = computed(() => {
  const authorRef = {}
  const workArr = Object.keys(works).map((workID, i) => {
    authorRef[works[workID].author] = true
    return {type: 'work', val: workID, i, text: works[workID].name}
  })

  const authorArr = Object.keys(authorRef).map((author, i) => ({type: 'author', val: author, i: workArr.length + i, text: author}))

  return [...workArr, ...authorArr].sort((a,b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()))
})

const searchResults = computed(() => {
  if (!partialText.value.length) return searchItems.value

  const lowerPartialInput = partialText.value.toLocaleLowerCase()
  return searchItems.value.filter(item => item.text.toLocaleLowerCase().indexOf(lowerPartialInput) !== -1)
})

export {
  selection,
  partialText,
  searchItems,
  searchResults
}
