import { createApp } from 'vue'
import Content from './Content.vue'

// initialise html entry
const ao3AssistDom = document.createElement('div')
ao3AssistDom.setAttribute('id', 'ao3-in-page-bookmark')
ao3AssistDom.classList.add('ao3-in-page-bookmark')

document.querySelector('body').appendChild(ao3AssistDom)

if (document.getElementById('workskin')) createApp(Content).mount('#ao3-in-page-bookmark')
