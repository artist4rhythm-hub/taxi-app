/* 택시 매출 관리 - Service Worker */
const CACHE = 'taxi-app-v1';

/* 앱 셸 (상대경로 + 외부 CDN 스크립트) */
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js'
];

/* 절대 캐시하면 안 되는 실시간 데이터/인증 엔드포인트 */
const NO_CACHE = /(firestore\.googleapis\.com|identitytoolkit\.googleapis\.com|securetoken\.googleapis\.com|firebaseinstallations\.googleapis\.com|firebaseio\.com|google-analytics\.com|googletagmanager\.com|www\.googleapis\.com)/i;

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // 하나가 실패해도 설치가 중단되지 않도록 개별 처리
    await Promise.all(APP_SHELL.map(async (url) => {
      try { await cache.add(new Request(url, { cache: 'reload' })); }
      catch (err) { /* CDN 일시 실패 무시 */ }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                 // 쓰기 요청은 항상 네트워크
  const url = new URL(req.url);
  if (NO_CACHE.test(url.href)) return;              // Firestore/Auth 실시간 통신은 가로채지 않음

  // 페이지(내비게이션): 네트워크 우선 → 실패 시 캐시된 index.html
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (err) {
        const cache = await caches.open(CACHE);
        return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  // 그 외 정적 자원(스크립트/아이콘 등): 캐시 우선 → 네트워크 후 캐시 저장
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    } catch (err) {
      return cached || Response.error();
    }
  })());
});
