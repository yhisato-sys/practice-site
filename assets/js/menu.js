document.addEventListener("DOMContentLoaded", () => {
  const globalNav = document.querySelector(".global-nav");
  const hamburgerButton = document.querySelector(".hamburger-button");
  const overlay = document.querySelector(".overlay");

  if (!globalNav) return;

  const SP_BREAKPOINT = 929;

  // 再帰的にボタンを設置
  const initializeMenuItems = (menuContainer) => {
    const items = menuContainer.querySelectorAll(":scope > li");

    items.forEach((item) => {
      const subMenu = item.querySelector(":scope > .sub-menu");
      const anchor = item.querySelector(":scope > a");

      // 下層メニューがある場合
      if (subMenu && anchor) {
        item.classList.add("has-submenu");

        // ✅ SPボタンを a の「外」に設置
        if (!item.querySelector(":scope > .sp-menu-toggle")) {
          const spToggleButton = document.createElement("button");
          spToggleButton.classList.add("sp-menu-toggle");
          item.insertBefore(spToggleButton, subMenu);
        }

        // ✅ PC用の展開マークも必要ならここで生成
        if (!item.querySelector(":scope > .pc-menu-toggle")) {
          const pcToggle = document.createElement("div");
          pcToggle.classList.add("pc-menu-toggle");
          item.insertBefore(pcToggle, subMenu);
        }

        initializeMenuItems(subMenu);
      } else {
        item.classList.remove("has-submenu");
      }
    });
  };

  initializeMenuItems(globalNav.querySelector("ul"));

  const registeredSpListeners = new Map();

  const toggleGlobalNav = (isOpen) => {
    if (isOpen) {
      globalNav.classList.add("is-open");
      hamburgerButton.classList.add("is-open");
      overlay.classList.add("is-active");
      document.body.style.overflow = "hidden";
    } else {
      globalNav.classList.remove("is-open");
      hamburgerButton.classList.remove("is-open");
      overlay.classList.remove("is-active");
      document.body.style.overflow = "";

      globalNav
        .querySelectorAll(".is-active")
        .forEach((el) => el.classList.remove("is-active"));
      globalNav
        .querySelectorAll(".is-open")
        .forEach((el) => el.classList.remove("is-open"));
    }
  };

  const setupNavBehavior = () => {
    initializeMenuItems(globalNav.querySelector("ul"));

    // SPボタンの動作を登録
    registeredSpListeners.forEach((listener, button) => {
      if (button && button.onclick === listener) {
        button.onclick = null;
      }
    });
    registeredSpListeners.clear();

    const spButtons = globalNav.querySelectorAll(".sp-menu-toggle");

    if (window.innerWidth > SP_BREAKPOINT) {
      globalNav.style.display = "";
      toggleGlobalNav(false);
      if (hamburgerButton) hamburgerButton.style.display = "none";
      globalNav
        .querySelectorAll(".is-active")
        .forEach((el) => el.classList.remove("is-active"));
      spButtons.forEach((btn) => btn.classList.remove("is-open"));
    } else {
      globalNav.style.display = "block";
      if (hamburgerButton) hamburgerButton.style.display = "block";

      spButtons.forEach((button) => {
        const listener = (event) => {
          event.preventDefault();
          event.stopPropagation();

          const parentItem = button.closest("li");
          if (!parentItem) return;

          const isActive = parentItem.classList.contains("is-active");
          if (isActive) {
            parentItem.classList.remove("is-active");
            button.classList.remove("is-open");
            parentItem
              .querySelectorAll(".is-active")
              .forEach((el) => el.classList.remove("is-active"));
            parentItem
              .querySelectorAll(".is-open")
              .forEach((el) => el.classList.remove("is-open"));
          } else {
            parentItem.classList.add("is-active");
            button.classList.add("is-open");
            // 同階層を閉じる
            parentItem.parentNode
              ?.querySelectorAll(":scope > li.is-active")
              .forEach((other) => {
                if (other !== parentItem) {
                  other.classList.remove("is-active");
                  other
                    .querySelectorAll(".is-active")
                    .forEach((el) => el.classList.remove("is-active"));
                  other
                    .querySelectorAll(".is-open")
                    .forEach((el) => el.classList.remove("is-open"));
                }
              });
          }
        };
        button.onclick = listener;
        registeredSpListeners.set(button, listener);
      });
    }
  };

  // ハンバーガー開閉
  hamburgerButton?.addEventListener("click", () => {
    const isOpen = globalNav.classList.contains("is-open");
    toggleGlobalNav(!isOpen);
  });

  overlay?.addEventListener("click", () => {
    toggleGlobalNav(false);
  });

  setupNavBehavior();
  window.addEventListener("resize", setupNavBehavior);
});
