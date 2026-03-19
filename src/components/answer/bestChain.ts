import { SOURCE_STRING } from '#/utils/constants'

export function renderBestChain(container: HTMLElement): void {
  container.innerHTML = /* html */ `
    <div class="d4 ans-section" style="border-left:3px solid var(--sky-d)">
      <div class="ans-sec-lbl">// 最適処方チェーン — Matz 級</div>
      <div class="code-block">
        <span class="t-cmt"># 最大整数を返すメソッドチェーン</span><br/>
        <span class="t-str">${SOURCE_STRING}</span><br/>
        &nbsp;&nbsp;.<span class="t-met">methods</span>&nbsp;&nbsp;<span class="t-cmt"># => Array&lt;Symbol&gt; (全メソッド一覧)</span><br/>
        &nbsp;&nbsp;.<span class="t-met">to_s</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="t-cmt"># => "[...記号込みの長い文字列...]"</span><br/>
        &nbsp;&nbsp;.<span class="t-met">chars</span>&nbsp;&nbsp;&nbsp;<span class="t-cmt"># => Array&lt;String&gt;</span><br/>
        &nbsp;&nbsp;.<span class="t-met">inspect</span>&nbsp;<span class="t-cmt"># => "[\"[\", \":\", ...]"（クォート等が加わる）</span><br/>
        &nbsp;&nbsp;.<span class="t-met">bytes</span>&nbsp;&nbsp;&nbsp;<span class="t-cmt"># => Array&lt;Integer&gt;（ASCII コード列）</span><br/>
        &nbsp;&nbsp;.<span class="t-met">sum</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="t-cmt"># => </span><span class="t-res" id="best-inline">…</span>
      </div>
    </div>
  `
}

export function updateBestChainValue(value: string): void {
  const el = document.getElementById('best-inline')
  if (el) el.textContent = value
}
