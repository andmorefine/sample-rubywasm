import type { WasmState } from '#/types'

const LABEL_MAP: Record<WasmState['status'], string> = {
  loading: 'WASM 起動中…', ready: '', error: 'WASM 失敗',
}

export function renderHeader(container: HTMLElement): void {
  const d = new Date()
  const date = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`

  container.innerHTML = /* html */ `
    <div class="d1 rx-card" id="page-top" style="position:relative">
      <div class="rx-watermark">処　方　箋</div>
      <div class="rx-head">
        <div class="rx-symbol">Rx</div>
        <div class="rx-head-center">
          <div class="rx-head-sub">Ruby Diagnostic Clinic</div>
          <div class="rx-head-title">処　方　箋</div>
        </div>
        <div class="rx-head-stamp">No. RX-2025-001<br/>処方日: ${date}</div>
      </div>
      <div class="rx-meta">
        <div class="rx-meta-cell"><div class="lbl">診断名</div><div class="val">Ruby 力不足症</div></div>
        <div class="rx-meta-cell"><div class="lbl">目標</div><div class="val">最大整数の取得</div></div>
        <div class="rx-meta-cell"><div class="lbl">処方医</div><div class="val">Dr. Matz</div></div>
      </div>
      <div class="rx-body" style="padding-bottom:18px">
        <div class="rx-patient">
          <span class="lbl">患者</span>
          <span class="name">"Lincwell"</span>
          <span class="desc">String オブジェクト</span>
        </div>
        <p style="font-size:13px;color:var(--sl-m);line-height:1.7;
                  padding:10px 14px;background:var(--sky-50);
                  border-left:3px solid var(--sky-d);border-radius:0 8px 8px 0">
          あなたの Ruby 力を診断します。<br>
          <strong style="font-family:'JetBrains Mono',monospace;color:var(--sky-d)">"Lincwell"</strong>
          を起点に、最大の整数を返すメソッドチェーンを処方してください。
        </p>
      </div>
    </div>
  `
}

export function updateWasmStatus(state: WasmState): void {
  const dot   = document.getElementById('wasm-dot')
  const label = document.getElementById('wasm-label')
  if (!dot || !label) return
  dot.className = `wasm-dot ${state.status}`
  label.textContent = state.status === 'ready' && state.version
    ? `Ruby ${state.version}` : LABEL_MAP[state.status]
}
