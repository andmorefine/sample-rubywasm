import type { PaletteProps, RubyMethod } from '#/types'

/**
 * パレット — クリック / タップのみで投与。
 * ドラッグは chain-item 間の並び替え専用のため、ここでは draggable を付けない。
 */
export function renderPalette(container: HTMLElement, props: PaletteProps): void {
  container.innerHTML = /* html */ `
    <div class="d2 rx-card">
      <div class="rx-body" style="padding-top:16px;padding-bottom:16px">
        <div class="rx-sec">
          <span class="r">℞</span>
          <span class="title">処方メソッド — タップして投与（各 1 回まで）</span>
          <span class="counter" id="used-count">0 / ${props.methods.length} 投与済</span>
        </div>
        <div id="palette" class="flex flex-wrap gap-2 mt-2"></div>
      </div>
    </div>
  `
  const el = container.querySelector<HTMLElement>('#palette')!
  props.methods.forEach(m => el.appendChild(createPill(m, props)))
}

function createPill(method: RubyMethod, props: PaletteProps): HTMLElement {
  const el = document.createElement('span')
  el.className = 'pill'
  el.textContent = `.${method}`
  el.dataset.method = method
  // draggable は false — パレットからのドラッグは廃止
  el.draggable = false

  el.addEventListener('click', () => {
    if (!el.classList.contains('used')) props.onMethodClick(method)
  })

  // タッチデバイスでも確実に反応させる（click と競合しない）
  el.addEventListener('touchend', (e: TouchEvent) => {
    if (el.classList.contains('used')) return
    e.preventDefault()
    props.onMethodClick(method)
  }, { passive: false })

  return el
}

export function updatePalette(usedMethods: Set<RubyMethod>, total: number): void {
  document.querySelectorAll<HTMLElement>('#palette .pill').forEach(el =>
    el.classList.toggle('used', usedMethods.has(el.dataset.method as RubyMethod))
  )
  const c = document.getElementById('used-count')
  if (c) c.textContent = `${usedMethods.size} / ${total} 投与済`
}
