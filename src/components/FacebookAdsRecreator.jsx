import { useState } from "react";
import { ArrowRight, Globe, UploadCloud } from "lucide-react";
import { extractAudioFromVideo } from "../utils/compressVideo";
import DragDropUploader from "./DragDropUploader";
import EmailConfirmation from "./EmailConfirmation";

export default function FacebookAdsRecreator() {
  const [tab, setTab] = useState("url"); // 'url' or 'upload'
  const [metaLink, setMetaLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [brandUrl, setBrandUrl] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalReady, setModalReady] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setModalReady(false);

    try {
      let finalVideo = videoFile;

      if (tab === "url") {
        if (!metaLink.includes("facebook.com/ads/library")) {
          setError("Please enter a valid Meta Ads Library link.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          "https://n8n-stabmediabackend.jdirlx.easypanel.host/api/get-video",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adUrl: metaLink }),
          }
        );

        const data = await res.json();
        if (!res.ok || !data.base64) {
          throw new Error("Video could not be retrieved.");
        }

        const byteCharacters = atob(data.base64);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i += 1024) {
          const slice = byteCharacters.slice(i, i + 1024);
          const byteNumbers = Array.from(slice).map((c) => c.charCodeAt(0));
          byteArrays.push(new Uint8Array(byteNumbers));
        }
        const blob = new Blob(byteArrays, { type: "video/mp4" });
        finalVideo = new File([blob], "meta-video.mp4", { type: "video/mp4" });
      }

      const compressed = await extractAudioFromVideo(finalVideo);
      const formData = new FormData();
      formData.append("video", compressed);
      formData.append("brandUrl", brandUrl);
      formData.append("email", email);
      formData.append("metaLink", metaLink || "uploaded");

      await fetch(
        "https://pdog.app.n8n.cloud/webhook/c77f11e4-8111-44e9-af8c-704741c75a47",
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
      {modalReady ? (
        <EmailConfirmation />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg space-y-6"
        >
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Facebook Ad Recreator
            </h1>
            <p className="text-md text-gray-500">
              Paste a Facebook Ads Library link or upload a video and your
              website—we’ll recreate the ad as a fresh, ready-to-run MakeUGC
              video.
            </p>
          </div>

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
              Meta URL
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

          {tab === "url" ? (
            <input
              type="url"
              placeholder="https://www.facebook.com/ads/library/..."
              value={metaLink}
              onChange={(e) => setMetaLink(e.target.value)}
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

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
