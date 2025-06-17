document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("timeList");
  const today = new Date().toISOString().split('T')[0];

  chrome.storage.sync.get([today], (data) => {
    list.innerHTML = ''; // 一度クリア

    const record = data[today];
    if (!record || Object.keys(record).length === 0) {
      list.innerHTML = '<li>データがありません</li>';
      return;
    }

    // ドメインごとの時間を表示（降順にソート）
    const sorted = Object.entries(record).sort((a, b) => b[1] - a[1]);
    for (const [domain, seconds] of sorted) {
      const li = document.createElement("li");

      const domainSpan = document.createElement("span");
      domainSpan.textContent = domain;
      domainSpan.className = "domain";

      const timeSpan = document.createElement("span");
      timeSpan.textContent = formatTime(seconds);
      timeSpan.className = "time";

      li.appendChild(domainSpan);
      li.appendChild(timeSpan);
      list.appendChild(li);
    }
  });
});

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  if(h!=='00'){
    return `${h}時間${m}分${s}秒`;
  }else if(m!=='00'){
    return `${m}分${s}秒`;
  }else{
    return `${s}秒`;
  }
}