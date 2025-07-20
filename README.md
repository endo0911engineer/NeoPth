# NeoPath
NeoPath は、Next.js × Go を用いて構築された、  
更生支援・メンタルケアを目的とした記録支援アプリケーションです。

## 機能一覧
- ユーザー登録（サインアップ）・ログイン（サインイン）
- ジャーナル（テキスト）の記録機能
- 感情判定（AI による感情スコア分析）
- LLM による更生アドバイス自動生成
- 過去 1 週間の感情スコアの可視化グラフ

## 技術スタック
フロントエンド：TypeScript × Next.js
バックエンド：Go
その他：Sqlite, mistral API(LLM)

## デモデータ例
1. happy を引き出す例（ポジティブな経験）
"Today was one of the best days I've had in a long time. I finally got promoted at work, and my friends surprised me with a small celebration. I feel appreciated and fulfilled."

2. anxious または frustrated を引き出す例（不安・ストレス）
"I have a big presentation tomorrow and I can’t stop worrying about messing it up. My mind keeps racing, and I haven’t been able to sleep properly all week."

3. sad を引き出す例（落ち込み）
"Lately, I’ve been feeling really down. Even the things I used to enjoy don’t make me happy anymore. I just feel tired and disconnected from everyone."

## デモ
[![Demo Video](https://img.youtube.com/vi/aJyJwGtNRt8/hqdefault.jpg)](https://www.youtube.com/watch?v=aJyJwGtNRt8)
