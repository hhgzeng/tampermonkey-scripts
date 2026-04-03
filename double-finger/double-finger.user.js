// ==UserScript==
// @name         恢复双指滑动导航
// @namespace    https://github.com/hhgzeng
// @version      2.0
// @description  自动检测当前站点，并允许按站点开启或关闭 Chrome 双指滑动导航修复
// @author       hhgzeng
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL  https://raw.githubusercontent.com/hhgzeng/tampermonkey-scripts/main/double-finger/double-finger.user.js
// @updateURL    https://raw.githubusercontent.com/hhgzeng/tampermonkey-scripts/main/double-finger/double-finger.user.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.self !== window.top) return;

  const STORAGE_KEY = 'site-status';
  const DEFAULT_ENABLED_SITE_RULES = new Set([
    'bilibili.com',
    'zhihu.com',
    'youku.com',
    'douyin.com',
    'gdut.edu.cn',
    'v.qq.com',
  ]);
  const SPECIAL_SITE_KEYS = new Map([
    ['v.qq.com', 'v.qq.com'],
  ]);
  const MULTI_PART_SUFFIXES = new Set([
    'ac.cn',
    'co.jp',
    'com.au',
    'com.cn',
    'com.hk',
    'com.tw',
    'edu.au',
    'edu.cn',
    'gov.cn',
    'gov.uk',
    'net.au',
    'net.cn',
    'org.au',
    'org.cn',
    'org.uk',
  ]);

  const hostname = location.hostname;
  if (!hostname) return;

  const siteKey = getSiteKey(hostname);
  const currentState = getCurrentState(siteKey);

  registerMenu(siteKey, currentState);

  if (!currentState.enabled) return;

  // 强制将横向滚动越界行为和触摸行为恢复为浏览器默认
  GM_addStyle('html, body { overscroll-behavior-x: auto !important; touch-action: auto !important; }');

  function registerMenu(currentSiteKey, state) {
    GM_registerMenuCommand(
      `${currentSiteKey}：${state.enabled ? '✅' : '❌'}`,
      () => {
        toggleSite(currentSiteKey, !state.enabled);
      },
    );
  }

  function getCurrentState(currentSiteKey) {
    const savedStatus = readSiteStatus();
    if (Object.prototype.hasOwnProperty.call(savedStatus, currentSiteKey)) {
      return {
        enabled: Boolean(savedStatus[currentSiteKey]),
        source: 'saved',
      };
    }

    return {
      enabled: DEFAULT_ENABLED_SITE_RULES.has(currentSiteKey),
      source: 'default',
    };
  }

  function toggleSite(currentSiteKey, enabled) {
    const nextStatus = readSiteStatus();
    nextStatus[currentSiteKey] = enabled;
    GM_setValue(STORAGE_KEY, nextStatus);
    location.reload();
  }

  function readSiteStatus() {
    const saved = GM_getValue(STORAGE_KEY, {});
    return isPlainObject(saved) ? saved : {};
  }

  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function getSiteKey(currentHost) {
    if (SPECIAL_SITE_KEYS.has(currentHost)) return SPECIAL_SITE_KEYS.get(currentHost);
    if (currentHost === 'localhost') return currentHost;
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(currentHost)) return currentHost;

    const parts = currentHost.split('.').filter(Boolean);
    if (parts.length <= 2) return currentHost;

    const lastTwoParts = parts.slice(-2).join('.');
    if (MULTI_PART_SUFFIXES.has(lastTwoParts) && parts.length >= 3) {
      return parts.slice(-3).join('.');
    }

    return lastTwoParts;
  }
})();
