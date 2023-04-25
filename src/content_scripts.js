const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('dist/main.js'));
document.documentElement.appendChild(script);

//24小时就关闭，关闭就改变图标