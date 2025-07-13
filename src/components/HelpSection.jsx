import React from 'react'

const HelpSection = ({ isExtension }) => {
  return (
    <div className="card-slack p-slack-xl">
      <h2 className="text-xl font-semibold text-slack-text-primary mb-slack-lg">
        使用方法とヘルプ
      </h2>
      
      <div className="space-y-slack-lg">
        {/* Extension Info */}
        {isExtension && (
          <div className="bg-blue-50 border border-blue-200 rounded-slack p-slack-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-slack-sm">
              Chrome拡張機能について
            </h3>
            <p className="text-sm text-blue-700 mb-slack-sm">
              この拡張機能はSlackページで自動的に動作し、CORS制限を回避します。
            </p>
            <ul className="text-xs text-blue-700 space-y-slack-sm">
              <li>• <strong>現在のメッセージ情報を取得</strong>ボタンで、Slackページのメッセージ情報を自動取得</li>
              <li>• 自動スタンプ機能はバックグラウンドで動作</li>
              <li>• トークンは安全にChromeストレージに保存</li>
            </ul>
          </div>
        )}

        {/* Auto Mode */}
        <div>
          <h3 className="text-lg font-medium text-slack-text-primary mb-slack-md">
            自動スタンプ機能について
          </h3>
          <div className="bg-slack-surface p-slack-lg rounded-slack">
            <p className="text-sm text-slack-text-secondary mb-slack-md">
              自動モードが有効の場合、以下のルールに基づいてメッセージに自動的にリアクションを追加します：
            </p>
            <ul className="text-sm text-slack-text-secondary space-y-slack-sm">
              <li>• <strong>@all または @channel</strong> → 注意喚起系絵文字（:eyes:, :alert:, :loudspeaker:）</li>
              <li>• <strong>ポジティブなキーワード</strong>（お疲れ様、助かりました、ありがとう）→ ポジティブ系絵文字（:clap:, :pray:, :thumbsup:）</li>
            </ul>
            <p className="text-xs text-slack-text-tertiary mt-slack-md">
              リアクションは5-15分のランダムな遅延後に送信され、同じメッセージには1回のみ反応します。
            </p>
          </div>
        </div>

        {/* Manual Mode */}
        <div>
          <h3 className="text-lg font-medium text-slack-text-primary mb-slack-md">
            手動リアクション追加
          </h3>
          <div className="space-y-slack-md">
            <div>
              <h4 className="text-sm font-medium text-slack-text-primary">OAuth アクセストークンの取得</h4>
              <ol className="text-sm text-slack-text-secondary mt-slack-sm space-y-slack-sm">
                <li>1. Slack App を作成（<a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-slack-primary hover:underline">api.slack.com/apps</a>）</li>
                <li>2. OAuth & Permissions で <code className="bg-gray-100 px-1 rounded">reactions:write</code> スコープを追加</li>
                <li>3. アプリをワークスペースにインストール</li>
                <li>4. Bot User OAuth Token をコピー</li>
              </ol>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slack-text-primary">チャンネルIDの取得</h4>
              <p className="text-sm text-slack-text-secondary mt-slack-sm">
                チャンネル名を右クリック → 「チャンネルの詳細を表示」→ チャンネルIDをコピー（C1234567890形式）
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slack-text-primary">メッセージタイムスタンプの取得</h4>
              <p className="text-sm text-slack-text-secondary mt-slack-sm">
                メッセージを右クリック → 「リンクをコピー」→ URLの最後の部分（1234567890.123456形式）
              </p>
              {isExtension && (
                <p className="text-xs text-slack-success mt-slack-sm">
                  ✓ 拡張機能では「現在のメッセージ情報を取得」ボタンで自動取得可能
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        {isExtension && (
          <div>
            <h3 className="text-lg font-medium text-slack-text-primary mb-slack-md">
              拡張機能のインストール方法
            </h3>
            <div className="bg-slack-surface p-slack-lg rounded-slack">
              <ol className="text-sm text-slack-text-secondary space-y-slack-sm">
                <li>1. Chrome拡張機能ページ（chrome://extensions/）を開く</li>
                <li>2. 「デベロッパーモード」を有効にする</li>
                <li>3. 「パッケージ化されていない拡張機能を読み込む」をクリック</li>
                <li>4. このプロジェクトの <code className="bg-gray-100 px-1 rounded">dist</code> フォルダを選択</li>
                <li>5. Slackページで拡張機能アイコンをクリックして使用開始</li>
              </ol>
            </div>
          </div>
        )}

        {/* Security Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-slack p-slack-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-slack-sm">
            セキュリティについて
          </h3>
          <p className="text-sm text-blue-700">
            {isExtension 
              ? 'この拡張機能はChromeストレージにトークンを安全に保存し、すべての処理はローカルで実行されます。'
              : 'このツールは完全にクライアントサイドで動作し、トークンやデータはサーバーに送信されません。'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default HelpSection 