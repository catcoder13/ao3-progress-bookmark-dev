import { reactive } from "vue"

const mousePos = reactive({x: window.innerWidth / 2, y:  window.innerHeight / 2})


const onMouseMove = e => {
  mousePos.x = e.clientX
  mousePos.y = e.clientY

  // console.log('x', mousePos.x, 'y', mousePos.y)
}

window.addEventListener('mousemove', onMouseMove)

export { mousePos }
