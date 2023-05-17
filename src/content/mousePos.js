import { reactive } from "vue"

const mousePos = reactive({x: 0, y: 0})


const onMouseMove = e => {
  mousePos.x = e.clientX
  mousePos.y = e.clientY

  // console.log('x', mousePos.x, 'y', mousePos.y)
}

window.addEventListener('mousemove', onMouseMove)

export { mousePos }
