document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname
  const navLinks = document.querySelectorAll('.global-nav a')

  // data-path-prefixから取得（なければ空文字）
  const pathPrefix =
    document.querySelector('.global-nav')?.dataset?.pathPrefix || ''

  // パスを正規化（pathPrefix除去＋末尾スラッシュ除去）
  const normalizePath = path => {
    let p = path.replace(new RegExp(`^${pathPrefix}`), '')
    p = p.replace(/\/$/, '')
    return p.split('/').filter(Boolean)
  }

  const currentSegments = normalizePath(currentPath)

  navLinks.forEach(link => {
    const href = link.getAttribute('href')
    if (!href || href.startsWith('#')) return

    // リンクの親の <li> 要素を取得
    const listItem = link.closest('li')
    if (!listItem) return

    const linkSegments = normalizePath(href)
    const linkJoined = linkSegments.join('/')
    const currentJoined = currentSegments.join('/')

    // HOMEリンクは特別扱い（完全一致のみ）
    if (linkSegments.length === 0) {
      if (currentSegments.length === 0) {
        // li に active, active-group を付与
        listItem.classList.add('active', 'active-group')
      }
      return
    }

    // 通常リンクの判定
    const isExactMatch = linkJoined === currentJoined
    const isParent =
      currentJoined.startsWith(linkJoined + '/') &&
      currentSegments.length > linkSegments.length &&
      linkSegments.length > 0 // HOMEは除外

    if (isExactMatch) {
      // 完全に一致した場合
      listItem.classList.add('active')

      // 第一階層の li（global-nav > ul > li）を探して active-group を付ける
      const topLevelLi = listItem.closest('.global-nav > ul > li')
      if (topLevelLi) {
        topLevelLi.classList.add('active-group')
      }
    } else if (isParent) {
      // 親要素の場合は第一階層だけに active-group
      const topLevelLi = listItem.closest('.global-nav > ul > li')
      if (topLevelLi) {
        topLevelLi.classList.add('active-group')
      }
    }
  })
})

// ----------------------------------------------------
// JavaScript for Smart Hiding Header (Hiding on scroll down, showing on scroll up)
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header')

  // ヘッダー要素が存在しない場合は処理を終了
  if (!header) {
    console.warn("Header element with class '.header' not found.")
    return
  }

  // 最後のスクロール位置を保持するための変数
  let lastScrollY = window.scrollY

  // ヘッダーが表示/非表示を切り替えるトリガーとなるスクロール量
  // ページトップからこの値以上スクロールしないと非表示にしないことで、
  // ページロード時の挙動を安定させます。
  const scrollThreshold = 100

  /**
   * スクロールイベントが発生したときに実行されるメイン関数
   */
  function handleScroll() {
    // 現在のスクロール位置
    const currentScrollY = window.scrollY

    // 1. スクロール方向の判定
    // 上にスクロールしている (現在のY < 前回のY) かつ、
    // スクロール量がトリガー位置を超えている
    const isScrollingUp =
      currentScrollY < lastScrollY && currentScrollY > scrollThreshold

    // 2. 非表示にする判定
    // 下にスクロールしている (現在のY > 前回のY) かつ、
    // スクロール量がトリガー位置を超えている
    const isScrollingDown =
      currentScrollY > lastScrollY && currentScrollY > scrollThreshold

    // ------------------------------------------------
    // クラスの切り替え
    // ------------------------------------------------

    if (isScrollingUp) {
      // 上にスクロールしている場合はヘッダーを表示
      header.classList.remove('header-hidden')
      // header.classList.add('header-visible'); // SCSS側で特別なスタイルがなければ不要
    } else if (isScrollingDown) {
      // 下にスクロールしている場合はヘッダーを非表示
      header.classList.add('header-hidden')
      // header.classList.remove('header-visible');
    }

    // 3. 次のスクロールイベントのために現在の位置を保存
    // スクロール方向の比較を安定させるため、現在の位置を更新します。
    lastScrollY = currentScrollY
  }

  // パフォーマンス向上のため、スクロールイベントを監視
  // requestAnimationFrameやスロットリング/デバウンスを使用すると、
  // より滑らかでパフォーマンスの高い動きになりますが、ここでは基本形を適用します。
  window.addEventListener('scroll', handleScroll)

  // 初期ロード時の状態を設定（念のため）
  if (lastScrollY > scrollThreshold) {
    // 初回ロード時に既にスクロールされている場合（リロード時など）
    header.classList.add('header-hidden')
  }
})

