import {reactive, computed} from 'vue'

const STORE_WORK_KEY_PREFIX = `AO3_IPB_WORK_`
const STORE_ALL_WORK_KEYS = `AO3_IPB_ALL_WORK_KEYS`
const AO3_DOMAIN = "https://archiveofourown.org"

const works = reactive({})

const worksGroupByAuthor = computed(() => {
  return Object.keys(works)
    .reduce((acc, workID) => {
      const work = works[workID]
      if (!acc[work.authorName]) acc[work.authorName] = []

      acc[work.authorName].push({workID, ...works[workID]})

      return acc
    }, {})
})
let workIDs = []

chrome.storage.local.get(STORE_ALL_WORK_KEYS).then(wIDObj => {
  workIDs = wIDObj[STORE_ALL_WORK_KEYS]
  if (!workIDs) return

  Promise.all(
    workIDs.map(workID => chrome.storage.local.get(STORE_WORK_KEY_PREFIX + workID))
  ).then(workObjs => {
    workObjs.forEach((workObj, i) => {
      const work = workObj[STORE_WORK_KEY_PREFIX + workIDs[i]]
      if (work) {
        works[workIDs[i]] = work
      } else {
        console.log(workIDs[i], 'object not found')
      }

    })
  })
})

const removeWork = workID => {
  chrome.storage.local.remove(STORE_WORK_KEY_PREFIX + workID)
  chrome.storage.local.set({
    [STORE_ALL_WORK_KEYS]: workIDs.filter(wID => wID !== workID)
  })
  delete works[workID]
}

const visitURL = subURL => {
  chrome.runtime.sendMessage(
    {type: 'tab', url: AO3_DOMAIN + subURL},
    res => {
      console.log(res)
    }
  )
}

const clearChromeStorage = () => {
  chrome.storage.local.clear()
}

export {works, worksGroupByAuthor, removeWork, visitURL, clearChromeStorage}
