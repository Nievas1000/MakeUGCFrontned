import { useState } from "react";
import { extractAudioFromVideo } from "../utils/compressVideo";

const LANGUAGES = [
  "Afrikaans",
  "Arabic",
  "Armenian",
  "Azerbaijani",
  "Belarusian",
  "Bosnian",
  "Bulgarian",
  "Catalan",
  "Chinese",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "English",
  "Estonian",
  "Finnish",
  "French",
  "Galician",
  "German",
  "Greek",
  "Hebrew",
  "Hindi",
  "Hungarian",
  "Icelandic",
  "Indonesian",
  "Italian",
  "Japanese",
  "Kannada",
  "Kazakh",
  "Korean",
  "Latvian",
  "Lithuanian",
  "Macedonian",
  "Malay",
  "Marathi",
  "Maori",
  "Nepali",
  "Norwegian",
  "Persian",
  "Polish",
  "Portuguese",
  "Romanian",
  "Russian",
  "Serbian",
  "Slovak",
  "Slovenian",
  "Spanish",
  "Swahili",
  "Swedish",
  "Tagalog",
  "Tamil",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Urdu",
  "Vietnamese",
  "Welsh",
];

const PREVIEW_VIDEOS = {
  Arabic:
    "https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc2bp40a000ux0lvjd19n1z2_1750274283.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXEFUNV7O4BRRCEX5%2F20250618%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250618T191827Z&X-Amz-Expires=604800&X-Amz-Signature=a2bb37b06265085e7997333516905a7bd4bb8abc7474bf4298823fdf3f3c3be0&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dcmc2bp40a000ux0lvjd19n1z2.mp4&x-id=GetObject",
  German:
    "https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc2c5gy500024dlivoy5091y_1750274704.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXEFUNV7O4BRRCEX5%2F20250618%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250618T192534Z&X-Amz-Expires=604800&X-Amz-Signature=3148db05af75b996a8fea1c35d6b1de9d946adc12922309652345e3388cc458e&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dcmc2c5gy500024dlivoy5091y.mp4&x-id=GetObject",
  Spanish:
    "https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc2cevl8001px0lvh4hyb56s_1750275453.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXEFUNV7O4BRRCEX5%2F20250618%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250618T193756Z&X-Amz-Expires=604800&X-Amz-Signature=590de21a93a65bcc0c5ce7d07e918c1032b0f22daea20cc990c153e08712bb6d&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dcmc2cevl8001px0lvh4hyb56s.mp4&x-id=GetObject",
};

export default function LanguageTranslation() {
  const [video, setVideo] = useState(null);
  const [languages, setLanguages] = useState([""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [originalPreview, setOriginalPreview] = useState(null);

  const addLanguage = () => {
    if (languages.length < 3) setLanguages([...languages, ""]);
  };

  const removeLanguage = (idx) => {
    setLanguages(languages.filter((_, i) => i !== idx));
  };

  const updateLanguage = (idx, val) => {
    const arr = [...languages];
    arr[idx] = val;
    setLanguages(arr);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setError("File must be smaller than 25MB");
      setVideo(null);
      return;
    }

    const renamedFile = new File([file], "uploaded-video.mp3", {
      type: "video/mp3",
    });

    setError("");
    setVideo(renamedFile);
    setOriginalPreview(URL.createObjectURL(renamedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video || languages.some((lang) => !lang)) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const compressed = await extractAudioFromVideo(video);
      const formData = new FormData();
      formData.append("video", compressed);
      formData.append("languages", JSON.stringify(languages));
      console.log(compressed);
      await fetch(
        "https://pdog.app.n8n.cloud/webhook/ff839c4a-f848-4e3b-94a9-1b6679cf12ff",
        {
          method: "POST",
          body: formData,
        }
      );

      setShowModal(true);
    } catch (err) {
      console.log(err);
      setError("An error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-8 pt-5">
        <div className="relative">
          <div className="flex items-center">
            <input
              type="file"
              accept=".mp4,.mp3,.mpeg,.mpga,.m4a,.wav,.webm"
              onChange={handleFileChange}
              className="flex-1 border-b-2 border-gray-300 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
            <div className="relative ml-2 group cursor-pointer">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                ?
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                If your video has more than 1000 characters it may be slightly
                modified.
              </div>
            </div>
          </div>
        </div>

        {languages.map((lang, i) => (
          <div key={i} className="flex space-x-2 items-center">
            <select
              value={lang}
              onChange={(e) => updateLanguage(i, e.target.value)}
              className="flex-1 p-3 border rounded"
              required
            >
              <option value="">Select Language</option>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeLanguage(i)}
              className="p-2 bg-red-500 rounded text-white"
            >
              ×
            </button>
          </div>
        ))}

        {languages.length < 3 && (
          <button
            type="button"
            onClick={addLanguage}
            className="w-full py-2 bg-gray-200 rounded"
          >
            + Add Language
          </button>
        )}

        <button
          type="submit"
          className="block w-full py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {error && (
          <p className="text-red-600 text-sm font-medium text-center">
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
