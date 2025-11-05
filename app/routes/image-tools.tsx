import type {Route} from "./+types/home";
import Layout from "~/components/layout";

import JPG from "/jpg.svg";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";

export const meta: MetaFunction = () => {
  const meta = generateMeta(
    {
      title: "Free Online Image Tools - Convert, Compress, Edit Images | Kleinbyte",
      description: "Every tool you need to work with Images in one place. 100% free image tools including convert, compress, edit, resize and manipulate images with just a few clicks.",
      url: "https://kleinbyte.com/image-tools",
      image: "https://kleinbyte.com/og-image-image-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: "Kleinbyte Image Tools",
          url: "https://kleinbyte.com/image-tools",
          description: "Comprehensive image tools including convert, compress, edit and resize functions",
          applicationCategory: "GraphicsApplication",
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
          name: "How to Use Image Tools",
          description: "Simple steps to work with images using our tools",
        }),
      },
    ]
  );
  return meta;
};

export default function ImageTools() {
  const imageTools = [
    {
      name: "Image Converter",
      description: "Convert between different image formats (JPG, PNG, GIF, WEBP, etc.)",
      link: "#",
      icon: JPG
    },
    {
      name: "Image Compressor",
      description: "Reduce image file sizes without losing quality",
      link: "#",
      icon: JPG
    },
    {
      name: "Image Editor",
      description: "Edit and annotate your images online",
      link: "#",
      icon: JPG
    },
    {
      name: "Image Resizer",
      description: "Resize images to exact dimensions",
      link: "#",
      icon: JPG
    },
    {
      name: "Image Cropper",
      description: "Crop images to specific dimensions or aspect ratios",
      link: "#",
      icon: JPG
    },
    {
      name: "Watermark Tool",
      description: "Add watermarks to protect your images",
      link: "#",
      icon: JPG
    }
  ];

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Image Tools
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Every tool you need to work with Images in one place. All tools are 100% FREE and easy to use!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {imageTools.map((tool, index) => (
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Popular Image Formats Supported</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['JPG', 'PNG', 'GIF', 'WEBP', 'BMP', 'TIFF', 'SVG'].map((format, index) => (
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