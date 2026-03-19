import { SOURCE_STRING } from './constants'

export interface CandidateDef {
  label: string
  code: string
  /** 難易度ラベル */
  tier: '初級' | '中級' | '上級' | 'Matz級'
}

/**
 * 難易度別 候補チェーン（Ruby 3.2.3 実測値順）
 * 最大: "Lincwell".methods.to_s.chars.inspect.bytes.sum = 431167
 */
export const CANDIDATE_CHAINS: CandidateDef[] = [
  // 初級 〜200
  { tier: '初級', label: '.methods.size',
    code: `${SOURCE_STRING}.methods.size` },
  { tier: '初級', label: '.chars.methods.size',
    code: `${SOURCE_STRING}.chars.methods.size` },

  // 中級 201〜9999
  { tier: '中級', label: '.methods.join.size',
    code: `${SOURCE_STRING}.methods.join.size` },
  { tier: '中級', label: '.methods.to_s.size',
    code: `${SOURCE_STRING}.methods.to_s.size` },
  { tier: '中級', label: '.chars.to_s.bytes.sum',
    code: `${SOURCE_STRING}.chars.to_s.bytes.sum` },
  { tier: '中級', label: '.class.methods.join.chars.to_s.size',
    code: `${SOURCE_STRING}.class.methods.join.chars.to_s.size` },

  // 上級 1万〜9万
  { tier: '上級', label: '.methods.join.sum',
    code: `${SOURCE_STRING}.methods.join.sum` },
  { tier: '上級', label: '.methods.to_s.sum',
    code: `${SOURCE_STRING}.methods.to_s.sum` },
  { tier: '上級', label: '.chars.join.methods.to_s.inspect.sum',
    code: `${SOURCE_STRING}.chars.join.methods.to_s.inspect.sum` },
  { tier: '上級', label: '.size.methods.join.bytes.to_s.sum',
    code: `${SOURCE_STRING}.size.methods.join.bytes.to_s.sum` },

  // Matz級 9万〜
  { tier: 'Matz級', label: '.chars.size.methods.join.bytes.sum',
    code: `${SOURCE_STRING}.chars.size.methods.join.bytes.sum` },
  { tier: 'Matz級', label: '.chars.methods.join.bytes.sum',
    code: `${SOURCE_STRING}.chars.methods.join.bytes.sum` },
  { tier: 'Matz級', label: '.chars.methods.to_s.inspect.bytes.sum',
    code: `${SOURCE_STRING}.chars.methods.to_s.inspect.bytes.sum` },
  { tier: 'Matz級', label: '.methods.to_s.chars.inspect.bytes.sum',
    code: `${SOURCE_STRING}.methods.to_s.chars.inspect.bytes.sum` },
]

/** 成分メモ（answer ページ用） */
export const INGREDIENT_NOTES = [
  { method: 'chars',           typeChange: 'String → Array',         effect: 'メソッド数が増える' },
  { method: 'bytes',           typeChange: 'String/Array → Array(Integer)', effect: '.sum が爆発する' },
  { method: 'methods',         typeChange: 'any → Array(Symbol)',     effect: 'メソッド一覧を取得' },
  { method: 'class',           typeChange: 'any → Class',             effect: 'クラスオブジェクトへ' },
  { method: 'to_s',            typeChange: 'any → String',            effect: '記号込みで文字列化' },
  { method: 'inspect',         typeChange: 'any → String',            effect: 'to_s より長い（クォート等が加わる）' },
  { method: 'join',            typeChange: 'Array → String',          effect: '記号なしで文字列化（to_s より短い）' },
  { method: 'size / length',   typeChange: 'any → Integer',           effect: '個数（同値）' },
  { method: 'sum',             typeChange: 'String/Array → Integer',  effect: 'ASCII コード合計' },
] as const
