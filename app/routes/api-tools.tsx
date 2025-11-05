import type {Route} from "./+types/home";
import Layout from "~/components/layout";

import FOLDER from "/folder.svg";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";

export const meta: MetaFunction = () => {
  const meta = generateMeta(
    {
      title: "Free Online API Tools - Test, Debug & Monitor APIs | Kleinbyte",
      description: "Every tool you need for API development in one place. 100% free API tools including testing, debugging, documentation, and monitoring with just a few clicks.",
      url: "https://kleinbyte.com/api-tools",
      image: "https://kleinbyte.com/og-image-api-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: "Kleinbyte API Tools",
          url: "https://kleinbyte.com/api-tools",
          description: "Comprehensive API tools for testing, debugging and documentation",
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
          name: "How to Use API Tools",
          description: "Simple steps to work with APIs using our tools",
        }),
      },
    ]
  );
  return meta;
};

export default function ApiTools() {
  const apiTools = [
    {
      name: "API Tester",
      description: "Test your API endpoints with various HTTP methods",
      link: "#",
      icon: FOLDER
    },
    {
      name: "API Debugger",
      description: "Debug and troubleshoot API requests and responses",
      link: "#",
      icon: FOLDER
    },
    {
      name: "API Documentation Generator",
      description: "Generate documentation from your API specifications",
      link: "#",
      icon: FOLDER
    },
    {
      name: "API Monitor",
      description: "Monitor API performance and uptime",
      link: "#",
      icon: FOLDER
    },
    {
      name: "Headers Inspector",
      description: "View and modify API request/response headers",
      link: "#",
      icon: FOLDER
    },
    {
      name: "OAuth Helper",
      description: "Assist with OAuth token generation and testing",
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
              API Tools
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Every tool you need for API development in one place. All tools are 100% FREE and easy to use!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apiTools.map((tool, index) => (
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">API Integration Types</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['REST', 'GraphQL', 'SOAP', 'JSON-RPC', 'XML-RPC', 'Webhooks', 'OAuth', 'API Keys', 'JWT'].map((type, index) => (
                <div 
                  key={index} 
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md"
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}