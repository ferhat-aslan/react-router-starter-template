import React, {useState, useEffect, useRef} from "react";
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {
  useTranslation,
  translations,
  SUPPORTED_LOCALES,
  type Locale,
} from "~/utils/route-utils";
import Layout from "~/components/layout";
import {
  FileText,
  Copy,
  Check,
  Trash2,
  Printer,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  List as ListIcon,
  Heading1,
  Heading2,
  Code as CodeIcon,
  RotateCcw,
  RotateCw,
  PlusCircle,
  Highlighter,
  CheckSquare,
  Sparkles,
  Search,
  Smile,
  X,
  ArrowRight,
  Eraser,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";

// Tiptap imports
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {TextStyle} from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

interface MessagesEditorProps {
  title: string;
  description: string;
  badge: string;
  placeholder: string;
  filename: string;
  faqPrefix: string; // e.g., "chatgpt.faq" or "gemini.faq"
}

const EMOJI_CATEGORIES = [
  {
    name: "Faces",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤨",
      "🧐",
      "🤓",
      "😎",
      "🤩",
      "🥳",
    ],
  },
  {
    name: "Hands/People",
    emojis: [
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👌",
      "🤌",
      "🤏",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "☝️",
      "👍",
      "👎",
      "✊",
      "👊",
      "🤛",
      "🤜",
      "👏",
      "🙌",
      "👐",
      "🤲",
      "🤝",
      "🙏",
    ],
  },
  {
    name: "Nature",
    emojis: [
      "🌸",
      "🌹",
      "🌺",
      "🌻",
      "🌼",
      "🌷",
      "🌱",
      "🪴",
      "🌲",
      "🌳",
      "🌴",
      "🌵",
      "🌾",
      "🌿",
      "🍀",
      "🍁",
      "🍂",
      "🍃",
      "🍄",
      "🐚",
      "🌏",
      "🌍",
      "🌎",
      "🌑",
      "🌓",
      "🌕",
      "🌙",
      "⭐",
      "🌟",
      "✨",
      "🔥",
    ],
  },
  {
    name: "Food",
    emojis: [
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🫐",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🥦",
      "🥬",
      "🥒",
      "🌶️",
      "🌽",
      "🥕",
      "🍕",
      "🍔",
      "🍟",
      "🌭",
      "🥪",
      "🌮",
    ],
  },
  {
    name: "Activities",
    emojis: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🥏",
      "🎱",
      "🪀",
      "🏓",
      "🏸",
      "🏒",
      "🏑",
      "🥍",
      "🏏",
      "🪃",
      "🥅",
      "⛳",
      "🪁",
      "🏹",
      "🎣",
      "🤿",
      "🥊",
      "🥋",
      "⛸️",
      "🎿",
      "🛷",
      "🛹",
      "🛼",
    ],
  },
  {
    name: "Objects",
    emojis: [
      "💡",
      "🔦",
      "🕯️",
      "🪔",
      "📔",
      "📕",
      "📖",
      "📗",
      "📘",
      "📙",
      "📚",
      "📓",
      "📒",
      "📃",
      "📜",
      "📄",
      "📰",
      "🗞️",
      "📑",
      "🔖",
      "🏷️",
      "💰",
      "🪙",
      "💴",
      "💵",
      "💶",
      "💷",
      "💸",
      "💳",
      "🧾",
      "✉️",
    ],
  },
  {
    name: "Symbols",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "☮️",
      "✝️",
      "☪️",
      "🕉️",
      "☸️",
      "✡️",
      "🔯",
      "🕎",
      "☯️",
      "☦️",
      "🛐",
      "⛎",
    ],
  },
];

