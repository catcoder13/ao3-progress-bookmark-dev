import { onScroll } from "@/content/js/scroll"

const STORE_SETTING_KEY = 'AO3_IPB_SETTINGS'
const STORE_SETTING_EXTRA_BTN_KEY = 'AO3_IPB_SETTING_EXTRA_BTN_KEY'
const STORE_SETTING_POPUP_KEY = 'AO3_IPB_SETTING_POPUP'

const STORE_WORK_KEY_PREFIX = `AO3IPB`
const STORE_ALL_WORK_KEYS = `AO3_IPB_ALL_WORK_KEYS`

const AO3_DOMAIN = "https://archiveofourown.org"

const BOOKMARK_LIMIT = 2000

const DEFAULT_SETTINGS = {
  progressBar: false,
  extraSideBtn: true,
  alignRight: true
}

const DEFAULT_SETTING_EXTRA_BUTTONS = {
  backToTop: true,
  firstCh: false,
  prevCh: false,
  curCh: false,
  nextCh: false,
  latestCh: true,
  comment: true
}

const SORT_BY = [{label: 'Recent bookmark', val: 't', symbol: '&#x1F550;'}, {label: 'Progress', val: 'perc', symbol: '%'}, {label: 'Title', val: 'name'}]

const DEFAULT_SETTING_POPUP = {
  compact: false,
  sortBy: SORT_BY[0],
  descend: true
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
  DEFAULT_SETTINGS, DEFAULT_SETTING_EXTRA_BUTTONS, DEFAULT_SETTING_POPUP,
  STORE_SETTING_KEY, STORE_SETTING_EXTRA_BTN_KEY, STORE_SETTING_POPUP_KEY,
  EXTRA_BUTTON_INFOS, SORT_BY,
  AO3_DOMAIN,
  BOOKMARK_LIMIT
}