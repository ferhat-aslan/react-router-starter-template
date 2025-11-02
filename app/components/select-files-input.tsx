import PDF from "../../public/pdf.svg";
import FolderSVG from "/public/folder.svg";
export default function SelectFilesInput({
  onChange,
}: {
  onChange: (files: FileList | null) => void;
}) {
  return (
    <div
      className="border border-dashed border-violet-400 rounded-4xl hover:shadow-inner hover:border-2 max-w-lg min-h-52 cursor-pointer w-full flex flex-col justify-center items-center"
      onClick={() => {
        const fileInput = document.getElementById("file-input");
        if (fileInput) {
          fileInput.click();
        }
      }}
    >
      <input
        type="file"
        multiple
        accept="application/pdf"
        className="hidden"
        id="file-input"
        onChange={(e) => {
          const files = e.target.files;
          onChange(files);
        }}
      />
      <img src={FolderSVG} alt="PDF Icon" className="mb-4 size-14" />
      <h2 className="text-2xl font-bold">Click and Select Files</h2>
      <span>Drag and drop PDF files here</span>
    </div>
  );
}
