import { useState } from "react";
import { extractAudioFromVideo } from "../utils/compressVideo";
import { ArrowRight, UploadCloud } from "lucide-react";

const VARIANTS = [
  {
    label: "Emotional",
    video_url:
      "https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc0shz4v000jcdljvshzeyh5_1750181132.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXEFUNV7O4BRRCEX5%2F20250617%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250617T172538Z&X-Amz-Expires=604800&X-Amz-Signature=cfdf23fcf9e362fe4334d310fdc6ff513d650f3b5efb0383580411e5f8be185c&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dcmc0shz4v000jcdljvshzeyh5.mp4&x-id=GetObject",
  },
  {
    label: "Curiosity",
    video_url:
      "https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc0snvc4000tcdlj4u54aqty_1750181552.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXEFUNV7O4BRRCEX5%2F20250617%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250617T173245Z&X-Amz-Expires=604800&X-Amz-Signature=0bac627cec47531b855df945ab57eec073d6c48f959059da45005a23295ad7ef&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dcmc0snvc4000tcdlj4u54aqty.mp4&x-id=GetObject",
  },
  {
    label: "Urgency",
    video_url:
      "https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc0sx06a0011cdlj5vz37ed4_1750182243.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXEFUNV7O4BRRCEX5%2F20250617%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250617T174423Z&X-Amz-Expires=604800&X-Amz-Signature=8a3814573151d6dd50766db52d7eba0e7f221dcb0de8fbf0a0653fcaf116cf08&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dcmc0sx06a0011cdlj5vz37ed4.mp4&x-id=GetObject",
  },
];

export default function HookRecreator() {
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");

  const allowedTypes = [
    "video/mp4",
    "video/mpeg",
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/mpga",
    "audio/m4a",
    "audio/wav",
    "video/webm",
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setError("");
    setOriginalUrl("");

    if (!file) return setVideo(null);
    if (!allowedTypes.includes(file.type)) {
      setError("Unsupported file type");
      return setVideo(null);
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("File exceeds 25 MB limit");
      return setVideo(null);
    }

    const renamedFile = new File([file], "uploaded-video.mp4", {
      type: "video/mp4",
    });

    setVideo(renamedFile);
    setOriginalUrl(URL.createObjectURL(renamedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) return;
    setError("");
    setLoading(true);

    try {
      const compressed = await extractAudioFromVideo(video);
      const formData = new FormData();
      formData.append("video", compressed);

      await fetch(
        "https://pdog.app.n8n.cloud/webhook/61391805-edbc-4f68-98ae-5d127977bae4",
        {
          method: "POST",
          body: formData,
        }
      );

      setShowModal(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Hook Variants Generator
          </h2>
          <p className="text-sm text-gray-500">
            Upload a video and we'll recreate it into 3 viral hooks: Emotional,
            Curiosity, and Urgency.
          </p>
        </div>

        {/* Upload only */}
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-400 transition">
          <label
            htmlFor="video-upload"
            className="flex flex-col items-center space-y-2"
          >
            <UploadCloud className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-700">
              Drag and drop your video here
            </span>
            <span className="text-xs text-gray-400">
              or click to select a file
            </span>
            <span className="text-xs text-gray-400">
              MP4, MOV, or WebM up to 25MB
            </span>
          </label>
          <input
            type="file"
            id="video-upload"
            accept=".mp4,.mpeg,.mp3,.mpga,.m4a,.wav,.webm"
            onChange={handleFileChange}
            className="hidden"
            required
          />
          {video && (
            <div className="text-xs text-gray-600 mt-2 truncate">
              Selected: {video.name}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-3 rounded-md flex justify-center items-center gap-2 transition"
          disabled={loading}
        >
          {loading ? (
            "Uploading..."
          ) : (
            <>
              Generate Variants <ArrowRight size={16} />
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <p className="text-center text-red-600 font-medium text-sm">
            {error}
          </p>
        )}
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative text-center space-y-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-2xl"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold">
              Your video is being processed.
            </h3>
            <p className="text-sm text-gray-600">
              You'll receive 3 new variants shortly: Emotional, Curiosity, and
              Urgency.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
