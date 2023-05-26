const onReceiveMsgFromPopup = (res, sender, sendResponse) => {
  if (res.type === 'tab') {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      if (tabs.length) chrome.tabs.update(tabs[0].id, {url: res.url})
      else console.log('no active tab or active window')
    })
  }
}

chrome.runtime.onMessage.addListener(onReceiveMsgFromPopup)
