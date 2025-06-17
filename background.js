importScripts("utils.js");

let currentTabId = null;
let currentDomain = null;
let startTime = Date.now();

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log(`タブがアクティブになった ${activeInfo.tabId}`);
  await trackTime(); // 前のタブの時間を記録
  updateCurrentTab(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`タブが更新された ${tabId}`);
  if (tab.active && changeInfo.status === 'complete') {
    updateCurrentTab(tabId);
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  console.log(`AddListnerする ${windowId}`);
  await trackTime(); // 前のタブの時間を記録
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // すべてのウィンドウが非アクティブ（例: 最小化）なら記録対象なしにする
    currentTabId = null;
    currentDomain = null;
  } else {
    // フォーカスが戻った場合、そのウィンドウのアクティブなタブ情報を取得
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs[0]) updateCurrentTab(tabs[0].id);
    });
  }
});

async function updateCurrentTab(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    // 取得に失敗 or URLがhttp/httpsでなければ無視
    if (chrome.runtime.lastError || !tab || !tab.url.startsWith('http')) return;
    currentTabId = tabId;
    currentDomain = extractDomain(tab.url);
    // 閲覧開始時間を記録
    startTime = Date.now();
    console.log(`tabId ${tabId}`);
    console.log(`currentDomain ${currentDomain}`);
    console.log(`startTime ${startTime}`);
  });
}

async function trackTime() {
  // ドメインがなければ記録しない（初期状態など）
  if (!currentDomain) return;
  const duration = Math.floor((Date.now() - startTime) / 1000); // 秒
  if (duration < 2) return;

  const today = new Date().toISOString().split('T')[0];

  console.log(`chrome.storage.sync.getする ${currentDomain}`);
  chrome.storage.sync.get([today], (data) => {
    // すでにその日の記録があれば取得、なければ空オブジェクト
    const record = data[today] || {};
    // ドメインごとの時間を加算
    record[currentDomain] = (record[currentDomain] || 0) + duration;
    console.log(`chrome.storage.sync.setする ${currentDomain}`);
    console.log(`duration ${duration}`);
    console.log(`record[currentDomain] ${record[currentDomain]}`);
    // データを保存
    chrome.storage.sync.set({ [today]: record });
  });
}

// 30秒ごとに現在のタブの閲覧時間を記録
setInterval(() => {
  trackTime();
}, 30000);