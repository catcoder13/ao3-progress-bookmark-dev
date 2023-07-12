const fs = require('fs')

const NUM_OF_AUTHORS = 1000
const NUM_OF_WORKS = 2000

const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'
const MAX_AUTHOR_NAME_LENGTH = 40
const MAX_WORK_NAME_LENGTH = 255
const MAX_WORK_CHTITLE_LENGTH = 255
const numChars = '0123456789'
const WORK_ID_LENGTH = 8
const CHAPTER_ID_LENGTH = 9

const generateRdmTxt = len => {
  let result = ''

  for (var i =0; i < len; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }
  return result
}

const generateRdmNum = len => {
  let result = ''
  for (var i =0; i < len; i++) {
    var randomIndex = Math.floor(Math.random() * numChars.length)
    result += numChars.charAt(randomIndex)
  }
  return result
}

const AUTHORS = Array(NUM_OF_AUTHORS).fill('').map(() => generateRdmTxt(MAX_AUTHOR_NAME_LENGTH))

const generateWork = () => {
  const name = generateRdmTxt(MAX_WORK_NAME_LENGTH)
  const authorIndex = Math.floor(Math.random() * NUM_OF_AUTHORS)
  const author = AUTHORS[authorIndex]
  const workID = generateRdmNum(WORK_ID_LENGTH)
  const chID = generateRdmNum(CHAPTER_ID_LENGTH)
  const chI = Math.floor(Math.random() * 200) // assume 200 chapter
  const oneShot = Math.random < 0.1

  return [workID, {
    name,
    author,
    authorURL: `/users/${author}/pseuds/${author}`,
    chI, chID, oneShot,
    perc: Math.random(),
    t: Date.now(),
    chTitle: generateRdmTxt(MAX_WORK_CHTITLE_LENGTH)
  }]
}

const workObjs = {}
// const workIDs = {}
const workIDs = []

for (var i = 0; i < NUM_OF_WORKS; i++) {
  const [workID, work] = generateWork()
  workIDs.push(workID)
  // workIDs[workID] = work.name
  workObjs['AO3IPB' + workID] = work
}

fs.writeFileSync('./test-data-limit/datas/works.json', JSON.stringify(workObjs))
fs.writeFileSync('./test-data-limit/datas/authors.json', JSON.stringify(AUTHORS))
fs.writeFileSync('./test-data-limit/datas/workIDs.json', JSON.stringify(workIDs))
fs.writeFileSync('./test-data-limit/datas/bm.json', JSON.stringify({
  AO3_IPB_ALL_WORK_KEYS: workIDs,
  ...workObjs
}))
