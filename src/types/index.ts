// ── Domain types ──────────────────────────────────────────────────────────

/** Ruby method name that can be chained */
export type RubyMethod =
  | 'chars' | 'bytes' | 'methods' | 'class'
  | 'to_s'  | 'inspect' | 'join'
  | 'size'  | 'length' | 'sum'

/** Difficulty tier */
export type Tier = '初級' | '中級' | '上級' | '上上級'

/** Result of evaluating a Ruby method chain via WASM */
export interface EvalResult {
  value: string
  type: string
  isBest: boolean
  tier: Tier | null
  code: string
  chain: RubyMethod[]
  error?: string
}

// ── WASM ──────────────────────────────────────────────────────────────────

export type WasmStatus = 'loading' | 'ready' | 'error'

export interface WasmState {
  status: WasmStatus
  version?: string
  errorMessage?: string
}

// ── Component props ───────────────────────────────────────────────────────

export interface PaletteProps {
  methods: RubyMethod[]
  usedMethods: Set<RubyMethod>
  onMethodClick: (method: RubyMethod) => void
  onMethodDragStart?: (method: RubyMethod, event: DragEvent) => void
}

export interface ChainBuilderProps {
  chain: RubyMethod[]
  onRemove: (index: number) => void
  onMove: (fromIndex: number, toIndex: number) => void
  onReset: () => void
  onDrop: (method: RubyMethod) => void
}

export interface ResultPanelProps {
  result: EvalResult
  onRetry: () => void
}

export interface RunBarProps {
  canRun: boolean
  onRun: () => void
}

// ── Answer page ───────────────────────────────────────────────────────────

export interface CandidateResult {
  label: string
  code: string
  value: string
  type: string
  error: boolean
  tier: Tier
}
