// Slickスライダー
//--------------------------------------------

const $fvSlider = $('#js-fvSlider');

//ファーストビュー
if ($fvSlider.length) {
  $fvSlider.slick({
    fade: true,
    autoplay: true,
    speed: 1500,
    autoplaySpeed : 2000,
    pauseOnFocus: false,
    pauseOnHover: false,
    arrows: false,
    accessibility: false, //アクセシビリティ無効化
  });
}


// トップへ戻るボタン
//--------------------------------------------

// ヘッダー
const header = document.getElementById('js-header');
// ファーストビュー
const firstView = document.getElementById('js-firstView');
// トップへ戻るボタン
const topBtn = document.getElementById('js-topBtn');

if (firstView) {
  // ページ読み込み時
  activateTopBtn();

  // スクロールされた時
  window.addEventListener('scroll', function() {
    activateTopBtn();
  });

  function activateTopBtn() {
    const fvHeight = firstView.offsetHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    // トップへ戻るボタンの表示切り替え
    topBtn.classList.toggle('is-active', scrollY >= fvHeight);
  }
}


// ハンバーガーメニュー
//--------------------------------------------

// ハンバーガーメニューボタン
const hamburger = document.getElementById('js-hamburger');
// スマホ用メニュー
const spmenu = document.querySelector('.js-spmenu');
// 各メニューリンク
const spmenuLinks = document.querySelectorAll('.js-spmenuLink');

// ハンバーガーメニューボタンがクリックされた時
hamburger.addEventListener('click', function() {

  const expanded = this.getAttribute('aria-expanded');

  // メニューが開くとき
  if (expanded === 'false') {
    this.setAttribute('aria-expanded', 'true');
    spmenu.setAttribute('aria-hidden', 'false');
    header.classList.add('is-menu-open');
  }
  // メニューが閉じるとき
  else {
    header.classList.remove('is-menu-open');
    this.setAttribute('aria-expanded', 'false');
    spmenu.setAttribute('aria-hidden', 'true');
  }
});

// スマホ用メニューリンクがクリックされた時
spmenuLinks.forEach(link => {
  link.addEventListener('click', function() {
    // ハンバーガーメニューを閉じる
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.focus();
    spmenu.setAttribute('aria-hidden', 'true');
    header.classList.remove('is-menu-open');
  });
});


// スクロールスパイ
//--------------------------------------------

// スクロールスパイのすべての対象要素
const scrollSpyElems = document.querySelectorAll('.js-scrollSpy');
// メニュー項目数
const menuItemNum = scrollSpyElems.length;
// メニュー項目
const menuItems = document.querySelectorAll('.js-menuItem');

// スクロール位置に達している現在要素の番号
let currentIndex = -1;

// ページ読み込み時
scrollSpy();

// スクロールで発火
window.addEventListener('scroll', function() {
  scrollSpy();
});

// スクロールスパイ本処理
function scrollSpy() {

  const scrollY = window.scrollY || window.pageYOffset;
  const offset = header.offsetHeight;
  let elemTops = [];

  // 各要素の上端位置を取得
  scrollSpyElems.forEach(function(elem, i) {
    elemTops[i] = elem.getBoundingClientRect().top + scrollY;
  });

  for(let i = elemTops.length - 1; i >= 0; i--) {
    if (scrollY >= (elemTops[i] - offset)) {
      activateMenuItem(i);
      break;
    }
  }

  function activateMenuItem(index) {
    if (index === currentIndex) return;

    // 現在の要素番号を更新
    currentIndex = index;

    // 更新対象のメニュー項目番号を取得（メインメニュー・スマホ用メニュー）
    const indices = [currentIndex, currentIndex + menuItemNum]

    // スクロールスパイをリセット
    menuItems.forEach(function(item) {
      item.classList.remove('is-scroll-spy');
    });

    // メニュー項目を更新
    indices.forEach(function(index) {
      if (menuItems[index]) {
        menuItems[index].classList.add('is-scroll-spy');
      }
    });
  }
}


// 全img要素の読込み完了を監視
//--------------------------------------------
function onAllImagesLoaded(callback) {
  const images = document.querySelectorAll("img");
  let loadedCount = 0;
  let isCalled = false;

  // callback の重複実行を防ぐ
  function done() {
    if (!isCalled) {
      isCalled = true;
      callback();
    }
  }

  // 画像が無い場合は即実行
  if (images.length === 0) {
    done();
    return;
  }

  images.forEach(image => {
    // すでに読込みが完了している場合
    if (image.complete) {
      loadedCount++;
      if (loadedCount === images.length) done();
      return;
    }

    // 読込みが完了した場合
    image.addEventListener('load', function() {
      loadedCount++;
      if (loadedCount === images.length) done();
    });

    // 読込みエラーの場合
    image.addEventListener('error', function() {
      loadedCount++;
      if (loadedCount === images.length) done();
    });
  });
}


// スムーススクロール
//--------------------------------------------

// スクロールオフセット調整値（px）
const SCROLL_OFFSET_ADJUST = 20;

// ページ内スムーススクロール
document.querySelectorAll('a[href^="#"]:not([href^="#!"]').forEach(function(anchor) {
  anchor.addEventListener("click", function(event) {
    // デフォルトのイベント動作をキャンセル
    event.preventDefault();

    // 遅延読込み画像を強制的に読込むように設定
    document.querySelectorAll('img[loading="lazy"]').forEach(lazyImage => {
      lazyImage.loading = "eager";
    });

    // 画像の読み込みがすべて完了したら処理を継続
    onAllImagesLoaded(function() {

      const id = anchor.getAttribute("href");
      const target = document.querySelector(id === "#" || id === "" ? "html" : id);

      if (target) {
        const headerHeight = header.offsetHeight;
        // ターゲット要素のドキュメント全体における絶対位置からヘッダー高さを引いた位置を算出
        const position = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - SCROLL_OFFSET_ADJUST;
        // ターゲット位置までスムーススクロール
        window.scrollTo({
          top: position,
          behavior: "smooth"
        });
      }
    });
  });
});


// ローディングアニメーション
//--------------------------------------------

const body = document.body;
const main = document.querySelector('.js-main');
const footer = document.getElementById('js-footer');
const loading = document.getElementById('js-loading');
const msgLoading = document.getElementById('js-msgLoading');
let isVisited = sessionStorage.getItem('isVisited');
let scrollTop;

if(isVisited === null) {
  isVisited = false;
}

if(isVisited === false) {
  loading.classList.add('is-active'); // ローディング画面を表示
  body.setAttribute('aria-busy', 'true');
  setTimeout(function() {
    header.classList.remove('is-loading');
    main.classList.remove('is-loading');
    footer.classList.remove('is-loading');
    body.setAttribute('aria-busy', 'false');
    loading.classList.remove('is-active');
    msgLoading.textContent = '読込みが完了しました。';
    sessionStorage.setItem('isVisited', true);
  }, 2000);
  setTimeout(function() {
    loading.style.display = 'none';
  }, 2500);
} else {
  header.classList.remove('is-loading');
  main.classList.remove('is-loading');
  footer.classList.remove('is-loading');
  msgLoading.textContent = '読み込みが完了しました。';
}
