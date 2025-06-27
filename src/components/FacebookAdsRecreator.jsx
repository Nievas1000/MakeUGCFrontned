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

      setTimeout(() => {
        setModalReady(true);
      }, 5000);
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

            {!modalReady ? (
              <div className="text-center py-8">
                <div className="mb-4">
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold">
                  Generating your script...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  This may take a few seconds.
                </p>
              </div>
            ) : (
              <div className="space-y-6 pt-2">
                <h2 className="text-xl font-bold text-center">
                  Your Script is Ready
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold mb-2">Inspiration Video:</p>
                    <video
                      controls
                      src={inspirationVideoUrl}
                      className="w-full rounded-lg border h-[500px]"
                    />
                  </div>

                  {!generatedVideoUrl && (
                    <div>
                      <p className="font-semibold mb-2">Generated Video:</p>
                      <video
                        controls
                        src="https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc0ob2610002kf2a3wirmtoq_1750174413.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXEFUNV7O4BRRCEX5%2F20250617%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250617T153350Z&X-Amz-Expires=604800&X-Amz-Signature=af581b10e61071c90d287a7b51f35bc9d5e3ddbce603ad5c278b32ce6ed3ec4c&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dcmc0ob2610002kf2a3wirmtoq.mp4&x-id=GetObject"
                        className="w-full rounded-lg border h-[500px]"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <p className="font-semibold mb-2">Generated Script:</p>
                  <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap max-h-72 overflow-auto">
                    I just got my Barestep barefoot shoes and I have everything
                    you need to know about why these are different. They offer
                    men's, women's, and kids' styles in multiple colors. Most of
                    the feedback I've seen focuses on pain relief, which makes
                    total sense. What really stood out was the immediate comfort
                    - no break-in period needed, but the toe box is noticeably
                    wider than regular shoes. Smaller sizes seem to sell out
                    faster than larger ones. I was hoping they'd feel more like
                    socks, but honestly they feel more supportive than I
                    expected. The zero-drop sole really does make a difference
                    for back pain - I noticed it within hours. For people with
                    plantar fasciitis, these have incredible arch support
                    without being restrictive. I wanted something purely for
                    running, but these work amazing for all-day wear too.
                  </pre>
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
