# domain-time-tracker
# Web閲覧時間トラッカー Chrome拡張機能

## 概要

このChrome拡張機能は、ユーザーが訪れたWebサイトの滞在時間を自動的に記録し、ドメインごとに集計します。  
日ごとの記録はChromeの拡張機能ストレージ（`chrome.storage.sync`）に保存され、ポップアップ画面から簡単に確認できます。

## 主な機能

- タブの切り替え、更新、ウィンドウフォーカスの変化を検知して、滞在時間を記録
- ドメインごとの秒単位の滞在時間を記録
- ポップアップ画面で、当日の滞在時間を降順で表示
- 記録はChromeアカウント間で同期され、複数端末で共有可能

## ファイル構成
extension/
├── background.js // イベントリスナーで滞在時間を記録
├── popup.html // ポップアップのHTML
├── popup.js // ポップアップでデータを表示
├── utils.js // ドメイン抽出などの補助関数
├── icons/ // 拡張機能用のアイコン
├── manifest.json // 拡張機能の定義ファイル
└── README.md // このファイル

## 使用技術

- JavaScript（ES6）
- Chrome Extensions API
- Storage API（`chrome.storage.sync`）

## インストール手順（ローカル）

1. このリポジトリをクローンまたはZIPダウンロードします。
2. Chromeの設定 > 拡張機能 > 「デベロッパーモード」をONにします。
3. 「パッケージ化されていない拡張機能を読み込む」から、本拡張のフォルダを選択します。
4. 拡張機能のアイコンをクリックして、滞在時間が表示されることを確認します。

## 制限事項・注意点

- 読み込み中のページ、HTTP以外のプロトコル、Chrome内部ページは記録されません。
- SPA（シングルページアプリケーション）ではURLが変わっても `onUpdated` が発火しない場合があります。
- 2秒未満の滞在時間は無視されます（ノイズ除去のため）。

## ライセンス

MIT License

## 開発者向け情報

- `background.js` にて以下のイベントで処理を行っています：
  - `chrome.tabs.onActivated`
  - `chrome.tabs.onUpdated`
  - `chrome.windows.onFocusChanged`
- `trackTime()` はイベントが発火したタイミングで滞在時間を確定・保存します。
- ポップアップは `popup.js` により、日付をキーとしたドメインごとの時間表示を行います。