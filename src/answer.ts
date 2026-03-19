import './styles/answer.css'

import { CANDIDATE_CHAINS } from '#/utils/candidates'
import { evalAllCandidates } from '#/wasm/answerRunner'
import { renderAnswerHeader } from '#/components/answer/answerHeader'
import { renderHeroResult, updateHeroResult } from '#/components/answer/heroResult'
import { renderBestChain, updateBestChainValue } from '#/components/answer/bestChain'
import {
  renderCandidateTable,
  updateCandidateTable,
} from '#/components/answer/candidateTable'
import { renderStepTrace, updateStepSum } from '#/components/answer/stepTrace'
import { renderInsight, updateInsightVal } from '#/components/answer/insight'

// ── Mount ──────────────────────────────────────────────────────────────────
const app = document.getElementById('app')!
app.className = 'relative min-h-screen px-4 py-14 overflow-x-hidden'

const inner = document.createElement('div')
inner.className = 'relative z-10 w-full max-w-2xl mx-auto space-y-5'
app.appendChild(inner)

function sec(): HTMLElement {
  const el = document.createElement('div')
  inner.appendChild(el)
  return el
}

// ── Render skeletons ───────────────────────────────────────────────────────
const headerSection = sec()
const heroSection = sec()
const bestChainSection = sec()
const tableSection = sec()
const traceSection = sec()
const insightSection = sec()
const footerSection = sec()

renderAnswerHeader(headerSection)
renderHeroResult(heroSection)
renderBestChain(bestChainSection)
renderCandidateTable(tableSection)
renderStepTrace(traceSection)
renderInsight(insightSection)

footerSection.innerHTML = /* html */ `
  <div class="d7 rx-card">
    <div class="rx-foot">
      <div class="rx-foot-lbl">Ruby Diagnostic Clinic<br/>Answer Report</div>
      <div class="sign-box">
        <div class="sign-name">test test</div>
        <div class="sign-title">処方医署名 / Prescriber</div>
      </div>
      <div class="wasm-status">
        <span class="wasm-dot loading" id="wasm-dot-ans"></span>
        <span id="wasm-label-ans">WASM 起動中</span>
      </div>
    </div>
  </div>
`

// ── Boot WASM & populate ───────────────────────────────────────────────────
;(async () => {
  try {
    const { results, rubyVersion } = await evalAllCandidates(CANDIDATE_CHAINS)

    // WASM status
    const dot = document.getElementById('wasm-dot-ans')
    const lbl = document.getElementById('wasm-label-ans')
    if (dot) dot.className = 'wasm-dot ready'
    if (lbl) lbl.textContent = `Ruby ${rubyVersion}`

    // Sort descending
    const sorted = [...results].sort((a, b) => {
      const na = parseFloat(a.value),
        nb = parseFloat(b.value)
      if (isNaN(na) && isNaN(nb)) return 0
      if (isNaN(na)) return 1
      if (isNaN(nb)) return -1
      return nb - na
    })

    const best = sorted[0]
    if (!best) return

    updateHeroResult(best, rubyVersion)
    updateBestChainValue(best.value)
    updateCandidateTable(results)
    updateStepSum(best.value)
    updateInsightVal(best.value)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    const dot = document.getElementById('wasm-dot-ans')
    const lbl = document.getElementById('wasm-label-ans')
    if (dot) dot.className = 'wasm-dot error'
    if (lbl) lbl.textContent = 'WASM 失敗'

    const heroNum = document.getElementById('hero-num')
    const heroDesc = document.getElementById('hero-desc')
    if (heroNum) heroNum.textContent = '—'
    if (heroDesc) heroDesc.textContent = `WASM 初期化失敗: ${msg}`

    const candBody = document.getElementById('cand-body')
    if (candBody) {
      candBody.innerHTML = /* html */ `
        <tr><td colspan="4" style="padding:16px;text-align:center;
             font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--red)">
          ⚠ Ruby WASM の読み込みに失敗しました
        </td></tr>
      `
    }
  }
})()
