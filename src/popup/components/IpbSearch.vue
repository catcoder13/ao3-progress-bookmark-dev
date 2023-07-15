<template>
  <div class="ipb-search" :class="{open}">
    <input type="text" :value="selection && selection.text" :style="{opacity: partialText ? 0 : (open ? 0.5 : 1)}"/>
    <input class="ipb-search_main" ref="input" type="text" :value="partialText"
      @input="onInput"
      :placeholder="selection ? '' : 'Search bookmark items by author name or work title'"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeyDown"
    />
    <span class="ipb-close" v-if="selection" @click="clearSelection" title="Clear search result">&#10006;</span>
    <IpbSearchResult v-if="open" @select="onSelect" :options="searchResults" />
  </div>
</template>

<script>
import {ref} from 'vue'
import {
  selection, hoverredItem, resetHoverredItem, clearSelection,
  partialText, searchResults
} from '../js/search'

import IpbSearchResult from './IpbSearchResult.vue'

const [TAB, ESC] = [9, 27]
const [UP, DOWN, ENTER] = [38, 40, 13]

export default {
    props: ["curSelection"],
    components: { IpbSearchResult },
    setup() {
        const input = ref(null)
        const open = ref(false)
        
        const onFocus = () => {
          open.value = true
          if (selection.value) {
            partialText.value = ''
          } else {
            resetHoverredItem()
          }
        }

        const onInput = e => {
          resetHoverredItem()
          partialText.value = e.target.value
        }

        const onBlur = e => {
            if (!e.relatedTarget || !e.relatedTarget.classList.contains("ipb-search-blur-ref")) {
              open.value = false
              partialText.value = ''
            }
        }

        const onSelect = (e, item) => {
          selection.value = item
          partialText.value = ''
          resetHoverredItem()
          open.value = false
          input.value.blur()
        }

        const onKeyDown = e => {
            let newI = hoverredItem.i
            switch (e.keyCode) {
                case TAB:
                case ESC:
                    if (partialText.value) {
                        partialText.value = ""
                        resetHoverredItem()
                    }
                    else e.target.blur()
                    
                    e.preventDefault() // prevent esc cause the entire popup to close
                    break
                case ENTER:
                    if (searchResults.value[hoverredItem.i]) {
                      onSelect(null, searchResults.value[hoverredItem.i])
                    }
                    break
                case UP:
                    hoverredItem.viaNav = true
                    if (searchResults.value.length === 1) {
                      newI = 0
                    } else {
                      newI = hoverredItem.i <= 0 ? 0 : hoverredItem.i - 1
                    }
                    hoverredItem.id = searchResults.value[newI].id
                    hoverredItem.i = newI
                    e.preventDefault()
                    break
                case DOWN:
                    hoverredItem.viaNav = true
                    newI = (hoverredItem.i < searchResults.value.length - 1) ? hoverredItem.i + 1 : searchResults.value.length - 1
                    hoverredItem.id = searchResults.value[newI].id
                    hoverredItem.i = newI
                    e.preventDefault()
                    break
            }
        }

        const onArrowClick = e => {
          if (open.value) onBlur(e)
          else onFocus()
          
          e.stopPropagation()
        }
        return {
            input, open,
            selection, partialText, hoverredItem, searchResults,
            onFocus, onSelect, onInput, onBlur, clearSelection, onKeyDown, onArrowClick
        }
    }
    
}
</script>

<style lang="scss">
.ipb-search {
  position: relative;

  &.open {
    &::before {
      pointer-events: all;
      cursor: pointer;
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
    overflow: hidden;
    text-overflow: ellipsis;
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

  &::before {
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
  
  .ipb-search-result {
    position: absolute;
    z-index: 1;
    bottom: 0;
    transform: translateY(100%);
    width: 100%;
    max-height: 150px;
    overflow-y: auto;
  }
}
</style>
