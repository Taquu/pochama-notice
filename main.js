// --- 必要なモジュールを 1 行に ---
const { app, BrowserWindow, Tray, screen } = require('electron');
const path = require('path');

let tray, notifier;

/* キャラ用ウインドウ */
function createNotifier() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  notifier = new BrowserWindow({
    width: 320,
    height: 240,
    x: Math.round((width - 320) / 2),
    y: height,              // まずは画面外
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
    nodeIntegration: true,      // ← これで renderer から require が使える
    contextIsolation: false     // （学習フェーズでは false で OK）
    }
  });
  notifier.setIgnoreMouseEvents(true, { forward: true });
  notifier.loadFile('notifier.html');
}

/* Tray アイコン */
function setupTray() {
  tray = new Tray(path.join(__dirname, 'assets', 'iconTemplate.png'));
  tray.setToolTip('Mochi Notifier');
  tray.on('click', () => {
    console.log('tray clicked');   // ← 追加
    popUp('🍡 ポチャポチャ？');
  });
}

/* ポップアップ共通関数 */
function popUp(text) {
  const { height } = screen.getPrimaryDisplay().workAreaSize;
  notifier.webContents.send('notify', text);          // メッセージ送信
  notifier.setPosition(notifier.getPosition()[0], height - 240);  // ニョキッ
  setTimeout(() => notifier.setPosition(notifier.getPosition()[0], height), 5000); // 戻る
}

/* ───── アプリ初期化はここだけ ───── */
app.whenReady().then(() => {
  if (process.platform === 'darwin') app.dock.hide(); // Dock アイコン非表示
  createNotifier();
  setupTray();
  console.log('notifier created:', !!notifier); // true なら生成済
});

/* すべてのウインドウを閉じたら終了（mac でも終了させる場合）*/
app.on('window-all-closed', () => app.quit());
