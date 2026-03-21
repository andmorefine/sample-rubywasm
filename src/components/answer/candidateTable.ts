import type { CandidateResult, Tier } from '#/types'

const TIER_CLASS: Record<Tier, string> = {
  '初級': 'tier-0', '中級': 'tier-1', '上級': 'tier-2', '上上級': 'tier-3',
}

const SHIMMER_ROWS = Array.from({length:5}, (_,i) => {
  const w = ['w-full','w-4/5','w-3/4','w-5/6','w-2/3'][i]
  return `<tr><td colspan="4" class="px-3 py-2"><div class="shimmer h-3 ${w}"></div></td></tr>`
}).join('')

export function renderCandidateTable(container: HTMLElement): void {
  container.innerHTML = /* html */ `
    <div class="d5 ans-section">
      <div class="ans-sec-lbl">// 全候補チェーン — Live Results（降順）</div>
      <div style="overflow-x:auto">
        <table class="cand-table">
          <thead>
            <tr>
              <th>難易度</th>
              <th>Chain</th>
              <th>Type</th>
              <th style="text-align:right">Result</th>
            </tr>
          </thead>
          <tbody id="cand-body">${SHIMMER_ROWS}</tbody>
        </table>
      </div>
    </div>
  `
}

export function updateCandidateTable(rows: CandidateResult[]): void {
  const tbody = document.getElementById('cand-body')
  if (!tbody) return
  tbody.innerHTML = ''

  const sorted = [...rows].sort((a, b) => {
    const na = parseFloat(a.value), nb = parseFloat(b.value)
    if (isNaN(na) && isNaN(nb)) return 0
    if (isNaN(na)) return 1; if (isNaN(nb)) return -1
    return nb - na
  })

  sorted.forEach((r, i) => {
    const tr = document.createElement('tr')
    if (i === 0) tr.className = 'best-row'
    const lc = i === 0 ? 'var(--sky-d)' : 'var(--sl-m)'
    const vc = i === 0 ? 'var(--grn)'  : 'var(--sl)'
    const fw = i === 0 ? '700' : ''
    const badge = i === 0
      ? `<span style="margin-left:6px;font-size:9px;font-family:'JetBrains Mono',monospace;font-weight:700;
                      padding:1px 7px;border-radius:3px;background:var(--sky-100);color:var(--sky-dd)">← MAX</span>`
      : ''
    tr.innerHTML = /* html */ `
      <td><span class="tier-badge ${TIER_CLASS[r.tier]}">${r.tier}</span></td>
      <td style="font-family:'JetBrains Mono',monospace;color:${lc};font-weight:${fw}">${r.label}${badge}</td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--vio)">${r.type}</td>
      <td style="text-align:right;font-family:'JetBrains Mono',monospace;color:${vc};font-weight:${fw}">
        ${r.error ? `<span style="color:var(--red)">error</span>` : r.value}
      </td>
    `
    tbody.appendChild(tr)
  })
}
