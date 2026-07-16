<div align="center">

# ✨ Xingding Resume ✨

[简体中文](./README.md) | English

**[🚀 Live Demo](https://cv.sonnet.skin)**

</div>

![project screenshot](./public/web-shot.png)

**Xingding Resume** (ZoneYottaZenith) is a modern online resume editor that makes creating professional resumes simple and enjoyable. Built with TanStack Start and Framer Motion, it features real-time preview, custom themes, and deep mobile optimization.

## ✨ Features

- 🚀 Built with TanStack Start + React 18
- 💫 Smooth animations (Framer Motion)
- 🎨 Multiple resume templates + custom themes
- 📱 Deep mobile optimization (compact layout, bottom nav, tools panel)
- 🌙 Dark / Light mode
- 📤 Export to PDF / Print / JSON / Markdown
- 🔄 Real-time preview (drag & drop, inline editing)
- 💾 Auto-save to localStorage
- 🔒 Privacy-first: no registration, no server upload
- 📊 Real-time usage counter
- 🔍 Resume analysis entry
- 💼 Data backup export / one-click JSON restore
- 🤖 AI-assisted writing, grammar check, content polish
- 🌐 Multi-language (Chinese / English)
- 📂 Desktop sync directory configuration

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | TanStack Start, React 18, TypeScript |
| Animation | Framer Motion |
| Styling | Tailwind CSS, Shadcn/ui |
| State | Zustand |
| Editor | Tiptap (rich text) |
| Icons | Lucide Icons |
| Package Manager | pnpm |

## 🚀 Quick Start

**1. Clone the project**

```bash
git clone <your-repo-url>
cd magic-resume-main
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Start development server**

```bash
pnpm dev
```

**4. Open** `http://localhost:3000` in your browser

## 📦 Build

```bash
pnpm build
```

## 🐳 Docker Deployment

### Docker Compose (Recommended)

Make sure Docker and Docker Compose are installed, then run in the project root:

```bash
docker compose up -d
```

This will:

- Automatically build the application image
- Start the container in the background
- Mount `./data` into the container to **persist the usage counter across restarts**

### Notes

- Default port: `3000`
- Usage counter is stored in `./data/usage.json` (persisted on host)
- No external database required, works out of the box

## 📝 License and Commercial Use

The source code of this project is open-sourced under the **Apache 2.0** license, but with **strict commercial use restrictions**:

- **Free for Personal Use**: Free to use purely for personal, non-commercial purposes (e.g., personal learning, creating your own resume).
- **Commercial License Required**: Unauthorized commercial use is strictly prohibited. Any organization or individual that provides it as a service (SaaS/PaaS, etc.) to the public for profit, uses it for enterprise commercial operations, or conducts secondary commercial development, **must obtain a commercial license, regardless of whether the source code has been modified**.

Please see the [LICENSE](LICENSE) file for detailed terms.

