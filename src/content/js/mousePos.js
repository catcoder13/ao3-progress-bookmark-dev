import { reactive } from "vue"

const mousePos = reactive({x: -1, y:  -1})

let eventRefCount = 0

const onMouseMove = e => {
  mousePos.x = e.clientX
  mousePos.y = e.clientY
}

const activateMouseMove = (initX = -1, initY = -1) => {
  if (!eventRefCount) {
    window.addEventListener('mousemove', onMouseMove)
    mousePos.x = initX
    mousePos.y = initY
  }
  eventRefCount++
}
const deactivateMouseMove = () => {
  eventRefCount--
  if (eventRefCount <= 0) {
    window.removeEventListener('mousemove', onMouseMove)
    mousePos.x = -1
    mousePos.y = -1
  }
  
}

export { mousePos, activateMouseMove, deactivateMouseMove }
