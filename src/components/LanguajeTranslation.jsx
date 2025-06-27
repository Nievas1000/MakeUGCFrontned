import { useState } from "react";

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
    if (file && file.size > 25 * 1024 * 1024) {
      setError("File must be smaller than 25MB");
      setVideo(null);
    } else {
      setError("");
      setVideo(file);
      setOriginalPreview(URL.createObjectURL(file));
    }
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
      const formData = new FormData();
      formData.append("video", video);
      formData.append("languages", JSON.stringify(languages));

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
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white shadow-xl rounded-lg p-6 w-full max-w-4xl overflow-auto max-h-[90vh] border"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-center mb-6">
              Translated Videos
            </h2>

            {/* Video original */}
            <div className="flex justify-center mb-6">
              <div className="text-center">
                <p className="font-medium mb-2">Original Video</p>
                <video controls className="w-[300px] rounded">
                  <source src={originalPreview} type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Videos traducidos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-medium mb-2">Arabic</p>
                <video controls className="w-full rounded">
                  <source
                    src="https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc2bp40a000ux0lvjd19n1z2_1750274283.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXEFUNV7O4BRRCEX5%2F20250618%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250618T191827Z&X-Amz-Expires=604800&X-Amz-Signature=a2bb37b06265085e7997333516905a7bd4bb8abc7474bf4298823fdf3f3c3be0&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dcmc2bp40a000ux0lvjd19n1z2.mp4&x-id=GetObject"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="text-center">
                <p className="font-medium mb-2">German</p>
                <video controls className="w-full rounded">
                  <source
                    src="https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc2c5gy500024dlivoy5091y_1750274704.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXEFUNV7O4BRRCEX5%2F20250618%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250618T192534Z&X-Amz-Expires=604800&X-Amz-Signature=3148db05af75b996a8fea1c35d6b1de9d946adc12922309652345e3388cc458e&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dcmc2c5gy500024dlivoy5091y.mp4&x-id=GetObject"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="text-center">
                <p className="font-medium mb-2">Spanish</p>
                <video controls className="w-full rounded">
                  <source
                    src="https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc2cevl8001px0lvh4hyb56s_1750275453.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXEFUNV7O4BRRCEX5%2F20250618%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250618T193756Z&X-Amz-Expires=604800&X-Amz-Signature=590de21a93a65bcc0c5ce7d07e918c1032b0f22daea20cc990c153e08712bb6d&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dcmc2cevl8001px0lvh4hyb56s.mp4&x-id=GetObject"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>

            <button
              className="mt-8 mx-auto block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
