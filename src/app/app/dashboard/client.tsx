import { useState, useEffect, useRef } from "react";
import { IconResumes, IconTemplates, IconSettings, IconAI } from "@/components/shared/icons/SidebarIcons";
import { usePathname, useRouter } from "@/lib/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import Logo from "@/components/shared/Logo";
import { useLocale, useTranslations } from "@/i18n/compat/client";

const TYPING_TEXTS = ["ZoneYottaZenith", "让简历排版，不再是难题。"];
const TYPE_SPEED = 80;   // ms per char when typing
const DELETE_SPEED = 40; // ms per char when deleting
const PAUSE_AFTER = 1600; // ms to hold before deleting

function TypingCycler() {
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = TYPING_TEXTS[textIdx];

    if (phase === "typing") {
      if (charIdx < current.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplay(current.slice(0, charIdx + 1));
          setCharIdx(i => i + 1);
        }, TYPE_SPEED);
      } else {
        timeoutRef.current = setTimeout(() => setPhase("pausing"), PAUSE_AFTER);
      }
    } else if (phase === "pausing") {
      timeoutRef.current = setTimeout(() => setPhase("deleting"), 200);
    } else if (phase === "deleting") {
      if (charIdx > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplay(current.slice(0, charIdx - 1));
          setCharIdx(i => i - 1);
        }, DELETE_SPEED);
      } else {
        setTextIdx(i => (i + 1) % TYPING_TEXTS.length);
        setPhase("typing");
      }
    }

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [phase, charIdx, textIdx]);

  return (
    <span className="text-[10px] tracking-widest font-light text-muted-foreground/60 uppercase select-none font-mono">
      {display}
      <span className="animate-pulse opacity-60">|</span>
    </span>
  );
}

interface MenuItem {
  title: string;
  url?: string;
  href?: string;
  icon: any;
  items?: { title: string; href: string }[];
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("dashboard");
  const sidebarItems: MenuItem[] = [
    {
      title: t("sidebar.resumes"),
      url: "/app/dashboard/resumes",
      icon: IconResumes,
    },
    {
      title: t("sidebar.templates"),
      url: "/app/dashboard/templates",
      icon: IconTemplates,
    },
    {
      title: t("sidebar.ai"),
      url: "/app/dashboard/ai",
      icon: IconAI,
    },
    {
      title: t("sidebar.settings"),
      url: "/app/dashboard/settings",
      icon: IconSettings,
    },

  ];

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(true);
  const [collapsible, setCollapsible] = useState<"offcanvas" | "icon" | "none">(
    "icon"
  );

  const handleItemClick = (item: MenuItem) => {
    if (item.items) {

    } else {
      router.push(item.url || item.href || "/");
    }
  };

  const isItemActive = (item: MenuItem) => {
    if (item.items) {
      return item.items.some((subItem) => pathname === subItem.href);
    }
    return item.url === pathname || item.href === pathname;
  };

  return (
    <div className="flex h-screen bg-background">
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <Sidebar
          collapsible={collapsible}
          className="border-r border-border/40 bg-card/50 backdrop-blur-xl"
        >
          <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/40">
            <div className="w-full cursor-pointer justify-center flex items-center" onClick={() => router.push(`/${locale}`)}
            >
              <Logo
                className=" hover:opacity-80 transition-opacity"
                size={24}
              />
              {open && (
                <span className="font-sans text-[24px] tracking-tight font-semibold text-foreground/90 leading-none whitespace-nowrap">
                  {t("sidebar.appName")}
                </span>
              )}
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {sidebarItems.map((item) => {
                    const active = isItemActive(item);
                    return (
                      <TooltipProvider delayDuration={0} key={item.title}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton
                                asChild
                                isActive={active}
                                className={`w-full transition-all duration-200 ease-in-out h-12 mb-1 [&>svg]:size-auto ${active
                                  ? "bg-primary/10 text-primary font-bold hover:bg-primary/20 hover:text-primary"
                                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                  }`}
                              >
                                <div
                                  className="flex items-center gap-2 px-2 cursor-pointer"
                                  onClick={() => handleItemClick(item)}
                                >
                                  <item.icon
                                    size={24}
                                    active={active}
                                  />
                                  {open && (
                                    <span className="flex-1 text-sm">
                                      {item.title}
                                    </span>
                                  )}
                                </div>
                              </SidebarMenuButton>
                              {item.items && open && (
                                <div className="ml-9 mt-1 space-y-1 border-l-2 border-muted pl-2">
                                  {item.items.map((subItem) => (
                                    <div
                                      key={subItem.href}
                                      className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-colors ${pathname === subItem.href
                                        ? "text-primary font-medium bg-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        }`}
                                      onClick={() => router.push(subItem.href)}
                                    >
                                      {subItem.title}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </SidebarMenuItem>
                          </TooltipTrigger>
                          {!open && (
                            <TooltipContent side="right" className="font-medium">
                              {item.title}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>
        <main className="flex-1 flex flex-col">
          <div className="p-2 flex items-center gap-3">
            <SidebarTrigger />
            <TypingCycler />
          </div>
          <div className="flex-1">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
