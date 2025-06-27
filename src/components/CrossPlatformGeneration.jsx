import { useState } from "react";

export default function CrossPlatformGeneration() {
  const [mode, setMode] = useState("metaToTikTok");
  const [link, setLink] = useState("");
  const [brandUrl, setBrandUrl] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

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

      setPreviewUrl(data.videoUrl); // usamos video final como preview

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
      const videoFile = new File([videoBlob], "ad-video.mp4", {
        type: "video/mp4",
      });

      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("brandUrl", brandUrl);
      formData.append("email", email);
      formData.append("adUrl", data.videoUrl);

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

  const resultVideo =
    mode === "metaToTikTok"
      ? "https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc0ngsi8002n1yomsfoes0tw_1750172800.mp4"
      : "https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc0nbua600271yomxudrogsz_1750172584.mp4";

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-8 pt-5">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setMode("metaToTikTok")}
            className={`flex-1 py-2 rounded ${
              mode === "metaToTikTok" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Meta → TikTok
          </button>
          <button
            type="button"
            onClick={() => setMode("tiktokToMeta")}
            className={`flex-1 py-2 rounded ${
              mode === "tiktokToMeta" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            TikTok → Meta
          </button>
        </div>

        <input
          type="url"
          placeholder={
            mode === "metaToTikTok"
              ? "Meta Ads Library URL"
              : "TikTok Ads Library URL"
          }
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full border-b-2 border-gray-300 py-2 focus:border-blue-500 focus:outline-none"
          required
        />

        <input
          type="url"
          placeholder="Enter brand URL"
          value={brandUrl}
          onChange={(e) => setBrandUrl(e.target.value)}
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
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full relative space-y-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-2xl"
            >
              ×
            </button>

            <h3 className="text-lg font-semibold text-center mb-4">
              Video Preview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-center space-y-1">
                <p className="text-sm text-gray-500">Original Ad</p>
                <video
                  src={previewUrl}
                  controls
                  className="rounded max-h-[200px] w-full object-contain"
                />
              </div>

              <div className="flex flex-col items-center space-y-1">
                <p className="text-sm text-gray-500">Result</p>
                <video
                  src={resultVideo}
                  controls
                  className="rounded max-h-[200px] w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
