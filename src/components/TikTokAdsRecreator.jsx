import { useState } from "react";

export default function TikTokAdsRecreator() {
  const [tiktokLink, setTiktokLink] = useState("");
  const [brandUrl, setBrandUrl] = useState("");
  const [email, setEmail] = useState("");
  const [videoOriginal, setVideoOriginal] = useState("");
  const [videoGenerado, setVideoGenerado] = useState("");
  const [script, setScript] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReady, setModalReady] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setVideoOriginal("");
    setVideoGenerado("");
    setScript("");
    setIsModalOpen(true);
    setModalReady(false);
    setLoading(true);

    if (!tiktokLink.includes("tiktok.com/ads/detail")) {
      setError("Please enter a valid TikTok Ads Library link.");
      setIsModalOpen(false);
      setLoading(false);
      return;
    }

    try {
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

      const base64Src = `data:video/mp4;base64,${data.base64}`;
      setVideoOriginal(base64Src);

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
      const videoFile = new File([videoBlob], "tiktok-video.mp4", {
        type: "video/mp4",
      });

      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("brandUrl", brandUrl);
      formData.append("email", email);
      formData.append("tiktokLink", data.videoUrl);

      const uploadRes = await fetch(
        "https://pdog.app.n8n.cloud/webhook/c7eb5200-e47b-48b8-af1d-0c1e81bec831",
        {
          method: "POST",
          body: formData,
        }
      );

      /* const result = await uploadRes.json();
      if (!uploadRes.ok) throw new Error("Failed to send video to n8n");

      setVideoGenerado(result.video_url || "");
      setScript(result.script || "No script received");
      setModalReady(true); */
    } catch (err) {
      setError(err.message || "Something went wrong");
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalReady(false);
  };

  return (
    <div className="max-w-md mx-auto pt-5 space-y-8">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl mx-auto rounded-2xl shadow-xl p-6 relative animate-fade-in">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl"
            >
              &times;
            </button>

            {!modalReady ? (
              <div className="text-center py-8">
                <svg
                  className="w-10 h-10 mx-auto text-blue-500 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                <p className="text-lg font-semibold mt-3">
                  Generating script...
                </p>
              </div>
            ) : (
              <div className="space-y-5 pt-2">
                <h2 className="text-xl font-bold text-center">
                  Your Video is Ready
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold mb-2 text-center">
                      Original TikTok Ad:
                    </p>
                    <video
                      controls
                      src={videoOriginal}
                      className="w-full rounded-lg border"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-center">
                      Generated Video:
                    </p>
                    <video
                      controls
                      src="https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc0oz4ol000hkf2avcvllk1n_1750175253.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXEFUNV7O4BRRCEX5%2F20250617%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250617T154801Z&X-Amz-Expires=604800&X-Amz-Signature=0b797abae8cd643f1f0e5d647e3531f2a3bf26ae6d04b59bbf7e553b9e20c028&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dcmc0oz4ol000hkf2avcvllk1n.mp4&x-id=GetObject"
                      className="w-full rounded-lg border"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="url"
          placeholder="TikTok ads library link"
          value={tiktokLink}
          onChange={(e) => setTiktokLink(e.target.value)}
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
          {loading ? "Generating..." : "Generate Script"}
        </button>
      </form>

      {error && (
        <div className="text-red-600 font-semibold text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
