import { SOURCE_STRING } from '#/utils/constants'

export function renderStepTrace(container: HTMLElement): void {
  const td = (content: string, style = '') =>
    `<td style="padding:7px 10px;border-bottom:1px solid var(--sky-50);vertical-align:top;${style}">${content}</td>`
  const mono = (s: string, color = 'var(--sky-d)') =>
    `<span style="font-family:'JetBrains Mono',monospace;color:${color}">${s}</span>`
  const type = (s: string) =>
    `<span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--vio)">${s}</span>`

  container.innerHTML = /* html */ `
    <div class="d6 ans-section">
      <div class="ans-sec-lbl">// Step-by-Step Trace — .methods.to_s.chars.inspect.bytes.sum</div>
      <div style="overflow-x:auto">
        <table class="step-table" style="width:100%;border-collapse:collapse;font-size:12px">
          <tbody>
            <tr>
              ${td(mono('0','var(--sl-l)'))}
              ${td(mono('(start)'))}
              ${td(type('String'))}
              ${td('起点の文字列','color:var(--sl-m)')}
              ${td(mono(SOURCE_STRING,'var(--sl-l)'),'max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap')}
            </tr>
            <tr>
              ${td(mono('1','var(--sl-l)'))}
              ${td(mono('.methods'))}
              ${td(type('Array&lt;Symbol&gt;'))}
              ${td('全インスタンスメソッド一覧','color:var(--sl-m)')}
              ${td(mono('[:inspect, :to_s, …]','var(--sl-l)'),'white-space:nowrap')}
            </tr>
            <tr>
              ${td(mono('2','var(--sl-l)'))}
              ${td(mono('.to_s'))}
              ${td(type('String'))}
              ${td('Array を記号込みで文字列化','color:var(--sl-m)')}
              ${td(mono('"[:inspect, :to_s…"','var(--sl-l)'),'white-space:nowrap')}
            </tr>
            <tr>
              ${td(mono('3','var(--sl-l)'))}
              ${td(mono('.chars'))}
              ${td(type('Array&lt;String&gt;'))}
              ${td('1文字ずつの配列に分割','color:var(--sl-m)')}
              ${td(mono('["[", ":", "i"…]','var(--sl-l)'),'white-space:nowrap')}
            </tr>
            <tr>
              ${td(mono('4','var(--sl-l)'))}
              ${td(mono('.inspect'))}
              ${td(type('String'))}
              ${td('クォート・エスケープ付き文字列化','color:var(--sl-m)')}
              ${td(mono('"[\\"[\\", \\":"…]"','var(--sl-l)'),'white-space:nowrap')}
            </tr>
            <tr>
              ${td(mono('5','var(--sl-l)'))}
              ${td(mono('.bytes'))}
              ${td(type('Array&lt;Integer&gt;'))}
              ${td('各文字の ASCII バイト値に変換','color:var(--sl-m)')}
              ${td(mono('[34, 91, 34…]','var(--sl-l)'),'white-space:nowrap')}
            </tr>
            <tr>
              ${td(mono('6','var(--sl-l)'))}
              ${td(mono('.sum'))}
              ${td(type('Integer'))}
              ${td('全バイト値を合計','color:var(--sl-m)')}
              ${td(`<span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--grn)" id="step-sum">…</span>`)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
}

export function updateStepSum(value: string): void {
  const el = document.getElementById('step-sum')
  if (el) el.textContent = value
}
