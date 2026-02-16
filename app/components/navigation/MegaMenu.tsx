import {useState, useEffect, useRef} from "react";
import {useLocation, useNavigate} from "react-router";
import {LocaleLink} from "../locale-link";
import {
  useTranslation,
  SUPPORTED_LOCALES,
  type Locale,
} from "../../utils/route-utils";
import megaMenu from "./megamenu.css?inline";

interface MenuItem {
  labelKey: string;
  label?: string;
  href?: string;
  submenu?: SubmenuItem[];
  type?: "normal" | "text";
}

interface SubmenuItem {
  titleKey: string;
  title?: string;
  items: SubMenuItem[];
}

interface SubMenuItem {
  labelKey: string;
  label?: string;
  href: string;
}

const LANG_NAMES: Record<Locale, string> = {
  en: "English (US)",
  de: "Deutsch",
  es: "Español",
  ar: "العربية",
  tr: "Türkçe",
  pt: "Português",
  fr: "Français",
  it: "Italiano",
  ru: "Русский",
};

const MENU_ITEMS: MenuItem[] = [
  {
    labelKey: "nav.pdftools",
    type: "text" as const,
    submenu: [
      {
        titleKey: "nav.pdf_tools",
        items: [
          {labelKey: "nav.pdf_tools", href: "/pdf-tools"},
          {labelKey: "nav.merge_pdf", href: "/pdf-tools/merge-pdf"},
          {labelKey: "nav.split_pdf", href: "/pdf-tools/split-pdf"},
          {labelKey: "nav.compress_pdf", href: "/pdf-tools/compress-pdf"},
          {labelKey: "nav.word_to_pdf", href: "/pdf-tools/word-to-pdf"},
          {labelKey: "nav.pdf_to_images", href: "/pdf-tools/pdf-to-images"},
          {labelKey: "nav.pdf_to_text", href: "/pdf-tools/pdf-to-text"},
        ],
      },
    ],
  },
  {
    labelKey: "nav.document",
    type: "text",
    submenu: [
      {
        titleKey: "tools.documents.category",
        items: [
          {labelKey: "nav.docx_tools", href: "/docx-tools"},
          {labelKey: "nav.latex_tools", href: "/latex-tools"},
          {labelKey: "nav.spreadsheet_tools", href: "/spreadsheet-tools"},
          {labelKey: "nav.file_converter", href: "/tools/file-converter"},
        ],
      },
    ],
  },
  {
    labelKey: "nav.text_tools",
    type: "text",
    submenu: [
      {
        titleKey: "nav.text_tools",
        items: [
          {labelKey: "nav.text_tools", href: "/text-tools"},
          {labelKey: "nav.chatgpt_editor", href: "/text-tools/chatgpt-editor"},
          {labelKey: "nav.gemini_editor", href: "/text-tools/gemini-editor"},
          {labelKey: "nav.pro_editor", href: "/text-tools/editor"},
          {labelKey: "nav.subtitle_tools", href: "/subtitle-tools"},
        ],
      },
    ],
  },
  {
    labelKey: "nav.tools",
    type: "text" as const,
    submenu: [
      {
        titleKey: "nav.developer_tools",
        items: [
          {labelKey: "nav.seo_tools", href: "/seo-tools"},
          {labelKey: "nav.api_tools", href: "/api-tools"},
          {labelKey: "nav.json_tools", href: "/json-tools"},
          {labelKey: "nav.code_formatter", href: "/code-formatter"},
          {labelKey: "nav.qr_generator", href: "/tools/qr-generator"},
          {labelKey: "nav.amazon_tools", href: "/amazon"},
          {labelKey: "nav.all_tools", href: "/all-tools"},
        ],
      },
    ],
  },
  {
    labelKey: "nav.image_tools",
    type: "text",
    submenu: [
      {
        titleKey: "nav.image_tools",
        items: [
          {labelKey: "nav.image_tools", href: "/image-tools"},
          {labelKey: "nav.images_to_pdf", href: "/image-tools/images-to-pdf"},
          {labelKey: "nav.image_converter", href: "/tools/image-converter"},
          {labelKey: "nav.bg_remover", href: "/tools/bg-remover"},
          {labelKey: "nav.video_compressor", href: "/tools/video-compressor"},
          {labelKey: "nav.icon_resizer", href: "/icon-resizer"},
          {labelKey: "nav.favicon_maker", href: "/favicon-maker"},
        ],
      },
    ],
  },

  {labelKey: "nav.search", href: "/search"},
];

