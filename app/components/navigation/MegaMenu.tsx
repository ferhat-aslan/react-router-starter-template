import {useState, useEffect, useRef} from "react";
import {useLocation, useNavigate} from "react-router";
import {LocaleLink} from "../locale-link";
import {
  useTranslation,
  SUPPORTED_LOCALES,
  type Locale,
} from "../../utils/route-utils";
import "./megamenu.css";

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
  {labelKey: "nav.home", href: "/"},
  {
    labelKey: "nav.tools",
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
      {
        titleKey: "tools.documents.category",
        items: [
          {labelKey: "nav.docx_tools", href: "/docx-tools"},
          {labelKey: "nav.latex_tools", href: "/latex-tools"},
          {labelKey: "nav.spreadsheet_tools", href: "/spreadsheet-tools"},
          {labelKey: "nav.file_converter", href: "/tools/file-converter"},
        ],
      },
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
  {labelKey: "nav.blog", href: "/blog"},
  {labelKey: "nav.about", href: "/about"},
  {labelKey: "nav.search", href: "/search"},
];

export const MegaMenu = ({brandLogo}: {brandLogo?: React.ReactNode}) => {
  const {t} = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {pathname} = useLocation();
  const navigate = useNavigate();

  const currentLocale = (pathname.split("/")[1] as Locale) || "en";
  const locale = SUPPORTED_LOCALES.includes(currentLocale)
    ? currentLocale
    : "en";

  // Initialize dark mode from localStorage or HTML
  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
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

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setActiveSubmenu(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (item.submenu && window?.innerWidth < 768) {
      setActiveSubmenu(item?.labelKey);
    } else if (item.href) {
      setIsMenuOpen(false);
    }
  };

  const handleBackClick = () => {
    setActiveSubmenu(null);
  };

  return (
    <header className="header">
      <nav className="navbar container">
        {/* Left Section */}
        <section className="navbar__left">
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
            <div className={`menu__header ${activeSubmenu ? "is-active" : ""}`}>
              <span className="menu__arrow" onClick={handleBackClick}>
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
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </span>
              <span className="menu__title">{activeSubmenu}</span>
            </div>
            <ul className="menu__inner">
              {MENU_ITEMS.map((item) => (
                <li
                  key={item.labelKey}
                  className={`menu__item ${
                    item.submenu ? "menu__dropdown" : ""
                  }`}
                  onClick={() => handleMenuItemClick(item)}
                >
                  {item.submenu ? (
                    <>
                      <a
                        onClick={(e) => e.preventDefault()}
                        className="menu__link"
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
                        isActive={activeSubmenu === t(item.labelKey)}
                      />
                    </>
                  ) : (
                    <LocaleLink to={item.href || "/"} className="menu__link">
                      {t(item.labelKey)}
                    </LocaleLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Right Section */}
        <section className="navbar__right">
          {/* Language Selector */}
          <div className="language-dropdown">
            <button className="language-btn">
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
          <button className="switch" onClick={toggleDarkMode}>
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
                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08 0l4.24 4.24" />
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
    <div className={`submenu megamenu__${type} ${isActive ? "is-active" : ""}`}>
      {items.map((category) => (
        <div key={category.titleKey} className="submenu__inner">
          <h4 className="submenu__title">{t(category.titleKey)}</h4>
          <ul className="submenu__list">
            {category.items.map((item) => (
              <li key={item.labelKey}>
                <LocaleLink to={item.href}>{t(item.labelKey)}</LocaleLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
