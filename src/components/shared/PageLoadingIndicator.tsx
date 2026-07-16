import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

/**
 * 全局页面切换加载指示器
 * - 页面顶部 SVG 动画进度条
 * - 内容区域半透明遮罩 + 居中 spinner
 * - 150ms 延迟避免快速导航闪烁
 */
export function PageLoadingIndicator() {
  const { isLoading, hasPendingMatches } = useRouterState({
    select: (s) => ({
      isLoading: s.isLoading,
      hasPendingMatches: s.matches.some((d) => d.status === "pending"),
    }),
    structuralSharing: true,
  });

  const isPending = isLoading || hasPendingMatches;
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isPending) {
      timerRef.current = setTimeout(() => setShow(true), 150);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setShow(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPending]);

  if (!show) return null;

  return (
    <>
      {/* 顶部进度条 */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="loading-bar-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--loading-bar-start, #3b82f6)" />
              <stop offset="50%" stopColor="var(--loading-bar-mid, #8b5cf6)" />
              <stop offset="100%" stopColor="var(--loading-bar-end, #3b82f6)" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="100"
            height="4"
            fill="url(#loading-bar-gradient)"
            className="animate-loading-bar"
            rx="2"
          />
        </svg>
      </div>

      {/* 内容区域遮罩 + spinner */}
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-background/40 backdrop-blur-[1px] transition-opacity duration-200">
        <LoadingSpinner />
      </div>
    </>
  );
}

/** SVG 旋转加载动画 */
function LoadingSpinner({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      style={{ animation: "spin 1s linear infinite" }}
    >
      <defs>
        <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        stroke="url(#spinner-gradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="80"
        strokeDashoffset="60"
      />
    </svg>
  );
}
