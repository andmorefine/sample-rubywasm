import type { EvalResult, ResultPanelProps, Tier } from '#/types'
import { buildChainHtml, buildShareText } from '#/utils/codeHighlight'

const TIER_CLASS: Record<string, string> = {
  '初級': 'lv0', '中級': 'lv1', '上級': 'lv2', '上上級': 'lv3',
}

const X_SVG = /* html */ `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.744l7.738-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`

export function renderResultPanel(container: HTMLElement, props: ResultPanelProps): void {
  container.innerHTML = /* html */ `
    <div id="result-area" class="hidden">
      <div class="rx-card result-panel" id="result-card">
        <div style="background:var(--sky-50);border-bottom:1px solid var(--sky-200);
                    padding:8px 20px;display:flex;align-items:center;
                    justify-content:space-between;flex-wrap:wrap;gap:8px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:20px;font-weight:700;color:var(--sky-d);
                         font-family:'Noto Serif JP',Georgia,serif;line-height:1">Ⅲ</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:9px;
                         letter-spacing:.13em;text-transform:uppercase;color:var(--sky-dd);opacity:.7">
              診断結果 — @ruby/wasm-wasi
            </span>
          </div>
          <div id="result-badge" class="hidden"><span class="best-badge">処方成功 — 最大値！</span></div>
        </div>
        <div class="rx-body" style="padding-top:16px;padding-bottom:16px">
          <div style="display:flex;align-items:baseline;gap:20px;flex-wrap:wrap;margin-bottom:4px">
            <div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:9px;
                          letter-spacing:.12em;text-transform:uppercase;color:var(--sl-l);margin-bottom:4px">処方結果</div>
              <div id="result-val" style="font-family:'JetBrains Mono',monospace;
                   font-size:48px;font-weight:700;line-height:1;color:var(--sky-d)">—</div>
            </div>
            <div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:9px;
                          letter-spacing:.12em;text-transform:uppercase;color:var(--sl-l);margin-bottom:4px">型</div>
              <div id="result-type" style="font-family:'JetBrains Mono',monospace;
                   font-size:18px;font-weight:700;color:var(--vio)">—</div>
            </div>
            <div id="result-tier-wrap" class="hidden" style="align-self:center">
              <span id="result-tier" class="tier-badge lv0"></span>
            </div>
          </div>
          <div id="result-error" class="hidden font-mono text-sm px-4 py-3 rounded-lg"
               style="background:var(--red-50);border:1px solid var(--red-200);
                      color:var(--red);margin-bottom:12px"></div>
          <div class="code-block text-[.8rem]" id="result-code" style="line-height:1.85;margin-bottom:14px"></div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <button class="retry-btn" id="retry-btn">↺ 再処方</button>
            <a id="x-share-btn" href="#" target="_blank" rel="noopener" class="x-btn hidden">
              ${X_SVG} X でシェア
            </a>
          </div>
        </div>
        <div class="rx-foot">
          <div class="rx-foot-lbl">Ruby Diagnostic Clinic<br/>Prescription Result</div>
          <div class="sign-box">
            <div class="sign-name">Ruby Diagnostic Clinic</div>
            <div class="sign-title">処方機関 / Institution</div>
          </div>
          <div class="wasm-status">
            <span class="wasm-dot ready"></span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--sl-l)">診断完了</span>
          </div>
        </div>
      </div>
    </div>
  `
  container.querySelector<HTMLButtonElement>('#retry-btn')!.addEventListener('click', props.onRetry)
}

export function showResultPanel(result: EvalResult): void {
  const area  = document.getElementById('result-area')
  const card  = document.getElementById('result-card')
  const val   = document.getElementById('result-val')
  const type  = document.getElementById('result-type')
  const badge = document.getElementById('result-badge')
  const error = document.getElementById('result-error')
  const code  = document.getElementById('result-code')
  const share = document.getElementById('x-share-btn') as HTMLAnchorElement | null
  const tierEl = document.getElementById('result-tier')
  const tierWrap = document.getElementById('result-tier-wrap')
  if (!area || !card || !val || !type || !badge || !error || !code) return

  val.textContent  = result.value
  type.textContent = result.type
  val.style.color  = result.error ? 'var(--red)' : result.isBest ? 'var(--grn)' : 'var(--sky-d)'

  // Tier badge
  if (result.tier && tierEl && tierWrap) {
    tierEl.textContent = result.tier
    tierEl.className = `tier-badge ${TIER_CLASS[result.tier] ?? 'lv0'}`
    tierWrap.classList.remove('hidden')
  } else {
    tierWrap?.classList.add('hidden')
  }

  error.classList.toggle('hidden', !result.error)
  if (result.error) error.textContent = `⚠ ${result.error}`

  badge.classList.toggle('hidden', !result.isBest)
  code.innerHTML = buildChainHtml(result.chain, { value: result.value, error: result.error })

  if (share) {
    if (result.error) { share.classList.add('hidden') }
    else {
      share.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(buildShareText(result.chain, result.value, result.isBest))}`
      share.classList.remove('hidden')
    }
  }

  area.classList.remove('hidden')
  card.classList.remove('result-ok', 'result-shake')
  void card.offsetWidth
  card.classList.add(result.error ? 'result-shake' : result.isBest ? 'result-ok' : '')

  setTimeout(() => area.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
}

export function hideResultPanel(): void {
  document.getElementById('result-area')?.classList.add('hidden')
}
