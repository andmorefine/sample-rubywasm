import type { ChainBuilderProps, RubyMethod } from '#/types'
import { RUBY_METHODS, SOURCE_STRING } from '#/utils/constants'

/**
 * Chain Builder
 * - メソッドの追加: パレットのクリック / タップのみ
 * - 順番の並び替え: chain-item 間のドラッグ＆ドロップ
 * - 削除: ✕ ボタン
 */
export function renderChainBuilder(container: HTMLElement, props: ChainBuilderProps): void {
  container.innerHTML = /* html */ `
    <div class="d3 rx-card">
      <div class="rx-body" style="padding-top:16px;padding-bottom:16px">
        <div class="rx-sec" style="margin-bottom:10px">
          <span class="r" style="font-size:18px">Ⅱ</span>
          <span class="title">処方記入欄 — ドラッグで順番入れ替え可</span>
          <button id="reset-btn" class="rx-clear-btn" style="margin-left:auto">↺ 処方クリア</button>
        </div>
        <div class="rx-box">
          <div class="rx-box-head">
            <span>chain preview</span>
            <span style="font-size:9px;color:var(--sky-300);font-family:'JetBrains Mono',monospace">
              ドラッグで順番を入れ替えられます
            </span>
          </div>
          <div class="rx-code-area" id="chain-block"
            ><span class="t-cmt"># メソッドをタップして処方・ドラッグで並び替え</span>
<span class="t-str">${SOURCE_STRING}</span><span id="chain-inline"></span><span class="t-cmt" id="chain-comment"></span></div>
        </div>
        <div class="rx-usage">
          <div class="rx-usage-cell">
            <div class="lbl">用　法</div>
            <div class="val">上記メソッドをチェーンにて投与すること</div>
          </div>
          <div class="rx-usage-cell">
            <div class="lbl">用　量</div>
            <div class="val">各 1 回まで（重複投与禁止）</div>
          </div>
        </div>
      </div>
    </div>
  `

  container.querySelector<HTMLButtonElement>('#reset-btn')!
    .addEventListener('click', props.onReset)

  updateChainBuilder(props.chain, props.onRemove, props.onMove)
}

/**
 * chain を再描画する。
 * chain-item は draggable=true で、item 間のドラッグで並び替えを行う。
 */
