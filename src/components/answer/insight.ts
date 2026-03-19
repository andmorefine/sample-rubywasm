import { INGREDIENT_NOTES } from '#/utils/candidates'
import { BEST_VALUE, SOURCE_STRING } from '#/utils/constants'

export function renderInsight(container: HTMLElement): void {
  const rows = INGREDIENT_NOTES.map(n => /* html */ `
    <tr>
      <td style="font-family:'JetBrains Mono',monospace;color:var(--sky-d);font-weight:700;
                 white-space:nowrap;padding:7px 10px;border-bottom:1px solid var(--sky-50)">.${n.method}</td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--sl-m);
                 white-space:nowrap;padding:7px 10px;border-bottom:1px solid var(--sky-50)">${n.typeChange}</td>
      <td style="font-size:12px;color:var(--sl-m);padding:7px 10px;border-bottom:1px solid var(--sky-50)">${n.effect}</td>
    </tr>
  `).join('')

  container.innerHTML = /* html */ `
    <div class="d7 ans-section">
      <div class="ans-sec-lbl">// 成分メモ — なぜ .methods.to_s.chars.inspect.bytes.sum が最大なのか？</div>

      <div style="font-size:12px;color:var(--sl-m);line-height:1.7;
                  padding:10px 14px;background:var(--sky-50);border:1px solid var(--sky-200);
                  border-radius:8px;margin-bottom:14px">
        <code style="font-family:'JetBrains Mono',monospace;color:var(--sky-d)">.bytes</code>
        で Integer の配列に変換すると、その後の
        <code style="font-family:'JetBrains Mono',monospace;color:var(--sky-d)">.sum</code>
        が「ASCII コードの ASCII コード合計」になり爆発的に大きくなります。<br>
        また <code style="font-family:'JetBrains Mono',monospace;color:var(--sky-d)">.inspect</code>
        は <code style="font-family:'JetBrains Mono',monospace;color:var(--sky-d)">.to_s</code>
        より長い文字列を生成するため（クォートやエスケープが加わる）、
        <code style="font-family:'JetBrains Mono',monospace;color:var(--sky-d)">.bytes</code>
        の要素数がさらに増加します。<br>
        ${SOURCE_STRING} の最大値は
        <strong style="color:var(--grn);font-family:'JetBrains Mono',monospace" id="insight-val">…</strong> です。
      </div>

      <div style="overflow-x:auto">
        <table class="ing-table">
          <thead>
            <tr>
              <th>成分</th><th>型の変化</th><th>効果</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `
}

export function updateInsightVal(value: string): void {
  const el = document.getElementById('insight-val')
  if (el) el.textContent = value
}
