// ==UserScript==
// @name         豆包网页版黑暗主题
// @namespace    https://github.com/hhgzeng
// @description  豆包网页版全局强制黑暗主题
// @version      1.0
// @author       hhgzeng
// @license      MIT
// @match        https://*.doubao.com/*
// @grant        none
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/hhgzeng/tampermonkey-scripts/main/doubao-dark/doubao-dark.user.js
// @updateURL    https://raw.githubusercontent.com/hhgzeng/tampermonkey-scripts/main/doubao-dark/doubao-dark.user.js
// ==/UserScript==

(() => {
  const raw = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (key, val) {
    if (this === document.documentElement && key === 'data-theme') {
      val = 'dark';
      console.log('【油猴】[Doubao-Dark] 强制锁定 data-theme = dark');
    }
    return raw.call(this, key, val);
  };
})();