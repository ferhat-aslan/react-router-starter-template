import {useImperativeHandle, useState} from "react";

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

  return (
    <>
      <div className="grid grid-cols-3 gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg w-full max-w-lg mx-auto">
        {boxes.map((box, index) => (
          <div
            key={box + index}
            draggable="true"
            className="border truncate line-clamp-3 border-gray-300 rounded-lg p-4 flex justify-center items-center box"
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            {box.name}
          </div>
        ))}
      </div>
    </>
  );
}
