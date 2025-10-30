import Layout from "~/components/layout";
import type {Route} from "../+types/home";
import PDF from "/pdf.svg";
import SelectFilesInput from "~/components/select-files-input";
import Dragging from "~/components/dragging";
import {useEffect, useRef, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    {title: "New React Router App"},
    {name: "description", content: "Welcome to React Router!"},
  ];
}
export default function Home() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [orderedFiles, setOrderedFiles] = useState<File[]>([]);
  const draggingRef = useRef(null);

  return (
    <Layout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 justify-start items-center">
        <h1 className="text-4xl font-bold mb-4">Merge PDFs</h1>
        <p className="text-lg text-gray-600 dark:text-neutral-400">
          Easy - Fast - Free PDF Merger. Combine multiple PDF files into a
          single document online. No installation or registration/login and
          required and secured.
        </p>
        <SelectFilesInput
          onChange={(newFiles: any) => {
            (draggingRef.current as any)?.setBoxes(Array.from(newFiles));
            setFiles(newFiles);
          }}
        />
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => {
            const form = new FormData();
            orderedFiles.forEach((file) => {
              form.append("files", file);
            });
            //return application/pdf
            fetch("http://localhost:8000/merge-pdf", {
              method: "POST",
              body: form,
            })
              .then((response) => response.blob())
              .then((data) => {
                const url = URL.createObjectURL(data);
                const a = document.createElement("a");
                a.href = url;
                a.download = "merged.pdf";
                document.body.appendChild(a);
                a.setAttribute("target", "_blank");
                a.setAttribute("download", "merged.pdf");
                a.click();
                a.remove();
              });
          }}
        >
          Merge PDFs
        </button>
        {files?.length && (
          <Dragging
            list={files ? Array.from(files) : []}
            onChange={setOrderedFiles}
            ref={draggingRef}
          />
        )}
      </section>
    </Layout>
  );
}
