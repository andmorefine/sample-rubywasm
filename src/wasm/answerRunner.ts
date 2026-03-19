import type { CandidateResult, Tier } from '#/types'
import type { CandidateDef } from '#/utils/candidates'

interface RubyVM {
  eval: (code: string) => { toString: () => string }
}

declare global {
  interface Window {
    'ruby-wasm-wasi': { DefaultRubyVM: (mod: WebAssembly.Module) => Promise<{ vm: RubyVM }> }
  }
}

const WASM_CDN = 'https://cdn.jsdelivr.net/npm/@ruby/4.0-wasm-wasi@2.8.1/dist/ruby.wasm'
const WASM_UMD = 'https://cdn.jsdelivr.net/npm/@ruby/4.0-wasm-wasi@2.8.1/dist/browser.umd.js'

function loadUmdScript(): Promise<void> {
  if (window['ruby-wasm-wasi']) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = WASM_UMD
    s.onload  = () => resolve()
    s.onerror = () => reject(new Error('Failed to load ruby-wasm-wasi UMD'))
    document.head.appendChild(s)
  })
}

export interface AnswerRunResult {
  results: CandidateResult[]
  rubyVersion: string
}

export async function evalAllCandidates(candidates: CandidateDef[]): Promise<AnswerRunResult> {
  await loadUmdScript()
  const { DefaultRubyVM } = window['ruby-wasm-wasi']
  const buffer = await fetch(WASM_CDN).then(r => r.arrayBuffer())
  const mod    = await WebAssembly.compile(buffer)
  const { vm } = await DefaultRubyVM(mod)
  const rubyVersion = vm.eval('RUBY_VERSION').toString()

  const results: CandidateResult[] = candidates.map(c => {
    try {
      const value = vm.eval(c.code).toString()
      const type  = vm.eval(`(${c.code}).class.to_s`).toString()
      return { label: c.label, code: c.code, value, type, error: false, tier: c.tier as Tier }
    } catch {
      return { label: c.label, code: c.code, value: 'error', type: '—', error: true, tier: c.tier as Tier }
    }
  })

  return { results, rubyVersion }
}
