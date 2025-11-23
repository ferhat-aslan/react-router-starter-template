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
      title: t("spreadsheet.meta.title"),
      description: t("spreadsheet.meta.description"),
      url: "https://kleinbyte.com/spreadsheet-tools",
      image: "https://kleinbyte.com/og-image-spreadsheet-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("spreadsheet.title"),
          url: "https://kleinbyte.com/spreadsheet-tools",
          description: t("spreadsheet.description"),
          applicationCategory: "BusinessApplication",
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
          name: t("spreadsheet.title"),
          description: t("spreadsheet.description"),
        }),
      },
    ]
  );
  return meta;
};

export default function SpreadsheetTools() {
  const { t } = useTranslation();
  const spreadsheetTools = [
    {
      name: "Excel Converter",
      description: "Convert between different spreadsheet formats (XLS, XLSX, CSV, etc.)",
      link: "#",
      icon: FOLDER
    },
    {
      name: "CSV Editor",
      description: "Edit and manipulate CSV files online",
      link: "#",
      icon: FOLDER
    },
    {
      name: "Spreadsheet Merger",
      description: "Combine multiple spreadsheet files into one",
      link: "#",
      icon: FOLDER
    },
    {
      name: "Data Cleaner",
      description: "Clean and format your spreadsheet data",
      link: "#",
      icon: FOLDER
    },
    {
      name: "Formula Helper",
      description: "Generate and validate spreadsheet formulas",
      link: "#",
      icon: FOLDER
    },
    {
      name: "Chart Generator",
      description: "Create charts and graphs from your data",
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
              {t("spreadsheet.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("spreadsheet.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spreadsheetTools.map((tool, index) => (
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Supported File Formats</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['XLS', 'XLSX', 'CSV', 'TSV', 'ODS', 'XML', 'JSON', 'PDF'].map((format, index) => (
                <div 
                  key={index} 
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md"
                >
                  {format}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}