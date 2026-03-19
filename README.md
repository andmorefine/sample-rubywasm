# sample-rubywasm

Ruby メソッドチェーンクイズアプリ。  
`@ruby/wasm-wasi` でブラウザ上の Ruby を動かし、ドラッグ＆ドロップでメソッドチェーンを組み立てて実行できます。

## 技術スタック

- **Vite** — ビルド & 開発サーバー
- **TypeScript** (strict) — 型安全な実装
- **Tailwind CSS v4** (`@tailwindcss/vite`) — ユーティリティ CSS
- **@ruby/wasm-wasi** — ブラウザ内 Ruby 実行エンジン

## ページ構成

| ファイル | エントリー | 役割 |
|---|---|---|
| `index.html` | `src/main.ts` | クイズ問題ページ（DnD チェーンビルダー） |
| `answer.html` | `src/answer.ts` | 解答ページ（全候補を WASM で評価・比較） |

## ディレクトリ構成

```
src/
├── main.ts                    # クイズページ エントリー
├── answer.ts                  # 解答ページ エントリー
├── styles/
│   ├── main.css               # クイズページ スタイル（白×水色テーマ）
│   └── answer.css             # 解答ページ スタイル（ダークテーマ）
├── types/
│   └── index.ts               # 全共通型・インターフェース定義
├── utils/
│   ├── constants.ts           # RUBY_METHODS / SOURCE_STRING / BEST_VALUE
│   ├── codeHighlight.ts       # buildChainHtml / buildShareText
│   └── candidates.ts          # 解答ページ用 候補チェーン定義
├── wasm/
│   ├── rubyRunner.ts          # WASM 初期化・evalChain（クイズページ用）
│   └── answerRunner.ts        # WASM 初期化・evalAllCandidates（解答ページ用）
└── components/
    ├── header.ts              # renderHeader / updateWasmStatus
    ├── palette.ts             # renderPalette / updatePalette
    ├── chainBuilder.ts        # renderChainBuilder / updateChainBuilder
    ├── runBar.ts              # renderRunBar / updateRunBar
    ├── resultPanel.ts         # renderResultPanel / showResultPanel / hideResultPanel
    ├── touchDrag.ts           # attachTouchDrag（モバイルタッチ対応）
    └── answer/
        ├── answerHeader.ts    # 解答ページ ヘッダー
        ├── heroResult.ts      # ヒーロー数値パネル（シマー → count-up）
        ├── bestChain.ts       # ベストチェーン コードカード
        ├── candidateTable.ts  # 全候補比較テーブル（降順ソート）
        ├── stepTrace.ts       # bytes.sum ステップ解説テーブル
        └── insight.ts         # 「なぜ bytes.sum が最大か」解説カード
```

## セットアップ

```bash
npm install
npm run dev      # 開発サーバー起動 (http://localhost:5173)
npm run build    # 本番ビルド → dist/
npm run preview  # ビルド結果プレビュー (http://127.0.0.1:4173)
```

> **Note**: `@ruby/wasm-wasi` は `SharedArrayBuffer` を必要とするため、  
> 開発・プレビューサーバーは `Cross-Origin-Embedder-Policy: require-corp` ヘッダーを付与しています。

## アーキテクチャ方針

### 責務の分離

- **`types/index.ts`** — 全ページ共通の型定義。UI・WASM・ドメインを横断するインターフェース。
- **`wasm/`** — Ruby WASM の初期化と実行のみ担当。DOM に触れない純粋な非同期関数。
- **`utils/`** — 副作用のない純粋関数（文字列生成、定数定義など）。
- **`components/`** — `render*`（初回DOM生成）と `update*`（差分更新）を分離。

### コンポーネントパターン

```ts
// 初回: HTMLを生成してcontainerに挿入、イベントリスナーを登録
renderFoo(container, props)

// 再描画: 最小限のDOM更新のみ（コンテナ丸ごと再生成しない）
updateFoo(newData)
```

### 状態管理

`main.ts` が `chain: RubyMethod[]` と `wasmReady: boolean` の 2 つの状態を持ち、  
変更時に各コンポーネントの `update*` 関数を呼ぶシンプルなオーケストレーター構造。
