import { useState } from "react";

export default function FacebookAdsRecreator() {
  const [metaLink, setMetaLink] = useState("");
  const [brandUrl, setBrandUrl] = useState("");
  const [email, setEmail] = useState("");
  const [inspirationVideoUrl, setInspirationVideoUrl] = useState("");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReady, setModalReady] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInspirationVideoUrl("");
    setGeneratedVideoUrl("");
    setScript("");
    setIsModalOpen(true);
    setModalReady(false);

    if (!metaLink.includes("facebook.com/ads/library")) {
      setError("Please enter a valid Meta Ads Library link.");
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
          body: JSON.stringify({ adUrl: metaLink }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.base64 || !data.videoUrl) {
        throw new Error(data.error || "Video could not be retrieved.");
      }

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
      const videoFile = new File([videoBlob], "meta-video.mp4", {
        type: "video/mp4",
      });

      setInspirationVideoUrl(data.videoUrl);

      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("brandUrl", brandUrl);
      formData.append("email", email);
      formData.append("metaLink", data.videoUrl);

      const webhookRes = await fetch(
        "https://pdog.app.n8n.cloud/webhook/c77f11e4-8111-44e9-af8c-704741c75a47",
        {
          method: "POST",
          body: formData,
        }
      );

      /* const webhookData = await webhookRes.json();
      setGeneratedVideoUrl(webhookData.video_url || "");
      setScript(webhookData.script || "No script received"); */

      setModalReady(true);
    } catch (err) {
      setError(err.message || "An error occurred");
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
    <div className="max-w-md mx-auto pt-5 space-y-6">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl mx-auto rounded-2xl shadow-xl p-6 relative animate-fade-in">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl"
            >
              &times;
            </button>

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
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="url"
          placeholder="Meta ads library link"
          value={metaLink}
          onChange={(e) => setMetaLink(e.target.value)}
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
