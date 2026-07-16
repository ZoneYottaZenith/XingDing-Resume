
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Palette, Eye, EyeOff, Plus, Settings2, Trash2, Wrench, SpellCheck2, Download, Copy, Loader2, Printer, FileJson, ChevronRight, PanelsLeftBottom, Check } from "lucide-react";
import { RiMarkdownLine } from "@remixicon/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";
import { EditPanel } from "@/components/editor/EditPanel";
import { SidePanel } from "@/components/editor/SidePanel";
import PreviewPanel from "@/components/preview";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { STANDARD_MODULES } from "@/config/modules";
import { useTranslations } from "@/i18n/compat/client";
import TemplateSheet from "@/components/shared/TemplateSheet";
import { useGrammarCheck } from "@/hooks/useGrammarCheck";
import { useAIConfigStore } from "@/store/useAIConfigStore";
import { useAIConfiguration } from "@/hooks/useAIConfiguration";
import { useRouter } from "@/lib/navigation";
import { exportToPdf, exportResumeAsJson, exportResumeAsMarkdown } from "@/utils/export";
import { exportResumeToBrowserPrint } from "@/utils/print";

type TabType = "content" | "style" | "tools" | "preview";

export function MobileWorkbench() {
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const { activeResume, setActiveSection, updateMenuSections, addCustomData, toggleSectionVisibility, duplicateResume, setActiveResume, activeResumeId, updateGlobalSettings } = useResumeStore();
  const { activeSection, menuSections, globalSettings = {}, title } = activeResume || {};
  const t = useTranslations("workbench.sidePanel");
  const tc = useTranslations("common");
  const tPdf = useTranslations("pdfExport");
  const tDock = useTranslations("previewDock");
  const router = useRouter();
  const { checkGrammar, isChecking } = useGrammarCheck();
  const { checkConfiguration } = useAIConfiguration();
  const { selectedModel, doubaoApiKey, doubaoModelId, deepseekApiKey, deepseekModelId, openaiApiKey, openaiModelId, openaiApiEndpoint } = useAIConfigStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingJson, setIsExportingJson] = useState(false);
  const [isExportingMarkdown, setIsExportingMarkdown] = useState(false);
  const isLoading = isExporting || isExportingJson || isExportingMarkdown;

  const filteredModules = Object.values(STANDARD_MODULES).filter(
    (mod) => !menuSections?.some((s) => s.id === mod.id)
  );

  const handleCreateSection = () => {
    if (!menuSections) return;
    const customSections = menuSections.filter((s) => s.id.startsWith("custom"));
    const nextNum = customSections.length + 1;
    const sectionId = `custom-${nextNum}`;
    const newSection = {
      id: sectionId,
      title: sectionId,
      icon: "➕",
      enabled: true,
      order: menuSections.length,
    };
    updateMenuSections([...menuSections, newSection]);
    addCustomData(sectionId);
  };

  const handleExportPdf = useCallback(async () => {
    await exportToPdf({
      elementId: "resume-preview",
      title: title || "resume",
      pagePadding: globalSettings?.pagePadding || 0,
      fontFamily: globalSettings?.fontFamily,
      onStart: () => setIsExporting(true),
      onEnd: () => setIsExporting(false),
      successMessage: tPdf("toast.success"),
      errorMessage: tPdf("toast.error"),
    });
  }, [title, globalSettings, tPdf]);

  const handleExportJson = useCallback(() => {
    exportResumeAsJson({
      resume: activeResume,
      title,
      onStart: () => setIsExportingJson(true),
      onEnd: () => setIsExportingJson(false),
      successMessage: tPdf("toast.jsonSuccess"),
      errorMessage: tPdf("toast.jsonError"),
    });
  }, [activeResume, title, tPdf]);

  const handleExportMarkdown = useCallback(() => {
    exportResumeAsMarkdown({
      resume: activeResume,
      title,
      onStart: () => setIsExportingMarkdown(true),
      onEnd: () => setIsExportingMarkdown(false),
      successMessage: tPdf("toast.markdownSuccess"),
      errorMessage: tPdf("toast.markdownError"),
      markdownOptions: { basicFieldLabels: {} },
    });
  }, [activeResume, title, tPdf]);

  const handlePrint = useCallback(() => {
    const resumeContent = document.getElementById("resume-preview");
    if (!resumeContent) return;
    exportResumeToBrowserPrint(resumeContent, globalSettings?.pagePadding || 0, globalSettings?.fontFamily);
  }, [globalSettings]);

  const handleGrammarCheck = useCallback(async () => {
    if (!checkConfiguration()) return;
    const previewContent = document.getElementById("resume-preview");
    const text = (previewContent?.textContent || "").trim();
    if (!text) { toast.error(tDock("grammarCheck.errorToast")); return; }
    await checkGrammar(text);
  }, [checkConfiguration, checkGrammar, tDock]);

  const handleCopyResume = useCallback(() => {
    if (!activeResumeId) return;
    const newId = duplicateResume(activeResumeId);
    setActiveResume(newId);
    toast.success(tDock("copyResume.success"));
    router.push(`/app/workbench/${newId}`);
  }, [activeResumeId, duplicateResume, setActiveResume, router, tDock]);

  // 渲染底部导航项
  const renderNavItem = (tab: TabType, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={cn(
        "flex flex-col items-center justify-center py-1.5 px-3 flex-1 transition-colors",
        activeTab === tab
          ? "text-primary"
          : "text-muted-foreground hover:text-primary/80"
      )}
    >
      <div className={cn("mb-0.5", activeTab === tab && "scale-110 duration-200")}>
        {icon}
      </div>
      <span className="text-[9px] font-medium">{label}</span>
      {activeTab === tab && (
        <motion.div
          layoutId="mobile-nav-indicator"
          className="absolute bottom-0 w-12 h-1 bg-primary rounded-t-full"
        />
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-[calc(100dvh-48px)] bg-background">
      {/* 主要内容区域 */}
      <div className="flex-1 overflow-hidden relative">
        {/* 内容 tab */}
        <div className={cn("absolute inset-0 flex flex-col", activeTab !== "content" && "hidden")}>
              {/* 顶部模块选择器 */}
              <div className="border-b bg-background/95 backdrop-blur z-10">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex px-2 py-1 space-x-1.5">
                    {/* 基础信息 */}
                    <button
                      onClick={() => setActiveSection("basic")}
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors border",
                        activeSection === "basic"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:bg-muted"
                      )}
                    >
                      <span className="mr-1.5">👤</span>
                      基本信息
                    </button>
                    
                    {/* 已启用模块 */}
                    {menuSections
                      ?.filter((s) => s.id !== "basic" && s.enabled)
                      .map((section) => (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors border",
                            activeSection === section.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-muted-foreground border-border hover:bg-muted"
                          )}
                        >
                          <span className="mr-1.5">{section.icon}</span>
                          {section.title}
                        </button>
                      ))}

                    {/* 管理模块按钮 → 底部 Sheet */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <button className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors border border-dashed border-muted-foreground/30 text-muted-foreground hover:bg-muted shrink-0">
                          <Settings2 className="w-3 h-3 mr-1" />
                          管理
                        </button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="max-h-[80vh] rounded-t-2xl px-0 pb-safe">
                        <SheetHeader className="px-4 pb-2 border-b">
                          <SheetTitle className="text-sm">管理模块</SheetTitle>
                        </SheetHeader>
                        <div className="overflow-y-auto max-h-[calc(80vh-100px)]">
                          {/* 所有模块列表（含隐藏的） */}
                          <div className="px-4 py-2 space-y-1">
                            {menuSections?.filter(s => s.id !== "basic").map((section) => (
                              <div
                                key={section.id}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2.5 rounded-lg border",
                                  section.enabled
                                    ? "bg-background border-border"
                                    : "bg-muted/50 border-dashed border-muted-foreground/30"
                                )}
                              >
                                <span className={cn("text-base", !section.enabled && "opacity-40")}>{section.icon}</span>
                                <span className={cn("flex-1 text-sm", !section.enabled && "text-muted-foreground line-through")}>{section.title}</span>
                                {/* 显隐 */}
                                <button
                                  onClick={() => toggleSectionVisibility(section.id)}
                                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                >
                                  {section.enabled
                                    ? <Eye className="w-4 h-4 text-primary" />
                                    : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                                </button>
                                {/* 删除 */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <button className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                                      <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="w-[calc(100vw-32px)] max-w-sm p-4 gap-3">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-base">{tc("delete")} {section.title}</AlertDialogTitle>
                                      <AlertDialogDescription className="text-xs">{tc("deleteModuleConfirm")}</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="gap-2">
                                      <AlertDialogCancel className="h-8 text-xs">{tc("cancel")}</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          if (!menuSections) return;
                                          const idx = menuSections.findIndex(s => s.id === section.id);
                                          updateMenuSections(menuSections.filter(s => s.id !== section.id));
                                          setActiveSection(menuSections[Math.max(0, idx - 1)].id);
                                        }}
                                        className="h-8 text-xs bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500 text-white border-0"
                                      >
                                        {tc("confirm")}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            ))}
                          </div>

                          {/* 分隔线 */}
                          <div className="h-px bg-border mx-4 my-1" />

                          {/* 添加标准模块 */}
                          {filteredModules.length > 0 && (
                            <div className="px-4 py-2 space-y-1">
                              <p className="text-xs text-muted-foreground px-1 mb-2">添加模块</p>
                              {filteredModules.map((mod) => (
                                <button
                                  key={mod.id}
                                  onClick={() => {
                                    if (!menuSections) return;
                                    updateMenuSections([...menuSections, {
                                      id: mod.id,
                                      title: t(`layout.standardSections.${mod.titleKey}`),
                                      icon: mod.icon,
                                      enabled: true,
                                      order: menuSections.length,
                                    }]);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-dashed border-primary/30 text-sm hover:bg-primary/5 transition-colors"
                                >
                                  <span>{mod.icon}</span>
                                  <span>{t(`layout.standardSections.${mod.titleKey}`)}</span>
                                  <Plus className="w-4 h-4 text-primary ml-auto" />
                                </button>
                              ))}
                            </div>
                          )}

                          {/* 自定义模块 */}
                          <div className="px-4 py-2">
                            <button
                              onClick={handleCreateSection}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-dashed border-muted-foreground/30 text-sm text-muted-foreground hover:bg-muted transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              <span className="italic">{t("layout.addCustomSectionOption")}</span>
                            </button>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  <ScrollBar orientation="horizontal" className="invisible" />
                </ScrollArea>
              </div>
              
              {/* 编辑区域 */}
              <div className="flex-1 overflow-y-auto">
                <EditPanel />
              </div>
        </div>

        {/* 样式 tab */}
        <div className={cn("absolute inset-0 overflow-y-auto", activeTab !== "style" && "hidden")}>
          <SidePanel />
        </div>

        {/* 工具 tab */}
        <div className={cn("absolute inset-0 overflow-y-auto", activeTab !== "tools" && "hidden")}>
          <div className="px-4 py-3 space-y-1.5">
            {/* 切换模板 */}
            <TemplateSheet>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-medium">
                <PanelsLeftBottom className="w-4 h-4 text-primary shrink-0" />
                <span className="flex-1 text-left">{tDock("switchTemplate")}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </TemplateSheet>

            {/* 语法检查 */}
            <button
              onClick={handleGrammarCheck}
              disabled={isChecking}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-medium disabled:opacity-60"
            >
              <SpellCheck2 className={cn("w-4 h-4 text-primary shrink-0", isChecking && "animate-spin")} />
              <span className="flex-1 text-left">{isChecking ? tDock("grammarCheck.checking") : tDock("grammarCheck.idle")}</span>
              {isChecking && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </button>

            {/* 自动单页 */}
            <button
              onClick={() => {
                updateGlobalSettings({ autoOnePage: !globalSettings?.autoOnePage });
                toast.success(globalSettings?.autoOnePage ? tDock("autoOnePage.disabled") : tDock("autoOnePage.enabled"));
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors text-sm font-medium",
                globalSettings?.autoOnePage
                  ? "border-primary/40 bg-primary/5 text-primary"
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{tDock("autoOnePage.tooltip")}</span>
              {globalSettings?.autoOnePage && <Check className="w-4 h-4" />}
            </button>

            <div className="h-px bg-border my-1" />

            {/* 导出 PDF */}
            <button
              onClick={handleExportPdf}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm disabled:opacity-60"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" /> : <Download className="w-4 h-4 text-primary shrink-0" />}
              <span className="flex-1 text-left">{tDock("export.pdf")}</span>
            </button>

            {/* 打印 */}
            <button
              onClick={handlePrint}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm disabled:opacity-60"
            >
              <Printer className="w-4 h-4 text-primary shrink-0" />
              <span className="flex-1 text-left">{tDock("export.print")}</span>
            </button>

            {/* 导出 JSON */}
            <button
              onClick={handleExportJson}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm disabled:opacity-60"
            >
              {isExportingJson ? <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" /> : <FileJson className="w-4 h-4 text-primary shrink-0" />}
              <span className="flex-1 text-left">{tDock("export.json")}</span>
            </button>

            {/* 导出 Markdown */}
            <button
              onClick={handleExportMarkdown}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm disabled:opacity-60"
            >
              {isExportingMarkdown ? <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" /> : <RiMarkdownLine className="w-4 h-4 text-primary shrink-0" />}
              <span className="flex-1 text-left">{tDock("export.markdown")}</span>
            </button>

            <div className="h-px bg-border my-1" />

            {/* 复制简历 */}
            <button
              onClick={handleCopyResume}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm"
            >
              <Copy className="w-4 h-4 text-primary shrink-0" />
              <span className="flex-1 text-left">{tDock("copyResume.tooltip")}</span>
            </button>
          </div>
        </div>

        {/* 预览 tab */}
        <div className={cn("absolute inset-0 overflow-y-auto bg-gray-100", activeTab !== "preview" && "hidden")}>
          <PreviewPanel
            sidePanelCollapsed={true}
            editPanelCollapsed={true}
            previewPanelCollapsed={false}
            toggleSidePanel={() => {}}
            toggleEditPanel={() => {}}
            togglePreviewPanel={() => {}}
          />
        </div>
      </div>

      {/* 底部导航栏 */}
      <div
        className="border-t bg-background flex items-end justify-around relative shadow-[0_-1px_3px_rgba(0,0,0,0.05)] z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="h-12 w-full flex items-center justify-around">
          {renderNavItem("content", <FileText className="w-4 h-4" />, "内容")}
          {renderNavItem("style", <Palette className="w-4 h-4" />, "样式")}
          {renderNavItem("tools", <Wrench className="w-4 h-4" />, "工具")}
          {renderNavItem("preview", <Eye className="w-4 h-4" />, "预览")}
        </div>
      </div>
    </div>
  );
}
