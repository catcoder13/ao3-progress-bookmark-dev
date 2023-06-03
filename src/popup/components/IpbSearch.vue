<template>
  <div class="ipb-search">
    <input type="text" :value="selection && selection.text" :style="{opacity: partialText ? 0 : (open ? 0.5 : 1)}"/>
    <input ref="input" type="text" :value="partialText"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeyDown"
    />
    <span class="ipb-close" v-if="selection" @click="onClear">&#10006;</span>

    <div ref="buttonParent" v-if="open" class="ipb-style-scrollbar">
      <template v-if="searchResults.length">
        <button
          ref="buttons"
          @mouseenter="curSelectedIndex = i"
          @click="e => onSelect(e, item)" class="ipb-search-blur-ref" :class="{current: curSelectedIndex === i}" v-for="(item, i) in searchResults" :key="i">
        <IpbIcon :type="item.type === 'work' ? 'bookmark' : 'author'" fill="#555" />{{
          item.text
        }}</button>
      </template>
      
      <template v-else>
        No matched result.
      </template>
    </div>
    
  </div>
</template>

<script>
import {ref, computed, watch} from 'vue'
import { works } from '../js/works'
import { selection, partialText, searchResults} from '../js/search'
import IpbIcon from '@/common/IpbIcon.vue'

const [TAB, ESC] = [9, 27]
const [UP, DOWN, ENTER] = [38, 40, 13]

export default {
    props: ["curSelection"],
    setup() {
        const buttons = ref(null)
        const buttonParent = ref(null)
        const curSelectedIndex = ref(0)
        
        watch(() => curSelectedIndex.value,
        newIndex => {
          const {top, bottom} = buttons.value[newIndex].getBoundingClientRect()
          const {top: pTop, height: pHeight} = buttonParent.value.getBoundingClientRect()
          
          const btnTop = buttonParent.value.scrollTop + top
          const btnBottom = buttonParent.value.scrollTop + bottom
          const containerTop = buttonParent.value.scrollTop + pTop
          const containerBottom = containerTop + pHeight
          if (btnBottom > containerBottom) {
            console.log('exit bottom')
            const diff = btnBottom - containerBottom
            buttonParent.value.scrollTo(0, buttonParent.value.scrollTop + diff)
          } else if (btnTop < containerTop) {
            console.log('exit top')
            const diff = containerTop - btnTop
            buttonParent.value.scrollTo(0, buttonParent.value.scrollTop - diff)
          }
          
        }
        )
        const input = ref(null)
        
        const open = ref(false)
        const selectSuggest = computed(() => searchResults.value[curSelectedIndex.value])

        
        const onFocus = () => {
          if (selection.value) {
            partialText.value = ''
            curSelectedIndex.value = selection.value.i
          }
          open.value = true
        }

        const onInput = e => {
          curSelectedIndex.value = 0
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
          curSelectedIndex.value = 0
          partialText.value = item.text
          open.value = false
          console.log('on select')

          // if (e) e.stopPropagation()
        }

        const onClear = () => {
          selection.value = null
          partialText.value = ''
          curSelectedIndex.value = 0
          input.value.focus()
        }

        const onKeyDown = e => {
            switch (e.keyCode) {
                case TAB:
                case ESC:
                    if (partialText.value) {
                        partialText.value = ""
                        curSelectedIndex.value = 0
                    }
                    else {
                        e.target.blur()
                    }
                    e.preventDefault() // prevent esc cause the entire popup to close
                    break
                case ENTER:
                    if (selectSuggest.value) {
                      onSelect(null, selectSuggest.value)
                    }
                    break
                case UP:
                    curSelectedIndex.value = curSelectedIndex.value === 0 ? searchResults.value.length - 1 : --curSelectedIndex.value
                    break
                case DOWN:
                    curSelectedIndex.value = (curSelectedIndex.value + 1) % searchResults.value.length
                    break
            }
        }
        return {
            input,
            buttons,
            buttonParent,
            open,
            selection,
            partialText,
            searchResults,
            curSelectedIndex,
            works,
            onFocus,
            onSelect,
            onInput,
            onBlur,
            onClear,
            onKeyDown
        }
    },
    components: { IpbIcon }
}
</script>

<style lang="scss">
.ipb-search {
  position: relative;
  display: inline-block;

  input {
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
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #888;
    line-height: 1;
    cursor: pointer;
    transition: transform 0.2s, color 0.2s;

    &:hover { transform: translateY(-50%) scale(1.2); color: #333; }
  }


  .ipb-style-scrollbar {
    position: absolute;
    z-index: 1;
    left: 0;
    bottom: 0;
    transform: translateY(100%);
    display: flex;
    flex-direction: column;
    min-width: 100%;
    max-height: 150px;
    overflow-y: overlay;
    background-color: #FFF;

    button {
      text-align: left;
      padding: 5px 10px 5px 4px;
      background-color: #FFF;
      white-space: nowrap;
      cursor: pointer;

      &:nth-child(2n+1) {
        background-color: #eee;
      }

      &.current {
        background-color: #555;
        color: #FFF;
      }

      &:hover {
        filter: brightness(0.8);
      }
    }
  }
}
</style>
