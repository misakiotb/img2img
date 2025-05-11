# img2img APIサーバ

このプロジェクトは、[code4fukui/img2img](https://github.com/code4fukui/img2img) をフォークし、画像変換（img2img）機能をAPIサーバとしてローカルで動かせるようにしたものです。

## 機能
- OpenAI GPT-Image-1 APIを利用した画像変換
- 画像とプロンプトをPOSTすることで変換画像を取得できるAPIサーバ
- サンプルCLIスクリプトも同梱

## セットアップ
1. このリポジトリをクローン
2. `.env` ファイルを作成し、OpenAI APIキーを記入
   ```
   OPENAI_API_KEY=あなたのAPIキー
   ```
3. 必要な依存（Deno）をインストール

## 使い方

### APIサーバの起動
```sh
deno run -A api_server.js
```

### APIエンドポイント
- POST `/api/convert`
    - リクエスト例（JSON）:
      ```json
      {
        "prompt": "かわいい線画にして",
        "imagePath": "test/Photo_of_koala_wearing_a_strawberry_hat.png"
      }
      ```
    - レスポンス例:
      ```json
      {
        "data": [
          { "b64_json": "..." }
        ]
      }
      ```

#### curlによるリクエスト例
```sh
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "かわいい線画にして",
    "imagePath": "test/Photo_of_koala_wearing_a_strawberry_hat.png"
  }' \
  http://localhost:5000/api/convert
```

※ レスポンスはbase64エンコード画像データ（b64_json）を含むJSONです。

### CLIでの利用
```sh
deno run -A img2img.js "かわいい線画にして" test/Photo_of_koala_wearing_a_strawberry_hat.png
```

## テスト
- `test/` ディレクトリにサンプル画像あり
- 上記のAPIまたはCLIで動作確認してください

## ライセンス
- 元リポジトリのライセンス（LICENSEファイル参照）

## 参考
- [txt2img](https://github.com/code4fukui/txt2img/)
- https://platform.openai.com/docs/guides/image-generation?image-generation-model=gpt-image-1
- https://platform.openai.com/docs/models/gpt-image-1
