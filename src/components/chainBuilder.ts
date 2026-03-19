import type { ChainBuilderProps, RubyMethod } from '#/types'
import { RUBY_METHODS, SOURCE_STRING } from '#/utils/constants'

export function renderChainBuilder(container: HTMLElement, props: ChainBuilderProps): void {
  container.innerHTML = /* html */ `
    <div class="d3 rx-card">
      <div class="rx-body" style="padding-top:16px;padding-bottom:16px">
        <div class="rx-sec" style="margin-bottom:10px">
          <span class="r" style="font-size:18px">Ⅱ</span>
          <span class="title">処方記入欄 — chain builder</span>
          <button id="reset-btn" class="rx-clear-btn" style="margin-left:auto">↺ 処方クリア</button>
        </div>
        <div class="rx-box">
          <div class="rx-box-head">
            <span>chain preview</span>
          </div>
          <div class="rx-code-area" id="chain-block"
            ><span class="t-cmt"># メソッドをクリックまたはドロップして処方</span>
<span class="t-str">${SOURCE_STRING}</span><span id="chain-inline"></span><span class="t-cmt" id="chain-comment"></span></div>
        </div>
        <div id="drop-zone-area"
             class="drop-zone w-full flex items-center justify-center gap-2 py-3 px-4 cursor-default mb-3">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" style="color:var(--sky-300)">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
          <span id="drop-hint" class="font-mono text-[.72rem]"
                style="color:var(--sky-300)">ここにドロップして処方</span>
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

  const resetBtn = container.querySelector<HTMLButtonElement>('#reset-btn')!
  resetBtn.addEventListener('click', props.onReset)

  const dz = container.querySelector<HTMLElement>('#drop-zone-area')!
  dz.addEventListener('dragover', e => { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; dz.classList.add('drag-active') })
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-active'))
  dz.addEventListener('drop', e => {
    e.preventDefault(); dz.classList.remove('drag-active')
    const m = e.dataTransfer?.getData('text/plain') as RubyMethod | undefined
    if (m) props.onDrop(m)
  })

  updateChainBuilder(props.chain, props.onRemove)
}

export function updateChainBuilder(chain: RubyMethod[], onRemove: (i: number) => void): void {
  const inlineEl  = document.getElementById('chain-inline')
  const commentEl = document.getElementById('chain-comment')
  const dropHint  = document.getElementById('drop-hint')
  if (!inlineEl || !commentEl) return

  inlineEl.innerHTML = ''
  chain.forEach((m, idx) => {
    inlineEl.appendChild(document.createTextNode('\n  .'))
    const item = document.createElement('span'); item.className = 'chain-item'
    const lbl  = document.createElement('span'); lbl.textContent = m
    const rm   = document.createElement('span'); rm.className = 'chain-item-rm'; rm.textContent = '✕'; rm.title = '削除'
    rm.addEventListener('click', e => { e.stopPropagation(); onRemove(idx) })
    item.appendChild(lbl); item.appendChild(rm); inlineEl.appendChild(item)
  })

  commentEl.textContent = chain.length > 0 ? '\n  # => ?' : ''
  if (dropHint) dropHint.textContent = chain.length >= RUBY_METHODS.length ? '全メソッドを投与済み' : 'ここにドロップして処方'
}
