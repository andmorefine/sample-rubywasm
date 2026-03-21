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

// ── Callbacks ──────────────────────────────────────────────────────────────

function handleMethodAdd(method: RubyMethod): void {
  if (chain.includes(method)) return
  chain.push(method)
  syncChain()
}

function handleMethodRemove(index: number): void {
  chain.splice(index, 1)
  syncChain()
}

/** chain[from] を chain[to] の位置へ移動 */
function handleMethodMove(from: number, to: number): void {
  if (from < 0 || to < 0 || from >= chain.length || to >= chain.length || from === to)
    return
  const [moved] = chain.splice(from, 1)
  chain.splice(to, 0, moved)
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

// ── Sync ───────────────────────────────────────────────────────────────────

function syncChain(): void {
  updateChainBuilder(chain, handleMethodRemove, handleMethodMove)
  updatePalette(new Set(chain), RUBY_METHODS.length)
  updateRunBar(wasmReady && chain.length > 0)
}

// ── Initial render ─────────────────────────────────────────────────────────

renderHeader(headerSection)

renderPalette(paletteSection, {
  methods: RUBY_METHODS,
  usedMethods: new Set(),
  onMethodClick: handleMethodAdd,
})

renderChainBuilder(builderSection, {
  chain,
  onRemove: handleMethodRemove,
  onMove: handleMethodMove,
  onReset: handleReset,
  onDrop: handleMethodAdd, // 将来的な拡張用（現在未使用）
})

renderRunBar(runBarSection, { canRun: false, onRun: handleRun })

renderResultPanel(resultSection, {
  result: { value: '', type: '', isBest: false, tier: null, code: '', chain: [] },
  onRetry: handleRetry,
})

// ── Footer ─────────────────────────────────────────────────────────────────
footerSection.innerHTML = /* html */ `
  <div class="d6 rx-card">
    <div class="rx-foot">
      <div class="rx-foot-lbl">Ruby Diagnostic Clinic<br/>Prescription Form</div>
      <div class="sign-box">
        <div class="sign-name">Ruby Diagnostic Clinic</div>
        <div class="sign-title">処方機関 / Institution</div>
      </div>
      <div class="wasm-status">
        <span class="wasm-dot loading" id="wasm-dot"></span>
        <span id="wasm-label">WASM 起動中</span>
      </div>
    </div>
  </div>
`

// ── Boot WASM ──────────────────────────────────────────────────────────────
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
