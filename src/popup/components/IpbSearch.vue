<template>
  <div class="ipb-search" :class="{open}">
    <input type="text" :value="selection && selection.text" :style="{opacity: partialText ? 0 : (open ? 0.5 : 1)}"/>
    <input ref="input" type="text" :value="partialText"
      @input="onInput"
      :placeholder="selection ? '' : 'Search by author name or work title'"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeyDown"
    />
    <span class="ipb-close" v-if="selection" @click="onClear">&#10006;</span>
    <IpbSearchResult v-if="open" class="ipb-style-scrollbar" v-model:hoverI="curSelectedIndex" @select="onSelect" :options="searchResults" />
    
  </div>
</template>

<script>
import {ref} from 'vue'
import { works } from '../js/works'
import { selection, partialText, searchResults} from '../js/search'
import IpbSearchResult from './IpbSearchResult.vue'

const [TAB, ESC] = [9, 27]
const [UP, DOWN, ENTER] = [38, 40, 13]

export default {
    props: ["curSelection"],
    components: { IpbSearchResult },
    setup() {
        const curSelectedIndex = ref(-1)
        const input = ref(null)
        const open = ref(false)
        
        const onFocus = async () => {
          open.value = true
          if (selection.value) {
            partialText.value = ''
            console.log(selection.value)
          }
        }

        const onInput = e => {
          curSelectedIndex.value = -1
          partialText.value = e.target.value
        }

        const onBlur = e => {
            if (!e.relatedTarget || !e.relatedTarget.classList.contains("ipb-search-blur-ref")) {
              open.value = false
              partialText.value = ''
            }
            console.log('on blur', e)
        }

        const onSelect = (e, item) => {
          selection.value = item
          partialText.value = item.text
          curSelectedIndex.value = -1
          open.value = false
          console.log('on select')
          input.value.blur()
        }

        const onClear = () => {
          selection.value = null
          partialText.value = ''
          curSelectedIndex.value = -1
          input.value.focus()
        }

        const onKeyDown = e => {
            switch (e.keyCode) {
                case TAB:
                case ESC:
                    if (partialText.value) {
                        partialText.value = ""
                        curSelectedIndex.value = -1
                    }
                    else e.target.blur()
                    
                    e.preventDefault() // prevent esc cause the entire popup to close
                    break
                case ENTER:
                    if (searchResults.value[curSelectedIndex.value]) {
                      onSelect(null, searchResults.value[curSelectedIndex.value])
                    }
                    break
                case UP:
                    curSelectedIndex.value = curSelectedIndex.value <= 0 ? searchResults.value.length - 1 : --curSelectedIndex.value
                    break
                case DOWN:
                    curSelectedIndex.value = (curSelectedIndex.value + 1) % searchResults.value.length
                    break
            }
        }
        return {
            input, open, selection, partialText, searchResults, curSelectedIndex, works,
            onFocus, onSelect, onInput, onBlur, onClear, onKeyDown
        }
    }
    
}
</script>

<style lang="scss">
.ipb-search {
  position: relative;

  &.open {
    &::before {
      transform: rotate(-135deg);
      top: 8px;
    }

    .ipb-close { display: none; }
  }

  input {
    width: 100%;
    padding: 4px 40px 4px 4px;
    box-sizing: border-box;
    outline: none;
  }

  input:first-child {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    background-color: transparent;
    opacity: 0.5;
  }

  .ipb-close {
    position: absolute;
    right: 25px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #888;
    line-height: 1;
    cursor: pointer;
    transition: transform 0.2s, color 0.2s;

    &:hover { transform: translateY(-50%) scale(1.2); color: #333; }
  }

  &:before {
    content: '';
    position: absolute;
    top: 4px;
    right: 8px;
    transform: rotate(45deg);
    border-right: 3px solid #888;
    border-bottom: 3px solid #888;
    height: 8px;
    width: 8px;
    transition: transform 0.2s, border-color 0.2s;
    pointer-events: none;
  }
  
  .ipb-style-scrollbar {
    position: absolute;
    z-index: 1;
    left: 0;
    bottom: 0;
    transform: translateY(100%);
    max-width: 100%;
    max-height: 150px;
    overflow-y: overlay;
  }
}
</style>
