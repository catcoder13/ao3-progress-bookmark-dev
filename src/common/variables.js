const STORE_SETTING_KEY = 'AO3_IPB_SETTINGS'
const STORE_SETTING_EXTRA_BTN_KEY = 'AO3_IPB_SETTING_EXTRA_BTN_KEY'
const STORE_WORK_KEY_PREFIX = `AO3_IPB_WORK_`
const STORE_ALL_WORK_KEYS = `AO3_IPB_ALL_WORK_KEYS`

const AO3_DOMAIN = "https://archiveofourown.org"

const BOOKMARK_LIMIT = 500

const DEFAULT_SETTINGS = {
  compact: false,
  progressBar: false,
  extraSideBtn: true,
  alignRight: true
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
  backToTop: {label: 'Top', eventKey: 'backToTop', iconProps: { type: 'top'}},
  firstCh: {label: 'First chapter', eventKey: 'jumpToFirstChapter', iconProps: {type: 'next-last', open: false}, checkIfExternal: true},
  prevCh: {label: 'Previous chapter', eventKey: 'jumpToPreviousChapter', iconProps: {type: 'next', open: false}, checkIfExternal: true},
  curCh: {label: 'Current chapter', eventKey: 'jumpToCurrentChapter', iconProps: {type: 'recenter'}},
  nextCh: {label: 'Next chapter', eventKey: 'jumpToNextChapter', iconProps: {type: 'next', open: true}, checkIfExternal: true},
  latestCh: {label: 'Latest chapter', eventKey: 'jumpToLastChapter', iconProps: {type: 'next-last', open: true}, checkIfExternal: true},
  comment: {label: 'Comment section', eventKey: 'onJumpToComment', iconProps: {type: 'speech'}}
}

export {
  STORE_SETTING_KEY,
  STORE_WORK_KEY_PREFIX,
  STORE_ALL_WORK_KEYS,
  DEFAULT_SETTINGS,
  STORE_SETTING_EXTRA_BTN_KEY,
  DEFAULT_SETTING_EXTRA_BUTTONS,
  EXTRA_BUTTON_INFOS,
  AO3_DOMAIN,
  BOOKMARK_LIMIT
}