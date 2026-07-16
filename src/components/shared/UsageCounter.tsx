"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// 使用项目自身 API 路由
const BACKEND_URL = "";
const USAGE_EVENT = "usage-incremented";
const POLL_INTERVAL = 60000; // 60s 轮询刷新
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export function UsageCounter({ plain = false }: { plain?: boolean }) {
  const [count, setCount] = useState<number>(1213);
  const [animKey, setAnimKey] = useState(0);

  const fetchCount = (retries = MAX_RETRIES): Promise<void> => {
    return fetch(`${BACKEND_URL}/api/usage`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (typeof data.count === "number") {
          setCount(data.count);
          setAnimKey((k) => k + 1);
        }
      })
      .catch((err) => {
        if (retries > 0) {
          return new Promise((resolve) =>
            setTimeout(
              () => resolve(fetchCount(retries - 1)),
              RETRY_DELAY,
            )
          );
        }
        console.warn("[UsageCounter] 获取计数失败:", err);
      });
  };

  useEffect(() => {
    fetchCount();

    // 定期轮询刷新
    const pollTimer = setInterval(fetchCount, POLL_INTERVAL);

    // 监听点击埋点事件，收到后刷新数字
    const handler = (e: Event) => {
      const newCount = (e as CustomEvent<{ count: number }>).detail?.count;
      if (typeof newCount === "number") {
        setCount(newCount);
        setAnimKey((k) => k + 1);
      } else {
        fetchCount();
      }
    };

    window.addEventListener(USAGE_EVENT, handler);
    return () => {
      window.removeEventListener(USAGE_EVENT, handler);
      clearInterval(pollTimer);
    };
  }, []);

  // 移动端纯文字样式，无背景底子；极窄时响应式省略文字
  if (plain) {
    return (
      <span className="inline-flex items-center gap-1 select-none min-w-0">
        <Users className="h-3.5 w-3.5 shrink-0 text-foreground/50" />
        <span className="text-xs text-foreground/50 whitespace-nowrap hidden min-[360px]:inline">累计使用</span>
        <motion.span
          className="text-xs tabular-nums font-medium text-foreground/80 shrink-0"
          key={animKey}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          {count.toLocaleString()}
        </motion.span>
        <span className="text-xs text-foreground/50 whitespace-nowrap hidden min-[300px]:inline">人次</span>
      </span>
    );
  }

  return (
    <motion.div
      className={cn(
        "relative inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full",
        "bg-background/50 dark:bg-background/20 backdrop-blur-md",
        "border border-border/40 dark:border-white/20",
        "shadow-sm select-none overflow-hidden"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-blue-200/30 via-purple-200/30 to-pink-200/30",
          "dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"
        )}
      />
      <Users className="relative z-10 h-3.5 w-3.5 text-primary/70" />
      <span className="relative z-10 text-xs font-medium whitespace-nowrap">
        累计使用
      </span>
      <span className="relative z-10 w-px h-3 bg-border/60 dark:bg-white/20" />
      <motion.span
        className="relative z-10 text-xs tabular-nums font-semibold text-primary"
        key={animKey}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {count.toLocaleString()}
      </motion.span>
      <span className="relative z-10 text-xs text-muted-foreground">人次</span>
    </motion.div>
  );
}

/**
 * 首页按钮点击时调用，fire-and-forget，不阻塞原有逻辑
 */
export function trackUsage() {
  fetch(`${BACKEND_URL}/api/usage`, {
    method: "POST",
    keepalive: true,
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (typeof data.count === "number") {
        window.dispatchEvent(
          new CustomEvent(USAGE_EVENT, { detail: { count: data.count } })
        );
      }
    })
    .catch((err) => {
      console.warn("[UsageCounter] 上报计数失败:", err);
    });
}
