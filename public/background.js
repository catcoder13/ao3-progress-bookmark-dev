const ao3Domain = "https://archiveofourown.org"

const PAGE = {
  WORKS: 0,
  TAGS: 1,
  OTHERS: 2,
  NOTAO3: 3
}
const isAO3 = tab => tab.url && tab.url.startsWith(ao3Domain)
let currentTabId = null

const getPageType = tab => {
  if (!tab.url) return PAGE.NOTAO3
  if (tab.url.indexOf('/works/') !== -1) return PAGE.WORKS
  if (tab.url.indexOf('/tags/') !== -1) return PAGE.TAGS

  return PAGE.OTHERS
}

const setBrowserIcon = tab => {
  switch(getPageType(tab)) {
    case PAGE.WORKS:
      chrome.action.setIcon({path: 'imgs/bavy_w.png'})
      break
    default:
      chrome.action.setIcon({path: 'imgs/bavy.png'})
      break
  }
}

const isWorkPage = url => url.indexOf('/works/') !== -1
chrome.runtime.onInstalled.addListener(() => {
  console.log('on installed')
})

const onActivated = async ({tabId, windowId}) => {
  try {
    chrome.tabs.get(tabId, tab => {
      currentTabId = tabId
      setBrowserIcon(tab)

      switch(getPageType(tab)) {
        case PAGE.WORKS:
          console.log('enter work page')
          break
        case PAGE.TAGS:
          console.log('enter tag page')
          break
        default:
          console.log('enter other page')
          break
      }
    })
  } catch (err) {
    console.warn('[onActivated]', err)
  }
}

const onUpdated = async (tabId, {status}, tab) => {
  try {
    if (currentTabId === tabId) setBrowserIcon(tab)
    
    if (isAO3(tab) && status === 'complete') {
      console.log('[uonupdated] ', tab, tabId)
      
    }
  } catch (err) {
    console.warn('[onUpdated]', err)
  }
}

chrome.tabs.onActivated.addListener(onActivated)
chrome.tabs.onUpdated.addListener(onUpdated)
