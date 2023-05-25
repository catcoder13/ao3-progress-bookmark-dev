import { createApp } from 'vue'
import Content from './Content.vue'
// import IpbNavbar from './components/IpbNavbar.vue'

// initialise html entry
// const ao3AssistDom = document.createElement('div')
// ao3AssistDom.setAttribute('id', 'ao3-in-page-bookmark')
// ao3AssistDom.classList.add('ao3-in-page-bookmark')

// document.getElementById('outer').appendChild(ao3AssistDom)

const mainContent = document.getElementById('workskin')

if (mainContent) {
  // const navDom = document.createElement('div')
  // navDom.setAttribute('id', 'ipb-navbar')
  // mainContent.parentNode.insertBefore(navDom, mainContent)
  // createApp(IpbNavbar).mount('#ipb-navbar')
  const ao3AssistDom = document.createElement('div')
  ao3AssistDom.setAttribute('id', 'ao3-in-page-bookmark')
  ao3AssistDom.classList.add('ao3-in-page-bookmark')

  document.querySelector('body').appendChild(ao3AssistDom)

  createApp(Content).mount('#ao3-in-page-bookmark')
}
