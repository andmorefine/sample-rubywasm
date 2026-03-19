import type { RunBarProps } from '#/types'

export function renderRunBar(container: HTMLElement, props: RunBarProps): void {
  container.innerHTML = /* html */ `
    <div class="d4 flex items-center gap-4 flex-wrap" id="run-row">
      <button id="run-btn" class="run-btn" ${props.canRun ? '' : 'disabled'}>
        ▶ 処方を実行（Ruby で診断）
      </button>
      <a href="answer.html" class="answer-link">解答・解説を見る →</a>
    </div>
  `
  container.querySelector<HTMLButtonElement>('#run-btn')!.addEventListener('click', props.onRun)
}

export function updateRunBar(canRun: boolean, label?: string): void {
  const btn = document.getElementById('run-btn') as HTMLButtonElement | null
  if (!btn) return
  btn.disabled = !canRun
  if (label) btn.textContent = label
}
