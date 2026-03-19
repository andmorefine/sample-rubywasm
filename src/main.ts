import './styles/main.css'

import type { RubyMethod, WasmState } from '#/types'
import { RUBY_METHODS } from '#/utils/constants'
import { initRubyVM, evalChain } from '#/wasm/rubyRunner'
import { renderHeader, updateWasmStatus } from '#/components/header'
import { renderPalette, updatePalette } from '#/components/palette'
import { renderChainBuilder, updateChainBuilder } from '#/components/chainBuilder'
import { renderRunBar, updateRunBar } from '#/components/runBar'
import {
  renderResultPanel,
  showResultPanel,
  hideResultPanel,
} from '#/components/resultPanel'
import { attachTouchDrag } from '#/components/touchDrag'

let chain: RubyMethod[] = []
let wasmReady = false

const app = document.getElementById('app')!
app.className = 'relative min-h-screen px-4 py-14 overflow-x-hidden'

function sec(id: string): HTMLElement {
  const el = document.createElement('div')
  el.id = id
  return el
}

const headerSection = sec('section-header')
const paletteSection = sec('section-palette')
const builderSection = sec('section-builder')
const runBarSection = sec('section-runbar')
const resultSection = sec('section-result')
const footerSection = sec('section-footer')

const inner = document.createElement('div')
inner.className = 'relative z-10 w-full max-w-2xl mx-auto space-y-5'
inner.append(
  headerSection,
  paletteSection,
  builderSection,
  runBarSection,
  resultSection,
  footerSection,
)
app.appendChild(inner)

function handleMethodAdd(method: RubyMethod): void {
  if (chain.includes(method)) return
  chain.push(method)
  syncChain()
}
function handleMethodRemove(index: number): void {
  chain.splice(index, 1)
  syncChain()
}
function handleReset(): void {
  chain = []
  syncChain()
  hideResultPanel()
}
function handleRetry(): void {
  chain = []
  syncChain()
  hideResultPanel()
  document
    .getElementById('page-top')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function handleRun(): void {
  if (!wasmReady || chain.length === 0) return
  showResultPanel(evalChain(chain))
}

function syncChain(): void {
  updateChainBuilder(chain, handleMethodRemove)
  updatePalette(new Set(chain), RUBY_METHODS.length)
  updateRunBar(wasmReady && chain.length > 0)
}

renderHeader(headerSection)
renderPalette(paletteSection, {
  methods: RUBY_METHODS,
  usedMethods: new Set(),
  onMethodClick: handleMethodAdd,
})

document.querySelectorAll<HTMLElement>('#palette .pill').forEach((el) => {
  attachTouchDrag(el, el.dataset.method as RubyMethod, handleMethodAdd)
})

renderChainBuilder(builderSection, {
  chain,
  onRemove: handleMethodRemove,
  onReset: handleReset,
  onDrop: handleMethodAdd,
})
renderRunBar(runBarSection, { canRun: false, onRun: handleRun })
renderResultPanel(resultSection, {
  result: { value: '', type: '', isBest: false, tier: null, code: '', chain: [] },
  onRetry: handleRetry,
})

footerSection.innerHTML = /* html */ `
  <div class="d6 rx-card">
    <div class="rx-foot">
      <div class="rx-foot-lbl">Ruby Diagnostic Clinic<br/>Prescription Form</div>
      <div class="sign-box">
        <div class="sign-name">test test</div>
        <div class="sign-title">処方医署名 / Prescriber</div>
      </div>
      <div class="wasm-status">
        <span class="wasm-dot loading" id="wasm-dot"></span>
        <span id="wasm-label">WASM 起動中</span>
      </div>
    </div>
  </div>
`

updateRunBar(false, '⏳ WASM 初期化中…')

initRubyVM((state: WasmState) => {
  updateWasmStatus(state)
  if (state.status === 'ready') {
    wasmReady = true
    updateRunBar(chain.length > 0, '▶ 処方を実行（Ruby で診断）')
  } else if (state.status === 'error') {
    updateRunBar(false, '⚠ WASM 読み込み失敗')
  }
})
