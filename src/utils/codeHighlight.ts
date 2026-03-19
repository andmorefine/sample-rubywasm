import type { RubyMethod } from '#/types'
import { SOURCE_STRING } from './constants'

export function buildChainHtml(
  chain: RubyMethod[],
  result?: { value: string; error?: string },
): string {
  let html = `<span class="t-str">${SOURCE_STRING}</span>`
  chain.forEach(m => { html += `\n  .<span class="t-met">${m}</span>` })
  if (result) {
    if (result.error) {
      html += `\n<span class="t-cmt"># =&gt; </span><span class="t-err">RuntimeError</span>`
    } else {
      html += `\n<span class="t-cmt"># =&gt; </span><span class="t-res">${result.value}</span>`
    }
  } else if (chain.length > 0) {
    html += `\n<span class="t-cmt">  # =&gt; ?</span>`
  }
  return html
}

export function buildShareText(chain: RubyMethod[], value: string, isBest: boolean): string {
  const chainStr = chain.map(m => `.${m}`).join('')
  const emoji = isBest ? '処方成功！ Ruby 力診断クリア！' : '💊'
  return [
    `${emoji} Ruby 処方箋クイズ`,
    `${SOURCE_STRING}${chainStr}`,
    `# => ${value}`,
    '',
    '#Ruby #WebAssembly #RubyWASM #処方箋',
  ].join('\n')
}
