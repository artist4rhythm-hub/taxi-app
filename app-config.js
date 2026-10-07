/* ════════════════════════════════════════════════════════════
   황금기사 (Gold Knight) · 설정 파일 — 예전 앱(driver-leemoojong) 연결용
   새 Firebase 프로젝트를 만들면 이 파일만 고치면 됩니다.
   (index.html은 건드리지 않아도 돼요)
   ════════════════════════════════════════════════════════════ */
window.APP_CONFIG = {

  // ① Firebase 콘솔 > 프로젝트 설정 > 내 앱(웹) > "SDK 설정 및 구성"의 값을 그대로 붙여넣기
  firebase: {
    apiKey: "AIzaSyCG5PqWKzsJQADzebyPbDxN2IPsfazGDv0",
    authDomain: "driver-leemoojong.firebaseapp.com",
    projectId: "driver-leemoojong",
    storageBucket: "driver-leemoojong.firebasestorage.app",
    messagingSenderId: "670178767270",
    appId: "1:670178767270:web:567f8ad68848deb2a69f67"
  },

  // ② 관리자 이메일 (보안 규칙의 이메일과 같아야 함)
  adminEmail: "artist4rhythm@gmail.com",

  // ③ App Check(복제 사이트 차단) reCAPTCHA v3 사이트 키 — 비워두면 꺼짐
  appCheckSiteKey: "",

  // ④ 사업자 정보 (통신판매업 신고 후 채우기)
  biz: {
    name:   "[상호]",
    owner:  "[대표자]",
    regNo:  "[사업자등록번호]",
    mailNo: "[통신판매업 신고번호]",
    addr:   "[사업장 주소]",
    tel:    "[고객센터 전화]",
    email:  "[고객센터 이메일]"
  }
};
