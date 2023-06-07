import { onScroll } from "@/content/js/scroll"

const STORE_SETTING_KEY = 'AO3_IPB_SETTINGS'
const STORE_SETTING_POPUP_KEY = 'AO3_IPB_SETTINGS_POPUP'
const STORE_SETTING_EXTRA_BTN_KEY = 'AO3_IPB_SETTING_EXTRA_BTN_KEY'
const STORE_WORK_KEY_PREFIX = `AO3_IPB_WORK_`
const STORE_ALL_WORK_KEYS = `AO3_IPB_ALL_WORK_KEYS`

const AO3_DOMAIN = "https://archiveofourown.org"

const BOOKMARK_LIMIT = 100

const DEFAULT_SETTINGS = {
  // compact: false,
  progressBar: false,
  extraSideBtn: true,
  alignRight: true
}

const DEFAULT_POPUP_SETTINGS = {
  compact: false
}

const DEFAULT_SETTING_EXTRA_BUTTONS = {
  backToTop: false,
  firstCh: false,
  prevCh: false,
  curCh: false,
  nextCh: false,
  latestCh: false,
  comment: true
}

const EXTRA_BUTTON_INFOS = {
  backToTop: {label: 'Top', eventKey: 'backToTop', iconProps: { type: 'top'}, chICode: -3, onClick: onScroll},
  firstCh: {label: 'First chapter', eventKey: 'jumpToFirstChapter', iconProps: {type: 'next-last', open: false}, checkIfExternal: true, chICode: -2},
  prevCh: {label: 'Previous chapter', eventKey: 'jumpToPreviousChapter', iconProps: {type: 'next', open: false}, checkIfExternal: true, chICode: -1},
  curCh: {label: 'Current chapter', eventKey: 'jumpToCurrentChapter', iconProps: {type: 'recenter'}, chICode: 0},
  nextCh: {label: 'Next chapter', eventKey: 'jumpToNextChapter', iconProps: {type: 'next', open: true}, checkIfExternal: true, chICode: 1},
  latestCh: {label: 'Latest chapter', eventKey: 'jumpToLastChapter', iconProps: {type: 'next-last', open: true}, checkIfExternal: true, chICode: 2},
  comment: {label: 'Comment section', eventKey: 'onJumpToComment', iconProps: {type: 'speech'}, chICode: 3, onClick: () => {
    const commentBtnElem = document.querySelector('#show_comments_link a')
    if (commentBtnElem && commentBtnElem.innerText.indexOf('Hide') === -1) commentBtnElem.click()
  }}
}

export {
  STORE_WORK_KEY_PREFIX, STORE_ALL_WORK_KEYS,
  DEFAULT_SETTINGS, DEFAULT_POPUP_SETTINGS, DEFAULT_SETTING_EXTRA_BUTTONS,
  STORE_SETTING_KEY, STORE_SETTING_POPUP_KEY, STORE_SETTING_EXTRA_BTN_KEY,
  EXTRA_BUTTON_INFOS,
  AO3_DOMAIN,
  BOOKMARK_LIMIT
}