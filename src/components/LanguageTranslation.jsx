import { useState } from "react";
import { extractAudioFromVideo } from "../utils/compressVideo";
import { ArrowRight, UploadCloud } from "lucide-react";
import DragDropUploader from "./DragDropUploader";
import EmailConfirmation from "./EmailConfirmation";

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

  const addLanguage = () => {
    if (languages.length < 3) setLanguages([...languages, ""]);
  };

  const removeLanguage = (i) => {
    setLanguages(languages.filter((_, idx) => idx !== i));
  };

  const updateLanguage = (i, value) => {
    const copy = [...languages];
    copy[i] = value;
    setLanguages(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video || languages.some((lang) => !lang)) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const compressed = await extractAudioFromVideo(video);
      const formData = new FormData();
      formData.append("video", compressed);
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
    <div className="flex items-center justify-center">
      {showModal ? (
        <EmailConfirmation />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg space-y-6"
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Translate Your Video
            </h2>
            <p className="text-sm text-gray-500">
              Upload your video and choose up to 3 languages. We'll generate
              translated versions.
            </p>
          </div>

          <DragDropUploader
            file={video}
            onFileSelected={(file) => {
              if (!file) return;

              if (file.size > 25 * 1024 * 1024) {
                setError("File must be smaller than 25MB");
                setVideo(null);
                return;
              }

              const renamedFile = new File([file], "uploaded-video.mp4", {
                type: "video/mp4",
              });

              setError("");
              setVideo(renamedFile);
            }}
            onRemove={() => setVideo(null)}
          />

          <div className="space-y-3">
            {languages.map((lang, i) => (
              <div key={i} className="flex items-center space-x-2">
                <select
                  value={lang}
                  onChange={(e) => updateLanguage(i, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="text-red-600 hover:text-red-800 text-xl px-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {languages.length < 3 && (
            <button
              type="button"
              onClick={addLanguage}
              className="w-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md transition"
            >
              + Add Language
            </button>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-3 rounded-md flex justify-center items-center gap-2 transition"
            disabled={loading}
          >
            {loading ? (
              "Generating..."
            ) : (
              <>
                Generate Translations <ArrowRight size={16} />
              </>
            )}
          </button>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