export function updateChainBuilder(
  chain: RubyMethod[],
  onRemove: (i: number) => void,
  onMove: (from: number, to: number) => void,
): void {
  const inlineEl  = document.getElementById('chain-inline')
  const commentEl = document.getElementById('chain-comment')
  if (!inlineEl || !commentEl) return

  inlineEl.innerHTML = ''

  // ドラッグ状態
  let dragSrcIdx: number | null = null

  chain.forEach((m, idx) => {
    // 改行 + ドット
    inlineEl.appendChild(document.createTextNode('\n  .'))

    const item = document.createElement('span')
    item.className    = 'chain-item'
    item.draggable    = true
    item.dataset.idx  = String(idx)
    item.title        = 'ドラッグして順番を入れ替え'

    // ハンドルアイコン（左端）
    const grip = document.createElement('span')
    grip.className = 'chain-grip'
    grip.textContent = '⠿'  // braille dots – 視覚的なグリップ

    const lbl = document.createElement('span')
    lbl.textContent = m

    const rm = document.createElement('span')
    rm.className  = 'chain-item-rm'
    rm.textContent = '✕'
    rm.title       = '削除'
    rm.addEventListener('click', e => { e.stopPropagation(); onRemove(idx) })

    item.appendChild(grip)
    item.appendChild(lbl)
    item.appendChild(rm)

    // ── Desktop drag events ──────────────────────────────────────
    item.addEventListener('dragstart', (e: DragEvent) => {
      dragSrcIdx = idx
      e.dataTransfer!.effectAllowed = 'move'
      e.dataTransfer!.setData('text/plain', String(idx))
      item.classList.add('chain-dragging')
    })

    item.addEventListener('dragend', () => {
      item.classList.remove('chain-dragging')
      dragSrcIdx = null
      // drop-indicator を全除去
      inlineEl.querySelectorAll('.drop-indicator').forEach(el => el.remove())
    })

    item.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault()
      e.dataTransfer!.dropEffect = 'move'
      if (dragSrcIdx === null || dragSrcIdx === idx) return

      // drop-indicator の位置更新（自分の前か後か）
      inlineEl.querySelectorAll('.drop-indicator').forEach(el => el.remove())
      const indicator = document.createElement('span')
      indicator.className = 'drop-indicator'
      const rect  = item.getBoundingClientRect()
      const after = e.clientX > rect.left + rect.width / 2
      if (after) {
        item.insertAdjacentElement('afterend', indicator)
      } else {
        item.insertAdjacentElement('beforebegin', indicator)
      }
    })

    item.addEventListener('dragleave', () => {
      // indicator は dragover 側で管理
    })

    item.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault()
      inlineEl.querySelectorAll('.drop-indicator').forEach(el => el.remove())
      if (dragSrcIdx === null || dragSrcIdx === idx) return

      const rect  = item.getBoundingClientRect()
      const after = e.clientX > rect.left + rect.width / 2
      let toIdx   = after ? idx + 1 : idx
      // fromIndex より後ろに挿入する場合はオフセット補正
      if (dragSrcIdx < toIdx) toIdx -= 1
      if (dragSrcIdx !== toIdx) onMove(dragSrcIdx, toIdx)
      dragSrcIdx = null
    })

    // ── Touch drag (swap) ────────────────────────────────────────
    let touchStartX = 0, touchStartY = 0
    let touchGhost: HTMLElement | null = null

    item.addEventListener('touchstart', (e: TouchEvent) => {
      // ✕ ボタンのタッチは無視
      if ((e.target as HTMLElement).classList.contains('chain-item-rm')) return
      const t = e.touches[0]
      touchStartX = t.clientX
      touchStartY = t.clientY

      // ghost
      touchGhost = item.cloneNode(true) as HTMLElement
      touchGhost.style.cssText = `
        position:fixed;pointer-events:none;z-index:9999;opacity:.85;
        left:${t.clientX}px;top:${t.clientY}px;
        transform:translate(-50%,-50%) scale(1.08);
        font-family:'JetBrains Mono',monospace;font-size:.8rem;font-weight:700;
        padding:.18rem .5rem .18rem .65rem;
        background:var(--sky-100);border:1.5px solid var(--sky);
        border-radius:6px;color:var(--sky-d);white-space:nowrap;
      `
      document.body.appendChild(touchGhost)
      item.style.opacity = '0.35'
    }, { passive: true })

    item.addEventListener('touchmove', (e: TouchEvent) => {
      if (!touchGhost) return
      e.preventDefault()
      const t = e.touches[0]
      touchGhost.style.left = `${t.clientX}px`
      touchGhost.style.top  = `${t.clientY}px`

      // ドロップ候補ハイライト
      inlineEl.querySelectorAll('.chain-item').forEach(el => el.classList.remove('chain-drop-target'))
      const el = document.elementFromPoint(t.clientX, t.clientY)
      const target = el?.closest?.('.chain-item') as HTMLElement | null
      if (target && target !== item) target.classList.add('chain-drop-target')
    }, { passive: false })

    item.addEventListener('touchend', (e: TouchEvent) => {
      if (!touchGhost) return
      touchGhost.remove(); touchGhost = null
      item.style.opacity = ''
      inlineEl.querySelectorAll('.chain-item').forEach(el => el.classList.remove('chain-drop-target'))

      const t = e.changedTouches[0]
      const el = document.elementFromPoint(t.clientX, t.clientY)
      const target = el?.closest?.('.chain-item') as HTMLElement | null
      if (!target || target === item) return

      const toIdx = parseInt(target.dataset.idx ?? '-1')
      if (toIdx < 0 || toIdx === idx) return
      onMove(idx, toIdx)
    }, { passive: true })

    inlineEl.appendChild(item)
  })

  commentEl.textContent = chain.length > 0 ? '\n  # => ?' : ''
}
