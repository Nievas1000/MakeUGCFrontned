import { useState } from "react";
import { extractAudioFromVideo } from "../utils/compressVideo";

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
  const [email, setEmail] = useState("");
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
    setError("");
    if (!video) return;

    setLoading(true);
    try {
      const compressed = await extractAudioFromVideo(video);
      const formData = new FormData();
      formData.append("video", compressed);
      formData.append("email", email);

      const res = await fetch(
        "https://pdog.app.n8n.cloud/webhook/61391805-edbc-4f68-98ae-5d127977bae4",
        {
          method: "POST",
          body: formData,
        }
      );

      /* if (!res.ok) throw new Error("Failed to upload video"); */

      setShowModal(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-8 pt-5">
        <input
          type="file"
          accept=".mp4,.mpeg,.mp3,.mpga,.m4a,.wav,.webm"
          onChange={handleFileChange}
          className="w-full border-b-2 border-gray-300 py-2 focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b-2 border-gray-300 py-2 focus:border-blue-500 focus:outline-none"
          required
        />
        <button
          type="submit"
          className="block w-full py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Generate"}
        </button>

        {error && (
          <p className="text-center text-red-600 font-medium text-sm">
            {error}
          </p>
        )}
      </form>

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
              We'll notify you via email once your video is ready.
            </h3>
          </div>
        </div>
      )}
    </>
  );
}
