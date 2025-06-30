import { useState } from "react";
import { ArrowRight, UploadCloud, Globe } from "lucide-react";
import { extractAudioFromVideo } from "../utils/compressVideo";
import DragDropUploader from "./DragDropUploader";

export default function TikTokAdsRecreator() {
  const [tab, setTab] = useState("url");
  const [tiktokLink, setTiktokLink] = useState("");
  const [brandUrl, setBrandUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalReady, setModalReady] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setModalReady(false);
    setLoading(true);

    try {
      let finalVideo = videoFile;

      if (tab === "url") {
        if (!tiktokLink.includes("tiktok.com/ads/detail")) {
          setError("Please enter a valid TikTok Ads Library link.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          "https://n8n-stabmediabackend.jdirlx.easypanel.host/api/get-video",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adUrl: tiktokLink }),
          }
        );

        const data = await res.json();
        if (!res.ok || !data.base64 || !data.videoUrl) {
          throw new Error(data.error || "Could not fetch TikTok video.");
        }

        const byteCharacters = atob(data.base64);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i += 1024) {
          const slice = byteCharacters.slice(i, i + 1024);
          const byteNumbers = Array.from(slice).map((c) => c.charCodeAt(0));
          byteArrays.push(new Uint8Array(byteNumbers));
        }
        const blob = new Blob(byteArrays, { type: "video/mp4" });
        finalVideo = new File([blob], "tiktok-video.mp4", {
          type: "video/mp4",
        });
      }

      const compressed = await extractAudioFromVideo(finalVideo);

      const formData = new FormData();
      formData.append("video", compressed);
      formData.append("brandUrl", brandUrl);
      formData.append("tiktokLink", tiktokLink || "uploaded");

      await fetch(
        "https://pdog.app.n8n.cloud/webhook/c7eb5200-e47b-48b8-af1d-0c1e81bec831",
        {
          method: "POST",
          body: formData,
        }
      );

      setModalReady(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
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
            TikTok Ad Recreator
          </h2>
          <p className="text-sm text-gray-500">
            Drop in a TikTok ad and your website—we’ll generate a
            high-performing remake tailored to your brand.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`flex-1 py-2 text-sm font-medium ${
              tab === "url"
                ? "bg-gray-100 text-gray-900"
                : "bg-white text-gray-500"
            }`}
          >
            TikTok URL
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex-1 py-2 text-sm font-medium ${
              tab === "upload"
                ? "bg-gray-100 text-gray-900"
                : "bg-white text-gray-500"
            }`}
          >
            Upload Video
          </button>
        </div>

        {/* TikTok URL or Upload */}
        {tab === "url" ? (
          <input
            type="url"
            placeholder="https://www.tiktok.com/ads/detail/..."
            value={tiktokLink}
            onChange={(e) => setTiktokLink(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        ) : (
          <DragDropUploader
            file={videoFile}
            onFileSelected={(file) => {
              if (!file) return;

              if (file.size > 25 * 1024 * 1024) {
                setError("File must be smaller than 25MB");
                setVideoFile(null);
                return;
              }

              const renamedFile = new File([file], "uploaded-video.mp3", {
                type: "video/mp3",
              });

              setError("");
              setVideoFile(renamedFile);
            }}
            onRemove={() => setVideoFile(null)}
          />
        )}

        {/* Website input with icon */}
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="url"
            placeholder="https://yourwebsite.com"
            value={brandUrl}
            onChange={(e) => setBrandUrl(e.target.value)}
            className="w-full pl-10 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-3 rounded-md flex justify-center items-center gap-2 transition"
          disabled={loading}
        >
          {loading ? (
            "Generating..."
          ) : (
            <>
              Generate Video <ArrowRight size={16} />
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center font-medium">
            {error}
          </p>
        )}

        {/* Modal */}
        {modalReady && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative text-center space-y-4">
              <button
                onClick={() => setModalReady(false)}
                className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-2xl"
              >
                ×
              </button>
              <h3 className="text-lg font-semibold">
                We'll notify you once your video is ready.
              </h3>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
