import type { EvalResult, RubyMethod, Tier, WasmState } from '#/types'
import { BEST_VALUE, SOURCE_STRING, TIER_THRESHOLDS } from '#/utils/constants'

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

let vmInstance: RubyVM | null = null

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

export async function initRubyVM(onStateChange: (s: WasmState) => void): Promise<RubyVM | null> {
  onStateChange({ status: 'loading' })
  try {
    await loadUmdScript()
    const { DefaultRubyVM } = window['ruby-wasm-wasi']
    const buffer = await fetch(WASM_CDN).then(r => r.arrayBuffer())
    const mod    = await WebAssembly.compile(buffer)
    const { vm } = await DefaultRubyVM(mod)
    vmInstance   = vm
    const version = vm.eval('RUBY_VERSION').toString()
    onStateChange({ status: 'ready', version })
    return vm
  } catch (err) {
    onStateChange({ status: 'error', errorMessage: err instanceof Error ? err.message : String(err) })
    return null
  }
}

function calcTier(num: number): Tier | null {
  if (num <= TIER_THRESHOLDS.beginner)      return '初級'
  if (num <= TIER_THRESHOLDS.intermediate)  return '中級'
  if (num <= TIER_THRESHOLDS.advanced)      return '上級'
  return 'Matz級'
}

export function evalChain(chain: RubyMethod[]): EvalResult {
  if (!vmInstance) throw new Error('Ruby VM is not initialised')

  const chainStr = chain.map(m => `.${m}`).join('')
  const code     = `${SOURCE_STRING}${chainStr}`

  try {
    const value = vmInstance.eval(code).toString()
    const type  = vmInstance.eval(`(${code}).class.to_s`).toString()
    const num   = parseFloat(value)
    const isBest = !isNaN(num) && num >= BEST_VALUE
    const tier   = isNaN(num) ? null : calcTier(num)
    return { value, type, isBest, tier, code, chain }
  } catch (err) {
    return {
      value: 'error', type: '—', isBest: false, tier: null,
      code, chain, error: err instanceof Error ? err.message : String(err),
    }
  }
}
