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
import { Plus, Upload } from "lucide-react";

// Define a type for the box item for better type safety
type BoxItem = File; // Assuming the items are File objects

export default function Dragging({
  list,
  onChange,
  ref,
  accept = ".pdf",
}: {
  list: BoxItem[];
  onChange: (files: BoxItem[]) => void;
  ref: React.Ref<any>;
  accept?: string;
}) {
  const [boxes, setBoxes] = useState(list);
  const [draggedItem, setDraggedItem] = useState<{
    index: number;
    element: HTMLElement;
  } | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [touchPosition, setTouchPosition] = useState({x: 0, y: 0});
  const ghostRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    getBoxes: () => boxes,
    setBoxes: (newBoxes: BoxItem[]) => setBoxes(newBoxes),
  }));

  // --- File Upload Handlers ---

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newFiles = Array.from(files);
      const updatedBoxes = [...boxes, ...newFiles];
      setBoxes(updatedBoxes);
      onChange(updatedBoxes);
    },
    [boxes, onChange]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
      // Reset input so same file can be selected again
      e.target.value = '';
    },
    [handleFileSelect]
  );

  const handleContainerDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Check if dragging files from outside
    if (e.dataTransfer.types.includes('Files')) {
      setIsDraggingFile(true);
    }
  }, []);

  const handleContainerDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only clear if leaving the container entirely
    if (e.currentTarget === e.target) {
      setIsDraggingFile(false);
    }
  }, []);

  const handleContainerDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingFile(false);

      // Check if dropping files from outside
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect]
  );

  // --- Desktop Drag Handlers (for reordering) ---

  const onDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>, index: number) => {
      event.currentTarget.style.opacity = "0.4";
      event.dataTransfer.setData("text/plain", index.toString());
      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const onDragEnd = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.opacity = "1";
    setDragOverIndex(null);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Only allow move for reordering
    if (!e.dataTransfer.types.includes('Files')) {
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const index = Number(e.currentTarget.getAttribute("data-index"));
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      e.preventDefault();
      e.stopPropagation();

      // Check if it's a file drop from outside
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        return; // Let container handle it
      }

      const dragIndex = Number(e.dataTransfer.getData("text/plain"));
      if (dragIndex === dropIndex || isNaN(dragIndex)) {
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
    [draggedItem, dragOverIndex, boxes, onChange]
  );

  // Cleanup ghost element on component unmount
  useEffect(() => {
    return () => {
      if (ghostRef.current) {
        ghostRef.current.remove();
      }
    };
  }, []);

  // Empty state - show grid with only Add Files item
  if (boxes.length === 0) {
    return (
      <div className="relative w-full">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div
          className={`grid grid-cols-2 md:grid-cols-3 gap-4 border-2 border-dashed rounded-lg w-full p-4 transition-all ${
            isDraggingFile
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
              : "border-gray-300 dark:border-neutral-700"
          }`}
          onDragOver={handleContainerDragOver}
          onDragLeave={handleContainerDragLeave}
          onDrop={handleContainerDrop}
        >
          {/* Add Files Grid Item */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-400 dark:border-blue-500 rounded-lg flex flex-col items-center justify-center h-40 p-4 cursor-pointer bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-all duration-150 group"
          >
            <Plus className="w-12 h-12 mb-2 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Add Files
            </span>
            <span className="text-xs text-blue-500 dark:text-blue-500 mt-1">
              Click or drop files
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div
        className={`grid grid-cols-2 md:grid-cols-3 gap-4 border-2 border-dashed rounded-lg w-full p-4 transition-all ${
          isDraggingFile
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
            : "border-gray-300 dark:border-neutral-700"
        }`}
        onDragOver={handleContainerDragOver}
        onDragLeave={handleContainerDragLeave}
        onDrop={handleContainerDrop}
      >
        {boxes.map((box, index) => (
          <div
            key={`${box.name}-${index}`}
            draggable="true"
            data-index={index}
            className={`border rounded-lg flex flex-col items-center justify-between truncate select-none relative h-40 p-4 box transition-all duration-150 cursor-move bg-white dark:bg-neutral-800 ${
              dragOverIndex === index
                ? "scale-105 shadow-lg border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-300 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-600"
            }`}
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* File Content */}
            <div className="flex flex-col items-center justify-center flex-1">
              {box.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(box)}
                  alt={box.name}
                  className="mb-2 size-12 object-cover rounded select-none"
                />
              ) : (
                <img
                  src={PDFSVG as any}
                  alt="PDF Icon"
                  className="mb-2 size-12 select-none dark:invert"
                />
              )}
              <span className="text-xs text-center line-clamp-2 text-gray-700 dark:text-gray-300">
                {box.name}
              </span>
            </div>
            
            {/* Bottom Bar with Order Number and Delete Button */}
            <div className="w-full flex items-center justify-between pt-2 border-t border-gray-200 dark:border-neutral-700 mt-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                #{index + 1}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newBoxes = boxes.filter((_, i) => i !== index);
                  setBoxes(newBoxes);
                  onChange(newBoxes);
                }}
                className="p-1 hover:bg-red-100 flex bg-red-50 !text-sm text-red-100 gap-x-1 justify-center items-center text-zinc-600 dark:hover:bg-red-950/30 rounded transition-colors group"
                title="Delete file"
              >
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {/* Add Files Grid Item */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-blue-400 dark:border-blue-500 rounded-lg flex flex-col items-center justify-center h-40 p-4 cursor-pointer bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-all duration-150 group"
        >
          <Plus className="w-12 h-12 mb-2 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Add Files
          </span>
          <span className="text-xs text-blue-500 dark:text-blue-500 mt-1">
            Click to browse
          </span>
        </div>
      </div>
    </div>
  );
}
