import { createFileRoute } from "@tanstack/react-router";

const BASE_COUNT = 1213;

// CF Workers 没有 node:fs，用内存计数做降级
let memDelta = 0;

async function readDelta(): Promise<number> {
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const file = path.resolve(process.cwd(), "data", "usage.json");
    if (!fs.existsSync(file)) return memDelta;
    const obj = JSON.parse(fs.readFileSync(file, "utf-8")) as { delta?: number };
    return typeof obj.delta === "number" ? obj.delta : memDelta;
  } catch {
    return memDelta;
  }
}

async function writeDelta(delta: number): Promise<void> {
  memDelta = delta; // 内存同步更新
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const file = path.resolve(process.cwd(), "data", "usage.json");
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ delta }), "utf-8");
  } catch {
    // CF Workers 环境，仅内存计数，重启后重置
  }
}

export const Route = createFileRoute("/api/usage")({
  server: {
    handlers: {
      GET: async () => {
        const count = BASE_COUNT + (await readDelta());
        return Response.json({ count });
      },
      POST: async () => {
        const delta = (await readDelta()) + 1;
        await writeDelta(delta);
        const count = BASE_COUNT + delta;
        return Response.json({ count });
      },
    },
  },
});

