import type {Route} from "./+types/home";
import Layout from "~/components/layout";

import FOLDER from "/folder.svg";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";

import { useTranslation, translations, type Locale } from "~/i18n/context";

export const meta: MetaFunction = ({location}) => {
  const locale: Locale = 
    location.pathname.split("/")?.[1] === "de" ? "de" : 
    location.pathname.split("/")?.[1] === "es" ? "es" : 
    location.pathname.split("/")?.[1] === "ar" ? "ar" : "en";
  const messages = translations[locale] ?? translations.en;

  function t(key: string) {
    return messages[key] ?? key;
  }

  const meta = generateMeta(
    {
      title: t("formatter.meta.title"),
      description: t("formatter.meta.description"),
      url: "https://kleinbyte.com/code-formatter",
      image: "https://kleinbyte.com/og-image-code-formatter.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("formatter.title"),
          url: "https://kleinbyte.com/code-formatter",
          description: t("formatter.description"),
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
          }
        }),
      },
      {
        "script:ld+json": course({
          "@type": "HowTo",
          name: t("formatter.title"),
          description: t("formatter.description"),
        }),
      },
    ]
  );
  return meta;
};

export default function CodeFormatter() {
  const { t } = useTranslation();
  const codeTools = [
    {
      name: "HTML Formatter",
      description: "Format and beautify your HTML code",
      link: "#",
      icon: FOLDER
    },
    {
      name: "CSS Formatter",
      description: "Format and organize your CSS code",
      link: "#",
      icon: FOLDER
    },
    {
      name: "JavaScript Formatter",
      description: "Format and beautify JS code with proper indentation",
      link: "#",
      icon: FOLDER
    },
    {
      name: "Python Formatter",
      description: "Format Python code with proper PEP8 styling",
      link: "#",
      icon: FOLDER
    },
    {
      name: "JSON Formatter",
      description: "Format and validate JSON data",
      link: "/json-tools",
      icon: FOLDER
    },
    {
      name: "SQL Formatter",
      description: "Format and organize SQL queries",
      link: "#",
      icon: FOLDER
    }
  ];

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t("formatter.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("formatter.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {codeTools.map((tool, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <img src={tool.icon} alt={tool.name} className="w-10 h-10 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
                <a 
                  href={tool.link}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  Use Tool
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Supported Languages</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['JavaScript', 'TypeScript', 'HTML', 'CSS', 'JSON', 'XML', 'Python', 'Java', 'C#', 'PHP', 'SQL', 'Ruby', 'Go', 'C++', 'Swift'].map((lang, index) => (
                <div 
                  key={index} 
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md"
                >
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}