// ==UserScript==
// @name         恢复双指滑动导航
// @namespace    https://github.com/hhgzeng
// @version      1.0
// @description  解决部分网站因 CSS 拦截导致 Chrome 双指滑动导航失效的问题
// @author       hhgzeng
// @license      MIT
// @match        *://*.bilibili.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.v.qq.com/*
// @match        *://*.youku.com/*
// @match        *://*.douyin.com/*
// @match        *://*.gdut.edu.cn/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL  https://raw.githubusercontent.com/hhgzeng/tampermonkey-scripts/main/double-finger/double-finger.user.js
// @updateURL    https://raw.githubusercontent.com/hhgzeng/tampermonkey-scripts/main/double-finger/double-finger.user.js
// ==/UserScript==

(function () {
  'use strict';
  // 强制将横向滚动越界行为和触摸行为恢复为浏览器默认
  GM_addStyle('html, body { overscroll-behavior-x: auto !important; touch-action: auto !important; }');
})();