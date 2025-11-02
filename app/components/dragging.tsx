import {useImperativeHandle, useState} from "react";
import PDFSVG from "/public/pdf.svg";

export default function Dragging({
  list,
  onChange,
  ref,
}: {
  list: any[];
  onChange: (files: File[]) => void;
  ref: React.Ref<any>;
}) {
  const [boxes, setBoxes] = useState(list);

  useImperativeHandle(ref, () => ({
    getBoxes: () => boxes,
    setBoxes: (newBoxes: any[]) => setBoxes(newBoxes),
  }));

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.currentTarget.style.opacity = "0.4";
    event.dataTransfer.setData("text/plain", index.toString());
  };

  const onDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.opacity = "1";
    const boxElements = document.querySelectorAll(".box");
    boxElements.forEach((box) => {
      box.classList.remove("over");
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    return false;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.add("over");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("over");
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const dragIndex = Number(e.dataTransfer.getData("text/plain"));
    const newBoxes = [...boxes];
    const [draggedItem] = newBoxes.splice(dragIndex, 1);
    newBoxes.splice(dropIndex, 0, draggedItem);

    setBoxes(newBoxes);
    onChange(newBoxes);
    return false;
  };

  if (boxes.length === 0) {
    return (
      <span className="border border-dashed w-full h-40 rounded-4xl grid grid-cols-3 place-items-center text-gray-400">
        <span className="text-8xl border border-dashed w-full h-full rounded-4xl grid place-items-center">
          1
        </span>
        <span className="text-8xl border border-dashed w-full h-full rounded-4xl grid place-items-center">
          2
        </span>
        <span className="text-8xl border border-dashed w-full h-full rounded-4xl grid place-items-center">
          3
        </span>
      </span>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3  border-2  border-dashed border-gray-300 rounded-lg w-full max-w-xl mx-auto">
        {boxes.map((box, index) => (
          <div
            key={box + index}
            draggable="true"
            className="border rounded-4xl block place-content-center  truncate relative h-40 line-clamp-3 border-gray-300  p-4  justify-center items-center box"
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            <img src={PDFSVG} alt="PDF Icon" className="mb-4 size-14" />
            {box.name}
            <span className="absolute top-0 -start-0 aspect-square w-5 h-5 rounded-full bg-amber-400 text-black flex justify-center items-center">
              {index + 1}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
