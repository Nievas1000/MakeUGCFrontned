import { useRef, useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";

export default function DragDropUploader({ onFileSelected, file, onRemove }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  const triggerSelect = () => {
    inputRef.current.click();
  };

  return (
    <div>
      <h5 className="mb-3 font-bold">Upload Video</h5>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-md p-6 text-center transition ${
          dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleChange}
          className="hidden"
          accept="video/*"
        />

        {!previewUrl ? (
          <div
            className="flex flex-col items-center space-y-2 cursor-pointer"
            onClick={triggerSelect}
          >
            <UploadCloud className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-700">
              Drag and drop your video here
            </span>
            <span className="text-xs text-gray-400">
              or click to select a file
            </span>
            <span className="text-xs text-gray-400">
              (MP4, MOV, WebM, max 100MB)
            </span>
          </div>
        ) : (
          <div className="relative">
            <video
              src={previewUrl}
              controls
              className="w-full h-56 object-contain rounded"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 border border-gray-300 text-xs px-2 py-1 rounded flex items-center space-x-1"
            >
              <X size={14} />
              <span>Remove</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
