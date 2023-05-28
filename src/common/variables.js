const STORE_SETTING_KEY = 'AO3_IPB_SETTINGS'
const STORE_SETTING_EXTRA_BTN_KEY = 'AO3_IPB_SETTING_EXTRA_BTN_KEY'
const STORE_WORK_KEY_PREFIX = `AO3_IPB_WORK_`
const STORE_ALL_WORK_KEYS = `AO3_IPB_ALL_WORK_KEYS`

const DEFAULT_SETTINGS = {
  compact: false,
  progressBar: true,
  extraSideBtn: false,
  alignRight: true
}

const DEFAULT_SETTING_EXTRA_BUTTONS = {
  backToTop: true,
  firstCh: true,
  prevCh: true,
  nextCh: true,
  latestCh: true,
  comment: true
}

// const EXTRA_BUTTON_INFOS = {
//   backToTop: {label: 'Top', iconProps: {type: 'top'}},
//   firstCh: {label: 'First chapter', iconProps: {type: 'next-last', open: false}},
//   prevCh: {label: 'Previous chapter', iconProps: {type: 'next', open: false}},
//   nextCh: {label: 'Next chapter', iconProps: {type: 'next', open: true}},
//   latestCh: {label: 'Latest chapter', iconProps: {type: 'next-last', open: true}},
//   comment: {label: 'Comment section', iconProps: {type: 'speech'}}
// }

const EXTRA_BUTTON_INFOS = {
  backToTop: {label: 'Back to top', eventKey: 'onBackToTop', iconProps: { type: 'top'}},
  firstCh: {label: 'First chapter', eventKey: 'onFirstChapter', iconProps: {type: 'next-last', open: false}},
  prevCh: {label: 'Previous chapter', eventKey: 'onPreviousChapter', iconProps: {type: 'next', open: false}},
  nextCh: {label: 'Next chapter', eventKey: 'onNextChapter', iconProps: {type: 'next', open: true}},
  latestCh: {label: 'Latest chapter', eventKey: 'onLastestChapter', iconProps: {type: 'next-last', open: true}},
  comment: {label: 'Comment section', eventKey: 'onJumpToComment', iconProps: {type: 'speech'}}
}

export {
  STORE_SETTING_KEY,
  STORE_WORK_KEY_PREFIX,
  STORE_ALL_WORK_KEYS,
  DEFAULT_SETTINGS,
  STORE_SETTING_EXTRA_BTN_KEY,
  DEFAULT_SETTING_EXTRA_BUTTONS,
  EXTRA_BUTTON_INFOS
}