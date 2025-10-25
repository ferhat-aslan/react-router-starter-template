import type {Route} from "./+types/home";
import Layout from "~/components/layout";
import SVG from "/pdf.svg";
import WORD from "/word.svg";
import TXT from "/txt.svg";
import JPG from "/jpg.svg";
import {NavLink} from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    {title: "PDF Tools - APIs & Samples"},
    {name: "description", content: "Welcome to PDF Tools!"},
  ];
}

export default function PDFTools() {
  return (
    <Layout>
      {/* Card Blog */}
      <section className="flex flex-col md:grid w-full grid-cols-12 container mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-16">
        <h1 className="col-span-12 text-center text-6xl font-bold">
          Every tool you need to work with PDFs in one place
        </h1>
        <h6 className="col-span-10 col-start-2 text-center text-lg text-gray-600 dark:text-neutral-400">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE
          and easy to use! Merge, split, compress, convert, rotate, unlock and
          watermark PDFs with just a few clicks.
        </h6>

        <aside className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="option-grid-box">
            <span className="flex relative">
              <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />
              <img
                src={SVG}
                alt="PDF Icon"
                className="mb-4 size-14 absolute left-2 bottom-2 shadow-lg"
              />
              <img
                src={SVG}
                alt="PDF Icon"
                className="mb-4 size-14 absolute left-4 bottom-4 shadow-xl"
              />
            </span>
            <h3 className="text-xl font-semibold mb-2">Merge PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <span className="flex flex-row justify-start item-center gap-x-5">
              <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />
              <img src={SVG} alt="PDF Icon" className="mb-4 size-10" />
              <img src={SVG} alt="PDF Icon" className="mb-4 size-6" />
            </span>
            <h3 className="text-xl font-semibold mb-2">Split PDF Pages</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <span className="flex flex-row justify-start items-center gap-x-5">
              <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />
              <img src={WORD} alt="Word Icon" className="mb-4 size-14" />
            </span>
            <h3 className="text-xl font-semibold mb-2">Word to PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <span className="flex flex-row justify-start items-center gap-x-5">
              <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />
              <img src={TXT} alt="Txt Icon" className="mb-4 size-14" />
            </span>
            <h3 className="text-xl font-semibold mb-2">PDF to Text</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <span className="flex flex-row justify-start items-center gap-x-5">
              <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />
              <img src={JPG} alt="Jpg Icon" className="mb-4 size-14" />
            </span>
            <h3 className="text-xl font-semibold mb-2">PDF to Images</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <NavLink
            to="/amazon"
            viewTransition
            className="group hidden hover:bg-neutral-100 cursor-pointer flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
          >
            <div className="h-52 flex flex-col justify-center items-center bg-amber-500 rounded-t-xl">
              <img src={SVG} alt="Slack Logo" className=" w-32" />
            </div>
            <div className="p-4 md:p-6">
              <span className="block mb-1 text-xs font-semibold uppercase text-amber-500">
                Pdf tools
              </span>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                Pdf Generation
              </h3>
              <p className="mt-3 text-gray-500 dark:text-neutral-500">
                Email collaboration and email service desk made easy.
              </p>
            </div>

            <div className="mt-auto flex group-hover:translate-x-1 transition-all duration-300 items-center font-semibold px-5 justify-center text-violet-500  h-10  cursor-pointer  text-center w-full border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
              Go to Tool →
            </div>
          </NavLink>
        </aside>
      </section>
      {/* End Card Blog */}
    </Layout>
  );
}
