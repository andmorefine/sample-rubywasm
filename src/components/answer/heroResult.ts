import type { CandidateResult } from '#/types'

export function renderHeroResult(container: HTMLElement): void {
  container.innerHTML = /* html */ `
    <div class="d3 hero-card">
      <div class="hero-lbl">// Ruby WASM — Best Return Value</div>
      <div id="hero-num" class="hero-num">
        <span class="shimmer" style="display:inline-block;width:200px;height:60px;vertical-align:middle"></span>
      </div>
      <div id="hero-desc" class="hero-desc">Ruby WASM を初期化中…</div>
      <div id="hero-ver" class="hero-ver" style="display:none"></div>
    </div>
  `
}

export function updateHeroResult(best: CandidateResult, rubyVersion: string): void {
  const numEl  = document.getElementById('hero-num')
  const descEl = document.getElementById('hero-desc')
  const verEl  = document.getElementById('hero-ver')
  if (numEl) {
    numEl.innerHTML = ''
    const sp = document.createElement('span'); sp.className = 'count-anim'; sp.textContent = best.value
    numEl.appendChild(sp)
  }
  if (descEl) descEl.textContent = `${best.label} — 全バイト値の合計`
  if (verEl) { verEl.textContent = `Ruby ${rubyVersion} on WebAssembly`; verEl.style.display = 'inline-block' }
}
