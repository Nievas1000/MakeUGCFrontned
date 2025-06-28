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
              We'll notify you via email once your video is ready.
            </h3>
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