export const MegaMenu = ({
  loaderData,
  brandLogo,
}: {
  loaderData?: any;
  brandLogo?: React.ReactNode;
}) => {
  const t = (key: string) => loaderData?.messages[key] || key;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {pathname} = useLocation();
  const navigate = useNavigate();

  const currentLocale = (pathname.split("/")[1] as Locale) || "en";
  const locale = SUPPORTED_LOCALES.includes(currentLocale)
    ? currentLocale
    : "en";

  // Initialize dark mode from localStorage (avoid reading classList to prevent reflow)
  useEffect(() => {
    // Use requestAnimationFrame to batch DOM operations
    requestAnimationFrame(() => {
      const storedTheme = localStorage.getItem("theme");
      // Only read classList if no stored preference
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches; // Check system preference
      const isDark =
        storedTheme === "dark" || (storedTheme === null && prefersDark);
      setIsDarkMode(isDark);
    });
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMenuOpen]);

  // Initialize isMobile state using matchMedia (no reflow)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) {
        setIsMenuOpen(false);
        setActiveSubmenu(null);
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // Handle body scroll separately to avoid reflow
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === "en") {
      const pathWithoutPrefix = pathname.replace(
        /^\/(de|es|ar|tr|pt|fr|it|ru)(\/|$)/,
        "/",
      );
      navigate(pathWithoutPrefix);
    } else {
      const pathWithoutPrefix = pathname.replace(
        /^\/(de|es|ar|tr|pt|fr|it|ru)(\/|$)/,
        "/",
      );
      navigate(
        `/${newLocale}${pathWithoutPrefix === "/" ? "" : pathWithoutPrefix}`,
      );
    }
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    // Use cached isMobile state instead of reading window.innerWidth
    if (item.submenu && isMobile) {
      if (activeSubmenu === item.labelKey) {
        setActiveSubmenu(null);
      } else {
        setActiveSubmenu(item.labelKey);
      }
    } else if (item.href) {
      setIsMenuOpen(false);
    }
  };

  const closeIconSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  return (
    <header className="header h-12! max-h-12 ">
      <style>{megaMenu}</style>
      <nav className="navbar h-full gap-2 container max-w-7xl bg-zinc-900 rounded-sm px-1 !shadow-none">
        {/* Left Section */}
        <section className="navbar__left bg-white dark:bg-transparent min-h-9.5 m-0 py-0 px-3 rounded-xs">
          <LocaleLink to="/" className="brand">
            {brandLogo ? (
              brandLogo
            ) : (
              <span className="brand-text">Klein⁘Byte</span>
            )}
          </LocaleLink>
          <div
            className={`burger ${isMenuOpen ? "is-active" : ""}`}
            onClick={toggleMenu}
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </div>
        </section>

        {/* Center Section - Menu */}
        <section className="navbar__center" ref={menuRef}>
          <div
            className={`overlay ${isMenuOpen ? "is-active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className={`menu ${isMenuOpen ? "is-active" : ""}`}>
            <div className="mobile-menu__header">
              <LocaleLink
                to="/"
                className="brand"
                onClick={() => setIsMenuOpen(false)}
              >
                {brandLogo ? (
                  brandLogo
                ) : (
                  <span className="brand-text">Klein⁘Byte</span>
                )}
              </LocaleLink>
              <button
                className="mobile-menu__close"
                onClick={toggleMenu}
                aria-label="toggle-theme"
              >
                {closeIconSvg}
              </button>
            </div>

            <ul className="menu__inner">
              {MENU_ITEMS.map((item) => (
                <li
                  key={item.labelKey}
                  className={`menu__item ${
                    item.submenu ? "menu__dropdown" : ""
                  }`}
                >
                  {item.submenu ? (
                    <>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMenuItemClick(item);
                        }}
                        className={`menu__link ${
                          activeSubmenu === item.labelKey ? "active" : ""
                        }`}
                      >
                        {t(item.labelKey)}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </a>
                      <Submenu
                        items={item.submenu}
                        type={item.type || "normal"}
                        isActive={activeSubmenu === item.labelKey}
                      />
                    </>
                  ) : (
                    <LocaleLink
                      to={item.href || "/"}
                      className="menu__link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t(item.labelKey)}
                    </LocaleLink>
                  )}
                </li>
              ))}
            </ul>

            <div className="mobile-menu__footer">
              <div className="language-dropdown">
                <button className="language-btn rounded-xs h-9.5">
                  <span className="language-label">{LANG_NAMES[locale]}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div className="language-menu">
                  {SUPPORTED_LOCALES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`language-item ${
                        locale === lang ? "active" : ""
                      }`}
                    >
                      {LANG_NAMES[lang]}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="switch bg-orange-500 rounded-full"
                onClick={toggleDarkMode}
              >
                <span className="switch__light">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v6m0 6v6M4.22 4.24 4.24m5.08 0l4.24-4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08 0l4.24 4.24" />
                  </svg>
                </span>
                <span className="switch__dark">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Section */}
        <section className="navbar__right">
          {/* Language Selector */}
          <div className="language-dropdown">
            <button className="language-btn rounded-xs h-9.5">
              <span className="language-label">{LANG_NAMES[locale]}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div className="language-menu">
              {SUPPORTED_LOCALES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`language-item ${locale === lang ? "active" : ""}`}
                >
                  {LANG_NAMES[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Switcher */}
          <button
            className="switch border border-white rounded-full"
            onClick={toggleDarkMode}
          >
            <span className="switch__light hover:[&>svg]:stroke-black!">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-moon-icon lucide-moon !stroke-white "
              >
                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
              </svg>
            </span>
            <span className="switch__dark">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-sun-icon lucide-sun"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            </span>
          </button>
        </section>
      </nav>
    </header>
  );
};

interface SubmenuProps {
  items: SubmenuItem[];
  type: "normal" | "text";
  isActive: boolean;
}

const Submenu = ({items, type, isActive}: SubmenuProps) => {
  const {t} = useTranslation();
  return (
    <div
      className={`submenu p-1 megamenu__${type} ${isActive ? "is-active" : ""}`}
    >
      {items.map((category) => (
        <div
          key={category.titleKey}
          className="submenu__inner w-full flex flex-col justify-start items-start text-left p-0 m-0"
        >
          <h4 className="submenu__title bg-violet-500 w-full h-16 rounded-xs text-white flex items-center px-3 !m-0 !py-0">
            {t(category.titleKey)}
          </h4>
          <ul className="submenu__list !text-left flex flex-col justify-start items-start bg-[#3c3c3c] gap-1 w-full gap-y-1">
            {category.items.map((item) => (
              <li key={item.labelKey} className="text-left w-full">
                <LocaleLink to={item.href} className={"text-left w-full"}>
                  {t(item.labelKey)}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
