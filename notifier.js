const { ipcRenderer } = require('electron');

// popUp() から送られてくる 'notify' イベントを受信
ipcRenderer.on('notify', (_, text) => {
    const wrap = document.getElementById('wrap');
    const msg  = document.getElementById('msg');

    msg.textContent = text;
    wrap.classList.add('show');                           // ニョキッ

    window.speechSynthesis.cancel();                      // 連続クリック対策
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));

    // 5 秒後、CSS を外して下へ戻す
    setTimeout(() => wrap.classList.remove('show'), 5000);
});