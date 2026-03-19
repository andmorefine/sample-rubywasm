import { SOURCE_STRING } from '#/utils/constants'

export function renderAnswerHeader(container: HTMLElement): void {
  const d = new Date()
  const date = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`

  container.innerHTML = /* html */ `
    <div class="d1 rx-card" style="position:relative">
      <div class="rx-watermark">診断レポート</div>
      <div class="rx-head">
        <div class="rx-symbol">Rx</div>
        <div class="rx-head-center">
          <div class="rx-head-sub">Ruby Diagnostic Clinic</div>
          <div class="rx-head-title">診断結果レポート</div>
        </div>
        <div class="rx-head-stamp">No. RX-2025-001<br/>解答日: ${date}</div>
      </div>
      <div class="rx-meta">
        <div class="rx-meta-cell">
          <div class="lbl">患者</div>
          <div class="val" style="font-family:'JetBrains Mono',monospace;color:var(--sky-d)">${SOURCE_STRING}</div>
        </div>
        <div class="rx-meta-cell">
          <div class="lbl">最適処方</div>
          <div class="val" style="font-family:'JetBrains Mono',monospace">.methods.to_s.chars.inspect.bytes.sum</div>
        </div>
        <div class="rx-meta-cell"><div class="lbl">処方医</div><div class="val">Dr. Matz</div></div>
      </div>
      <div class="rx-body" style="padding-bottom:14px">
        <a href="index.html"
           style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--sl-l);
                  text-decoration:none;transition:color .14s"
           onmouseover="this.style.color='var(--sky-d)'"
           onmouseout="this.style.color='var(--sl-l)'">← 処方箋に戻る</a>
        <p style="margin-top:10px;font-size:13px;color:var(--sl-m);line-height:1.7">
          患者 <code style="font-family:'JetBrains Mono',monospace;color:var(--sky-d)">${SOURCE_STRING}</code>
          への処方を、<code style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--sky)"
          >@ruby/wasm-wasi</code> でリアルタイムに診断した結果です。
        </p>
      </div>
    </div>
  `
}
