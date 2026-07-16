"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * 正确的 marquee 思路：
 * - toast 容器有 overflow:hidden 且被 max-width 约束
 * - [data-title] 保持文字原始宽度（不加 overflow:hidden）
 * - 从 toast 容器层级量溢出量（scrollWidth - clientWidth）
 * - 把 [data-title] 向左 translate 该距离 → 文字全程可见，无空白
 */
function applyMarquee(el: HTMLElement) {
  if (el.dataset.marqueeInit) return;
  el.dataset.marqueeInit = "1";

  const toast = el.closest<HTMLElement>("[data-sonner-toast]");
  if (!toast) return;

  // 双 rAF 确保浏览器完成布局
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const dist = toast.scrollWidth - toast.clientWidth;
      if (dist > 2) {
        el.style.setProperty("--scroll-dist", `-${dist}px`);
        el.classList.add("toast-marquee-active");
      }
    });
  });
}

function scanToasts() {
  document
    .querySelectorAll<HTMLElement>(
      "[data-sonner-toast] [data-title], [data-sonner-toast] [data-description]"
    )
    .forEach(applyMarquee);
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  useEffect(() => {
    scanToasts();

    const observer = new MutationObserver(scanToasts);
    const target = document.querySelector("[data-sonner-toaster]") ?? document.body;
    observer.observe(target, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      {...props}
    />
  )
}

export { Toaster }
