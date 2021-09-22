/**
 * 操作权限处理
 * Copyright (c) 2020
 */
export default {
  inserted(el, binding) {
    el.addEventListener("click", () => {
      if (!el.disabled) {
        el.disabled = true;
        el.style.cursor = "not-allowed";
        setTimeout(() => {
          el.disabled = false;
          el.style.cursor = "pointer";
        }, binding.value || 3000);
      }
    });
  },
};
