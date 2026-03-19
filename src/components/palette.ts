import type { PaletteProps, RubyMethod } from '#/types'

export function renderPalette(container: HTMLElement, props: PaletteProps): void {
  container.innerHTML = /* html */ `
    <div class="d2 rx-card">
      <div class="rx-body" style="padding-top:16px;padding-bottom:16px">
        <div class="rx-sec">
          <span class="r">℞</span>
          <span class="title">処方メソッド — クリックまたはドラッグで投与（各 1 回まで）</span>
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
  el.className = 'pill'; el.textContent = `.${method}`
  el.dataset.method = method; el.draggable = true

  el.addEventListener('click', () => { if (!el.classList.contains('used')) props.onMethodClick(method) })
  el.addEventListener('dragstart', (e: DragEvent) => {
    if (el.classList.contains('used')) { e.preventDefault(); return }
    e.dataTransfer?.setData('text/plain', method)
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copy'
    el.classList.add('dragging')
    props.onMethodDragStart?.(method, e)
  })
  el.addEventListener('dragend', () => el.classList.remove('dragging'))
  return el
}

export function updatePalette(usedMethods: Set<RubyMethod>, total: number): void {
  document.querySelectorAll<HTMLElement>('#palette .pill').forEach(el =>
    el.classList.toggle('used', usedMethods.has(el.dataset.method as RubyMethod))
  )
  const c = document.getElementById('used-count')
  if (c) c.textContent = `${usedMethods.size} / ${total} 投与済`
}
