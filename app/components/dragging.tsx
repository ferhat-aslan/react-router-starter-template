import {
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  use,
} from "react";
import PDFSVG from "/public/pdf.svg";

// Define a type for the box item for better type safety
type BoxItem = File; // Assuming the items are File objects

export default function Dragging({
  list,
  onChange,
  ref,
}: {
  list: BoxItem[];
  onChange: (files: BoxItem[]) => void;
  ref: React.Ref<any>;
}) {
  const [boxes, setBoxes] = useState(list);
  const [draggedItem, setDraggedItem] = useState<{
    index: number;
    element: HTMLElement;
  } | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [touchPosition, setTouchPosition] = useState({x: 0, y: 0});
  const ghostRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getBoxes: () => boxes,
    setBoxes: (newBoxes: BoxItem[]) => setBoxes(newBoxes),
  }));

  // --- Desktop Drag Handlers ---

  const onDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>, index: number) => {
      event.currentTarget.style.opacity = "0.4";
      event.dataTransfer.setData("text/plain", index.toString());
    },
    []
  );

  const onDragEnd = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.opacity = "1";
    setDragOverIndex(null); // Clear drag over state
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const index = Number(e.currentTarget.getAttribute("data-index"));
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    // Only clear if leaving the entire container, not just moving between children
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      e.preventDefault();
      e.stopPropagation();

      const dragIndex = Number(e.dataTransfer.getData("text/plain"));
      if (dragIndex === dropIndex) {
        setDragOverIndex(null);
        return;
      }

      const newBoxes = [...boxes];
      const [draggedItem] = newBoxes.splice(dragIndex, 1);
      newBoxes.splice(dropIndex, 0, draggedItem);

      setBoxes(newBoxes);
      onChange(newBoxes);
      setDragOverIndex(null);
    },
    [boxes, onChange]
  );

  // --- Mobile Touch Handlers ---

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>, index: number) => {
      const touch = e.touches[0];
      const element = e.currentTarget;

      // Store the dragged item's info
      setDraggedItem({index, element});

      // Create a "ghost" element that follows the finger
      const ghost = element.cloneNode(true) as HTMLElement;
      ghost.style.position = "fixed";
      ghost.style.top = `${touch.clientY - 80}px`; // Offset to center under finger
      ghost.style.left = `${touch.clientX - 60}px`;
      ghost.style.width = "120px";
      ghost.style.height = "160px";
      ghost.style.pointerEvents = "none"; // Prevent it from interfering with touch events
      ghost.style.zIndex = "1000";
      ghost.style.opacity = "0.9";
      ghost.style.transform = "rotate(5deg)";
      ghost.id = "drag-ghost";
      document.body.appendChild(ghost);
      ghostRef.current = ghost as any;

      // Hide the original element
      element.style.opacity = "0.5";
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault(); // Prevent page scrolling
      if (!draggedItem) return;

      const touch = e.touches[0];
      setTouchPosition({x: touch.clientX, y: touch.clientY});

      // Move the ghost element
      if (ghostRef.current) {
        ghostRef.current.style.top = `${touch.clientY - 80}px`;
        ghostRef.current.style.left = `${touch.clientX - 60}px`;
      }

      // Find the element below the touch point
      const elementBelow = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      );
      if (!elementBelow) return;

      let droppableBelow = elementBelow;
      while (droppableBelow && !droppableBelow.classList.contains("box")) {
        droppableBelow = droppableBelow.parentElement as any;
      }

      if (droppableBelow) {
        const dropIndex = Number(droppableBelow.getAttribute("data-index"));
        if (dropIndex !== draggedItem.index) {
          setDragOverIndex(dropIndex);
        }
      } else {
        setDragOverIndex(null);
      }
    },
    [draggedItem]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!draggedItem) return;

      const {index: dragIndex} = draggedItem;
      const dropIndex = dragOverIndex;

      // Perform the swap if the drop target is valid
      if (dropIndex !== null && dropIndex !== dragIndex) {
        const newBoxes = [...boxes];
        const [item] = newBoxes.splice(dragIndex, 1);
        newBoxes.splice(dropIndex, 0, item);

        setBoxes(newBoxes);
        onChange(newBoxes);
      }

      // --- Cleanup ---
      // Remove the ghost element
      if (ghostRef.current) {
        ghostRef.current.remove();
        ghostRef.current = null;
      }
      // Reset original element's opacity
      draggedItem.element.style.opacity = "1";
      // Reset state
      setDraggedItem(null);
      setDragOverIndex(null);
    },
    [draggedItem]
  );

  // Cleanup ghost element on component unmount
  useEffect(() => {
    return () => {
      if (ghostRef.current) {
        ghostRef.current.remove();
      }
    };
  }, []);

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
      <div className="grid grid-cols-3 border-2 border-dashed border-gray-300 rounded-lg w-full max-w-xl mx-auto">
        {boxes.map((box, index) => (
          <div
            key={`${box.name}-${index}`}
            draggable="true"
            data-index={index} // Added data-index for mobile touch handling
            className={`border rounded-4xl block place-content-center truncate select-none relative h-40 line-clamp-3 border-gray-300 p-4 justify-center items-center box transition-all duration-150 ${
              dragOverIndex === index ? "over scale-105 shadow-lg" : ""
            }`}
            // Desktop handlers
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            // Mobile handlers
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={PDFSVG as any}
              alt="PDF Icon"
              className="mb-4 size-14 select-none"
            />
            {box.name}
            <span className="absolute top-0 -start-0 aspect-square w-5 h-5 rounded-full bg-amber-400 text-black flex justify-center items-center text-xs">
              {index + 1}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
