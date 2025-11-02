import type {Route} from "./+types/home";
import Layout from "~/components/layout";
import SVG from "/pdf.svg";
console.time("docx-tools-load-time");

export function meta({}: Route.MetaArgs) {
  return [
    {title: "Docx Tools - APIs & Samples"},
    {name: "description", content: "Welcome to Docx Tools!"},
  ];
}
console.timeEnd("docx-tools-load-time");
export default function DocxTools() {
  return (
    <Layout>
      {/* Card Blog */}
      <section className="grid w-full grid-cols-12 container mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-4">
        <h1 className="col-span-12 text-center text-6xl font-bold">
          Every tool you need to work with PDFs in one place
        </h1>
        <h6 className="col-span-10 col-start-2 text-center text-lg text-gray-600 dark:text-neutral-400">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE
          and easy to use! Merge, split, compress, convert, rotate, unlock and
          watermark PDFs with just a few clicks.
        </h6>
        <div className="col-span-12 flex flex-wrap xl:flex-nowrap justify-center gap-4 mt-4 mb-8">
          <div className=" tag" data-filter="all">
            All
          </div>
          <div className="tag" data-filter="workflows">
            Workflows
          </div>
          <div className="tag" data-filter="organize">
            Organize PDF
          </div>
          <div className="tag" data-filter="optimize">
            Optimize PDF
          </div>
          <div className="tag" data-filter="convert">
            Convert PDF
          </div>
          <div className="tag" data-filter="edit">
            Edit PDF
          </div>
          <div className="tag" data-filter="security">
            PDF Security
          </div>
        </div>
        <aside className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="option-grid-box">
            <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />
            <h3 className="text-xl font-semibold mb-2">Merge PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />

            <h3 className="text-xl font-semibold mb-2">Merge PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />

            <h3 className="text-xl font-semibold mb-2">Merge PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />

            <h3 className="text-xl font-semibold mb-2">Merge PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />

            <h3 className="text-xl font-semibold mb-2">Merge PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />

            <h3 className="text-xl font-semibold mb-2">Merge PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
        </aside>
      </section>
      {/* End Card Blog */}
    </Layout>
  );
}
