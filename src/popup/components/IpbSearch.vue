<template>
  <div class="ao3pb-search" :class="{open}">
    <input type="text" tabindex="-1" :value="selection && selection.text" :style="{opacity: partialText ? 0 : (open ? 0.5 : 1)}"/>
    <input class="ao3pb-search_main" ref="input" type="text" :value="partialText" :tabindex="getTabIndex([0])"
      @input="onInput"
      :placeholder="selection ? '' : 'Search bookmark items by author name or work title'"
      @click="onFocus"
      @blur="onBlur"
      @keydown="onKeyDown"
    />
    <button class="ao3pb-close" v-if="selection" @click="clearSelection" title="Clear search result" :tabindex="getTabIndex([0])">&#10006;</button>
    <IpbSearchResult v-if="open" @select="onSelect" :options="searchResults" />
  </div>
</template>

<script>
import {ref} from 'vue'
import { getTabIndex } from '../js/visibility'
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
        
        const onFocus = e => {
          open.value = true
          if (selection.value) {
            partialText.value = ''
          } else {
            resetHoverredItem()
          }
        }

        const onInput = e => {
          console.log('on input')
          if (!open.value) onFocus()
          resetHoverredItem()
          partialText.value = e.target.value
        }

        const onBlur = e => {
            if (!e.relatedTarget || !e.relatedTarget.classList.contains("ao3pb-search-blur-ref")) {
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
                    partialText.value = ""
                    resetHoverredItem()
                    e.target.blur()
                  break
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
                    } else if (!open.value) {
                      onFocus()
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

        return {
            input, open,
            selection, partialText, hoverredItem, searchResults, getTabIndex,
            onFocus, onSelect, onInput, onBlur, clearSelection, onKeyDown
        }
    }
    
}
</script>

<style lang="scss">
.ao3pb-search {
  position: relative;

  &.open {
    &::before {
      pointer-events: all;
      cursor: pointer;
      transform: rotate(-135deg);
      top: 8px;
    }

    .ao3pb-close { display: none; }
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

  .ao3pb-close {
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
  
  .ao3pb-search-result {
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
