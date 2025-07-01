import { useState } from "react";
import { extractAudioFromVideo } from "../utils/compressVideo";
import { Globe } from "lucide-react";
import DragDropUploader from "./DragDropUploader";
import EmailConfirmation from "./EmailConfirmation";

export default function CrossPlatformGeneration() {
  const [mode, setMode] = useState("metaToTikTok");
  const [tab, setTab] = useState("link");
  const [link, setLink] = useState("");
  const [video, setVideo] = useState(null);
  const [brandUrl, setBrandUrl] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

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

  const isValidUrl = (url) => {
    if (mode === "metaToTikTok")
      return url.includes("facebook.com/ads/library");
    if (mode === "tiktokToMeta") return url.includes("tiktok.com/ads/detail");
    return false;
  };

  const getWebhookUrl = () => {
    return mode === "metaToTikTok"
      ? "https://pdog.app.n8n.cloud/webhook/1d9f5cb6-7d6f-4919-90dd-aec406c6a24e"
      : "https://pdog.app.n8n.cloud/webhook/f54b1f26-a7ff-4509-8f2d-621c72a0a007";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let finalVideo;

      if (tab === "link") {
        if (!isValidUrl(link)) {
          throw new Error(
            mode === "metaToTikTok"
              ? "Link must be a Meta Ads Library URL"
              : "Link must be a TikTok Ads Library URL"
          );
        }

        const res = await fetch(
          "https://n8n-stabmediabackend.jdirlx.easypanel.host/api/get-video",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adUrl: link }),
          }
        );

        const data = await res.json();
        if (!res.ok || !data.base64 || !data.videoUrl) {
          throw new Error(data.error || "Could not fetch video.");
        }

        setPreviewUrl(data.videoUrl);

        const byteCharacters = atob(data.base64);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i += 1024) {
          const slice = byteCharacters.slice(i, i + 1024);
          const byteNumbers = new Array(slice.length);
          for (let j = 0; j < slice.length; j++) {
            byteNumbers[j] = slice.charCodeAt(j);
          }
          byteArrays.push(new Uint8Array(byteNumbers));
        }

        const videoBlob = new Blob(byteArrays, { type: "video/mp4" });
        finalVideo = new File([videoBlob], "ad-video.mp4", {
          type: "video/mp4",
        });
      } else {
        if (!video) throw new Error("Please select a video file.");
        finalVideo = video;
      }

      const compressed = await extractAudioFromVideo(finalVideo);
      const formData = new FormData();
      formData.append("video", compressed);
      formData.append("brandUrl", brandUrl);
      formData.append("email", email);

      if (tab === "link") {
        formData.append("adUrl", link);
      }

      await fetch(getWebhookUrl(), {
        method: "POST",
        body: formData,
      });

      setShowModal(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-md">
      {showModal ? (
        <EmailConfirmation />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto space-y-8 pt-5"
        >
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Cross Platform Script Generator
            </h1>
            <p className="text-md text-gray-500">
              Upload a Meta or TikTok ad and choose your target platform—we’ll
              rewrite it for native performance and generate the new video.
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setMode("metaToTikTok")}
              className={`flex-1 py-2 rounded ${
                mode === "metaToTikTok"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Meta → TikTok
            </button>
            <button
              type="button"
              onClick={() => setMode("tiktokToMeta")}
              className={`flex-1 py-2 rounded ${
                mode === "tiktokToMeta"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              TikTok → Meta
            </button>
          </div>

          <div className="flex border rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setTab("link")}
              className={`flex-1 py-2 text-sm font-medium ${
                tab === "link"
                  ? "bg-gray-100 text-gray-900"
                  : "bg-white text-gray-500"
              }`}
            >
              Enter Link
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

          {tab === "link" ? (
            <input
              type="url"
              placeholder={
                mode === "metaToTikTok"
                  ? "Meta Ads Library URL"
                  : "TikTok Ads Library URL"
              }
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          ) : (
            <DragDropUploader
              file={video}
              onFileSelected={(file) => {
                setError("");
                setPreviewUrl("");

                if (!file) return setVideo(null);

                if (!allowedTypes.includes(file.type)) {
                  setError("Unsupported file type");
                  return setVideo(null);
                }

                if (file.size > 25 * 1024 * 1024) {
                  setError("File exceeds 25 MB limit");
                  return setVideo(null);
                }

                const renamed = new File([file], "ad-video.mp4", {
                  type: "video/mp4",
                });
                setVideo(renamed);
                setPreviewUrl(URL.createObjectURL(renamed));
              }}
              onRemove={() => setVideo(null)}
            />
          )}

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

          <button
            type="submit"
            className="block w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
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
      )}
    </div>
  );
}