// ------------------------------------------------
// お問い合わせフォームのプライバシーポリシーチェックボックス制御
// ------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  // 必要な要素をIDで取得
  const privacyCheckbox = document.getElementById('privacy')
  const submitButton = document.querySelector('.btn-submit')

  // フォーム送信ボタンが押された時の動作を定義する関数
  function toggleSubmitButton() {
    // チェックボックスの状態を確認し、ボタンのdisabled属性を切り替える
    // checkedがfalse（チェックされていない）なら、disabledをtrue（無効）にする
    submitButton.disabled = !privacyCheckbox.checked
  }

  // 1. ページ読み込み時に一度、ボタンの状態を初期設定する
  // (これは、ブラウザがフォームの状態を記憶している場合に重要です)
  toggleSubmitButton()

  // 2. チェックボックスの状態が変更されるたびに、関数を実行する
  privacyCheckbox.addEventListener('change', toggleSubmitButton)
})

// ------------------------------------------------
// よくある質問 (FAQ) アコーディオン機能
// ------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  const faqButtons = document.querySelectorAll('.faq-question-btn')

  faqButtons.forEach(button => {
    const answerId = button.getAttribute('aria-controls')
    const answerContent = document.getElementById(answerId)

    button.addEventListener('click', function() {
      const isExpanded = button.getAttribute('aria-expanded') === 'true'

      if (isExpanded) {
        // 閉じる処理
        button.setAttribute('aria-expanded', 'false')
        answerContent.setAttribute('aria-hidden', 'true')

        // 現在の高さを明示してから0に遷移（スムーズに閉じる）
        answerContent.style.height = answerContent.scrollHeight + 'px'
        requestAnimationFrame(() => {
          answerContent.style.height = '0'
        })
      } else {
        // 開く処理
        button.setAttribute('aria-expanded', 'true')
        answerContent.setAttribute('aria-hidden', 'false')

        // 一度自動計算された高さを設定
        const fullHeight = answerContent.scrollHeight + 'px'
        answerContent.style.height = fullHeight

        // アニメーション完了後に height:auto に戻す
        answerContent.addEventListener('transitionend', function handler() {
          answerContent.style.height = 'auto'
          answerContent.removeEventListener('transitionend', handler)
        })
      }

      // 他のパネルを閉じる場合（必要ならONに）
      /*
      faqButtons.forEach((other) => {
        if (other !== button) {
          const otherAnswer = document.getElementById(other.getAttribute("aria-controls"));
          other.setAttribute("aria-expanded", "false");
          otherAnswer.style.height = "0";
        }
      });
      */
    })
  })
})

// ------------------------------------------------
// サービストップページのh1タイトルに改行タグを挿入
// ------------------------------------------------
// document.addEventListener("DOMContentLoaded", function () {
// 目的の要素をCSSセレクターで取得
// const h1Element = document.querySelector("#service-top .page-title");

// 要素が存在することを確認してから処理を実行
// if (h1Element) {
// 挿入したい新しいコンテンツを定義
// ここで、ご要望の改行タグを挿入したHTMLを設定します
// const newHTMLContent =
// "AIパーソナライズ学習<br>プラットフォーム<br class='br-sp'>EduMind";

// 要素の中身を新しいHTMLで置き換え
// h1Element.innerHTML = newHTMLContent;
// }
// });

// ===================================
// コードコピー機能のJavaScript (完成版)
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  // ページ上のすべてのコピーボタンを取得
  const copyButtons = document.querySelectorAll('.btn-copy')

  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 1. コピーボタンの親要素 (code-copy-container) を取得
      const container = this.closest('.code-copy-container')

      // 2. コードブロック <code> のテキストコンテンツを取得
      const codeElement = container.querySelector('.code-block code')

      // 3. HTMLエンティティを元の記号に戻す (例: < を &lt; から戻す)
      // この処理は、MarkdownやNunjucksでエスケープされている場合に必要です
      let codeToCopy = codeElement.textContent

      // 4. クリップボードAPIを使用してコピーを実行
      navigator.clipboard
        .writeText(codeToCopy)
        .then(() => {
          // 成功時のフィードバック
          this.classList.add('copied')
          this.innerHTML = '<i class="fa-solid fa-check"></i> コピー完了' // チェックマークとテキストに切り替え

          // 3秒後に元の状態に戻す
          setTimeout(() => {
            this.classList.remove('copied')
            this.innerHTML = '<i class="fa-solid fa-copy"></i>' // コピーアイコンに戻す
          }, 3000)
        })
        .catch(err => {
          console.error('コピーに失敗しました:', err)
          alert('コードのコピーに失敗しました。')
        })
    })
  })
})
