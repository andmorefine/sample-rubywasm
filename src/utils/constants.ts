import type { RubyMethod } from '#/types'

export const RUBY_METHODS: RubyMethod[] = [
  'chars', 'bytes', 'methods', 'class',
  'to_s', 'inspect', 'join', 'size', 'length', 'sum',
]

export const SOURCE_STRING = '"Lincwell"'

/**
 * 正解: "Lincwell".methods.to_s.chars.inspect.bytes.sum = 431167
 * 各1回ずつ使用可能なメソッドの組み合わせで得られる最大値
 */
export const BEST_VALUE = 431167

/** 難易度しきい値 */
export const TIER_THRESHOLDS = {
  beginner: 200,
  intermediate: 9999,
  advanced: 90000,
} as const