const StickyToolbar = ({editor, t}: {editor: any; t: any}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const emojiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiContainerRef.current &&
        !emojiContainerRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) return null;

  const handleSearch = () => {
    (window as any).find(searchTerm);
  };

  const handleReplace = () => {
    const content = editor.getHTML();
    const newContent = content.replaceAll(searchTerm, replaceTerm);
    editor.commands.setContent(newContent);
  };

  const addEmoji = (emoji: string) => {
    editor.chain().focus().insertContent(emoji).run();
    setShowEmojis(false);
  };

  const IconButton = ({onClick, isActive, icon: Icon, label, title}: any) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 border border-transparent
        ${
          isActive
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800"
            : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400"
        }`}
      title={title || label}
    >
      <Icon size={18} />
      <span className="text-xs font-bold whitespace-nowrap hidden lg:inline">
        {label}
      </span>
    </button>
  );

  return (
    <div className="sticky top-[64px] z-30 w-full mb-8 no-print">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col gap-2 transition-all duration-300 relative">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 px-2">
            <div className="flex items-center gap-1 mr-2">
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().undo().run();
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-400 group transition-colors"
                title={t("chatgpt.editor.undo") || "Undo"}
              >
                <RotateCcw
                  size={18}
                  className="group-active:-rotate-45 transition-transform"
                />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().redo().run();
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-400 group transition-colors"
                title={t("chatgpt.editor.redo") || "Redo"}
              >
                <RotateCw
                  size={18}
                  className="group-active:rotate-45 transition-transform"
                />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-slate-800 mx-2" />

            <IconButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              icon={BoldIcon}
              label={t("chatgpt.editor.bold") || "Bold"}
            />
            <IconButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              icon={ItalicIcon}
              label={t("chatgpt.editor.italic") || "Italic"}
            />
            <IconButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              icon={UnderlineIcon}
              label={t("chatgpt.editor.underline") || "Underline"}
            />
            <IconButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive("highlight")}
              icon={Highlighter}
              label={t("chatgpt.editor.highlight") || "Highlight"}
            />

            <div className="w-px h-6 bg-gray-200 dark:bg-slate-800 mx-2" />

            <IconButton
              onClick={() =>
                editor.chain().focus().toggleHeading({level: 1}).run()
              }
              isActive={editor.isActive("heading", {level: 1})}
              icon={Heading1}
              label={t("chatgpt.editor.h1") || "H1"}
            />
            <IconButton
              onClick={() =>
                editor.chain().focus().toggleHeading({level: 2}).run()
              }
              isActive={editor.isActive("heading", {level: 2})}
              icon={Heading2}
              label={t("chatgpt.editor.h2") || "H2"}
            />

            <div className="w-px h-6 bg-gray-200 dark:bg-slate-800 mx-2" />

            <IconButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              icon={ListIcon}
              label={t("chatgpt.editor.bullet") || "List"}
            />
            <IconButton
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              isActive={editor.isActive("taskList")}
              icon={CheckSquare}
              label={t("chatgpt.editor.tasks") || "Tasks"}
            />
            <IconButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive("codeBlock")}
              icon={CodeIcon}
              label={t("chatgpt.editor.code") || "Code"}
            />

            <div className="w-px h-6 bg-gray-200 dark:bg-slate-800 mx-2" />

            <button
              ref={emojiContainerRef}
              onMouseDown={(e) => {
                e.preventDefault();
                setShowEmojis(!showEmojis);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 border border-transparent
                  ${
                    showEmojis
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400"
                  }`}
              title={t("chatgpt.editor.emoji") || "Emoji"}
            >
              <Smile size={18} />
              <span className="text-xs font-bold whitespace-nowrap hidden lg:inline">
                {t("chatgpt.editor.emoji") || "Emoji"}
              </span>
            </button>

            <IconButton
              onClick={() => setShowSearch(!showSearch)}
              isActive={showSearch}
              icon={Search}
              label={t("chatgpt.editor.search") || "Search"}
            />
          </div>

          <div className="flex gap-2 pr-2">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().unsetAllMarks().clearNodes().run();
              }}
              className="flex items-center gap-2 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-xl transition-colors font-bold text-xs"
              title={t("chatgpt.editor.clear_format") || "Clear Format"}
            >
              <Eraser size={18} />
              <span className="hidden xl:inline">
                {t("chatgpt.editor.clear_format") || "Format"}
              </span>
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="px-3 py-2 border-t border-gray-100 dark:border-slate-800 flex flex-wrap gap-2 items-center animate-in slide-in-from-top-2 duration-300">
            <div className="relative flex-1 min-w-[150px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("chatgpt.editor.find_placeholder") || "Find..."}
                className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="relative flex-1 min-w-[150px]">
              <ArrowRight
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                placeholder={
                  t("chatgpt.editor.replace_placeholder") || "Replace with..."
                }
                className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[11px] font-black tracking-widest uppercase transition-all shadow-lg shadow-blue-500/20"
              >
                {t("chatgpt.editor.find_btn") || "Find"}
              </button>
              <button
                onClick={handleReplace}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all shadow-lg"
              >
                {t("chatgpt.editor.replace_btn") || "Replace All"}
              </button>
              <button
                onClick={() => setShowSearch(false)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
      {showEmojis && (
        <div
          className="absolute left-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 w-80 z-[9999] animate-in zoom-in-95 duration-200 pointer-events-auto"
          style={{maxHeight: "320px", top: "calc(100% + 8px)"}}
        >
          <div
            className="overflow-y-auto no-scrollbar flex flex-col gap-4"
            style={{maxHeight: "280px"}}
          >
            {EMOJI_CATEGORIES.map((category) => (
              <div key={category.name}>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                  {category.name}
                </h5>
                <div className="grid grid-cols-8 gap-1">
                  {category.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addEmoji(emoji);
                      }}
                      className="text-xl p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-all cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function MessagesEditor({
  title,
  description,
  badge,
  placeholder,
  filename,
  faqPrefix,
}: MessagesEditorProps) {
  const {t} = useTranslation();
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Typography,
      Highlight,
      TextStyle,
      Color,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
      CharacterCount,
    ],
    content: "",
    onUpdate: ({editor}) => {
      // Force re-render to update stats
      setWordCount(editor.storage.characterCount.words());
      setCharacterCount(editor.storage.characterCount.characters());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none focus:outline-none min-h-[700px] cursor-text transition-all duration-300 px-2",
      },
    },
  });

  const handleCopy = () => {
    if (!editor) return;
    const text = editor.getText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (editor && confirm("Delete everything?")) {
      editor.commands.clearContent();
    }
  };

  const handleDownloadPDF = async () => {
    if (!editor) return;

    try {
      const htmlContent = editor.getHTML();

      const response = await fetch("http://localhost:8000/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: htmlContent,
          filename: filename,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF on server");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again or use Export Word.");
    }
  };

  const handleDownloadDOCX = () => {
    if (!editor) return;
    const htmlContent = editor.getHTML();
    const documentContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <style>
          body { font-family: 'Inter', 'Segoe UI', sans-serif; font-size: 11pt; line-height: 1.6; padding: 40px; }
          h1 { font-size: 28pt; font-weight: 800; color: #111; margin-bottom: 20px; }
          h2 { font-size: 20pt; font-weight: 700; color: #222; margin-top: 30px; }
          p { margin-bottom: 12px; }
          code { font-family: monospace; background: #f4f4f4; padding: 2px 4px; }
          pre { background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>${htmlContent}</body>
      </html>
    `;
    const blob = new Blob([documentContent], {type: "application/msword"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename.replace(
      ".pdf",
      "",
    )}-${new Date().getTime()}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f1115] transition-colors duration-500">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header Area */}
        <div className="mb-12 no-print flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black tracking-widest uppercase mb-4">
              <Sparkles size={14} className="animate-pulse" /> {badge}
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
              {title}
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
              {description}
            </p>
            {editor && (
              <div className="mt-4 flex gap-6 text-[10px] font-black tracking-widest uppercase text-slate-400 dark:text-slate-600 animate-in fade-in slide-in-from-left-4 duration-1000">
                <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>
                    {wordCount} {t("chatgpt.editor.words")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>
                    {characterCount} {t("chatgpt.editor.characters")}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 shrink-0 h-fit mb-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {copied ? (
                <Check size={20} className="text-green-500 relative z-10" />
              ) : (
                <Copy
                  size={20}
                  className="text-slate-400 group-hover:text-blue-500 transition-colors relative z-10"
                />
              )}
              <span
                className={`text-sm font-black tracking-tight relative z-10 ${
                  copied
                    ? "text-green-600"
                    : "text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                }`}
              >
                {copied
                  ? t("chatgpt.editor.copied") || "Copied!"
                  : t("chatgpt.editor.copy") || "Copy"}
              </span>
            </button>

            <button
              onClick={handleDownloadDOCX}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-amber-200 dark:hover:border-amber-800 transition-all group overflow-hidden relative"
              title={t("chatgpt.editor.download_docx")}
            >
              <div className="absolute inset-0 bg-amber-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <FileText
                size={20}
                className="text-slate-400 group-hover:text-amber-500 transition-colors relative z-10"
              />
              <span className="text-sm font-black tracking-tight text-slate-600 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 relative z-10">
                {t("chatgpt.editor.docx") || "Word"}
              </span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 rounded-2xl border border-transparent shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative"
              title={t("chatgpt.editor.download_pdf")}
            >
              <div className="absolute inset-0 bg-white/10 dark:bg-black/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Printer
                size={20}
                className="text-white dark:text-slate-900 relative z-10"
              />
              <span className="text-sm font-black tracking-tight text-white dark:text-slate-900 relative z-10">
                {t("chatgpt.editor.pdf") || "PDF"}
              </span>
            </button>

            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-5 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl border border-transparent hover:border-red-100 dark:hover:border-red-900/30 transition-all group"
              title={t("chatgpt.editor.clear")}
            >
              <Trash2
                size={20}
                className="text-slate-400 group-hover:text-red-500 transition-colors"
              />
              <span className="text-sm font-black tracking-tight text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400">
                {t("chatgpt.editor.clear") || "Clear"}
              </span>
            </button>
          </div>
        </div>

        <StickyToolbar editor={editor} t={t} />

        {/* Paper Surface */}
        <div className="relative bg-white dark:bg-slate-950/50 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] dark:shadow-none border border-slate-100 dark:border-slate-900/50 p-6 md:p-12 mb-20 animate-in zoom-in-95 duration-700 print:shadow-none print:border-0 print:bg-white">
          <EditorContent editor={editor} />

          {/* Stats Bar */}
          {editor && (
            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-slate-900/50 flex flex-wrap gap-4 items-center justify-between no-print">
              <div className="flex gap-6 text-[10px] font-black tracking-widest uppercase text-slate-400 dark:text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                  <span>
                    {wordCount} {t("chatgpt.editor.words")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                  <span>
                    {characterCount} {t("chatgpt.editor.characters")}
                  </span>
                </div>
              </div>
              <div className="text-[10px] font-black tracking-widest uppercase text-slate-300 dark:text-slate-700 italic flex items-center gap-2">
                <Check size={12} className="text-green-500" />{" "}
                {t("chatgpt.editor.sync") || "Ready"}
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 no-print max-w-2xl mx-auto text-center border-t border-gray-100 dark:border-slate-900 pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/10 text-amber-600 rounded-full text-xs font-black tracking-widest uppercase mb-8">
            <Sparkles size={14} /> Writing Guide
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 text-left">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="group cursor-default">
                <h4 className="font-black text-slate-900 dark:text-white mb-3 group-hover:text-blue-500 transition-colors tracking-tight">
                  {t(`${faqPrefix}.q${i}`)}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {t(`${faqPrefix}.a${i}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #cbd5e1;
          pointer-events: none;
          height: 0;
          font-style: italic;
        }

        .dark .ProseMirror p.is-editor-empty:first-child::before {
          color: #334155;
        }

        .ProseMirror blockquote {
          border-left: 6px solid #eff6ff;
          padding: 1rem 0 1rem 2rem;
          color: #3b82f6;
          font-weight: 500;
          margin: 2rem 0;
          background: #f8fafc;
          border-radius: 0 1rem 1rem 0;
        }

        .dark .ProseMirror blockquote {
          background: #0f172a;
          border-left-color: #1e3a8a;
          color: #60a5fa;
        }

        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }

        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #cbd5e1;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .ProseMirror ul[data-type="taskList"] input[type="checkbox"]:checked {
          background: #3b82f6;
          border-color: #3b82f6;
        }

        .ProseMirror ul[data-type="taskList"] input[type="checkbox"]:checked::after {
          content: "✓";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 11px;
          font-weight: bold;
        }

        .ProseMirror mark {
          background-color: #fef08a;
          color: inherit;
          padding: 0.1em 0.3em;
          border-radius: 0.3em;
        }

        .dark .ProseMirror mark {
          background-color: #ca8a04;
          color: white;
        }

        @media print {
          /* Everything else is hidden by .no-print */
          body { background: white !important; margin: 0 !important; color: black !important; }
          .container { max-width: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .ProseMirror { padding: 40px !important; border: none !important; }
        }
      `}</style>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50 no-print">
        <button
          onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-500 transition-all group scale-90 hover:scale-100"
          title="Go to Top"
        >
          <ChevronUp
            size={24}
            className="group-hover:-translate-y-1 transition-transform"
          />
        </button>
        <button
          onClick={() =>
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            })
          }
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-500 transition-all group scale-90 hover:scale-100"
          title="Go to Bottom"
        >
          <ChevronDownIcon
            size={24}
            className="group-hover:translate-y-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}
