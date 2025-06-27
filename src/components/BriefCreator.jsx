import { useState } from "react";
import useVideoScreenshots from "../hooks/useVideoScreenshots";
import StoryboardModal from "./StoryBoardModal";
import ClipLoader from "react-spinners/ClipLoader";

const inspirationVideoUrl =
  "https://d2z160kjf6fhi8.cloudfront.net/cmboy4hyo0otmy1o6cnq00/private/cmc0ob2610002kf2a3wirmtoq_1750174413.mp4?...";

export default function BriefCreator() {
  const [step, setStep] = useState(1);
  const [inspirationType, setInspirationType] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [link, setLink] = useState("");
  const [hookCount, setHookCount] = useState(1);
  const [bodyCount, setBodyCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [error, setError] = useState("");
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [originalTranscript, setOriginalTranscript] = useState(
    "Hi, I'm Dr. Mehmet from EMPHAIR Clinic, and today we're going to be doing an advanced DHI hair transplant. I'll show you exactly how we achieve natural results with our needle-free technology. Step one, we map your donor area and determine the perfect hairline design. What most people don't realize is that we extract each follicle at the perfect angle to match your natural growth pattern. And here's the best part - we use our special needle-free anesthesia system, so you feel absolutely nothing during the entire procedure. We use a specialized DHI implanter pen that creates the channel and places the graft simultaneously. You'll be completely comfortable throughout - no pain, no discomfort whatsoever. Then we'll carefully implant each follicle at the exact angle and depth, and you'll see immediate results with no scarring."
  );
  const [optimizedTranscript, setOptimizedTranscript] = useState("");
  const [optimizedScriptFromImages, setOptimizedScriptFromImages] =
    useState("");
  const [framesAnalysis, setFrameAnalysis] = useState();
  const [showModal, setShowModal] = useState(false);
  const [briefFinalData, setBriefFinalData] = useState([]);
  const [hookBody, setHookBody] = useState();

  const { screenshots, concatenatedText } = useVideoScreenshots(
    videoFile,
    setOptimizedScriptFromImages,
    originalTranscript,
    setStep,
    setFrameAnalysis
  );

  const handleGetVideo = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        "https://n8n-stabmediabackend.jdirlx.easypanel.host/api/get-video",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adUrl: link }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.base64) throw new Error(data.error || "Error");

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
      const file = new File([videoBlob], "video.mp4", { type: "video/mp4" });

      setVideoUrl(URL.createObjectURL(file));
      setVideoFile(file);
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setError("Max file size is 25MB");
      return;
    }

    setError("");
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
  };

  const handleCreateBrief = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://pdog.app.n8n.cloud/webhook/e8ac4753-bfb2-424e-b80f-4bca195fb79e",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ script: originalTranscript }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.text) {
        throw new Error(data.error || "Failed to optimize transcript");
      }
      setOptimizedTranscript(data.text);
      setStep(2);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const generateBrief = async () => {
    const imagesText = screenshots.map((img) => img.description).join(" - ");
    try {
      setLoadingBrief(true);
      const response = await fetch(
        "https://pdog.app.n8n.cloud/webhook/09442549-54ca-4815-a2a4-fbdb684ee8ab",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bodyCount,
            hookCount,
            originalTranscript,
            optimizedScriptFromImages,
            imagesText,
            optimizedOriginalTranscript: optimizedTranscript,
          }),
        }
      );
      const result = await response.json();
      setBriefFinalData(result.final_analysis);
      setHookBody(result.hook_body);
      setLoadingBrief(false);
      setShowModal(true);
    } catch (error) {
      console.log(error);
      setLoadingBrief(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-md">
      {showModal ? (
        <StoryboardModal
          scenes={briefFinalData}
          screenshots={screenshots}
          hookBody={hookBody}
          inspirationDescription={originalTranscript}
          inspirationUrl={inspirationVideoUrl}
        />
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center">Create Brief</h2>

          {step === 1 && (
            <div className="max-w-2xl mx-auto mt-10 space-y-6">
              <div className="flex justify-center">
                <video
                  src={inspirationVideoUrl}
                  controls
                  className="h-[450px] w-[250px] rounded shadow-md"
                />
              </div>
              <div className="mt-4 text-sm text-gray-700">
                <h4 className="font-semibold mb-1">Transcription</h4>
                <p className={showFullTranscript ? "" : "line-clamp-3"}>
                  {originalTranscript}
                </p>
                <button
                  onClick={() => setShowFullTranscript((prev) => !prev)}
                  className="text-blue-600 mt-1 text-sm hover:underline"
                >
                  {showFullTranscript ? "View more" : "View less"}
                </button>
              </div>
              <button
                onClick={handleCreateBrief}
                className="relative flex items-center justify-center w-full py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
                disabled={loading}
              >
                <ClipLoader size={20} color="#fff" loading={loading} />
                <span className="ml-2">
                  {loading ? "Optimizing script..." : "Create Brief"}
                </span>
              </button>
            </div>
          )}

          {step >= 2 && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold">1. Choose Inspiration Source</h3>
                <div className="flex gap-3 flex-wrap">
                  {["upload", "meta", "tiktok"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setInspirationType(type)}
                      className={`px-4 py-2 rounded ${
                        inspirationType === type
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {type === "upload"
                        ? "Upload Video"
                        : type === "meta"
                        ? "Meta Ads Library"
                        : "TikTok Ads Library"}
                    </button>
                  ))}
                </div>

                {inspirationType === "upload" && (
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="block mt-4"
                  />
                )}

                {(inspirationType === "meta" ||
                  inspirationType === "tiktok") && (
                  <div className="space-y-2 mt-4">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="Enter ad library link"
                      className="w-full border-b-2 border-gray-300 py-2 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleGetVideo}
                      disabled={loading || !link}
                      className="relative flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <ClipLoader size={16} color="#fff" loading={loading} />
                      <span className="ml-2">
                        {loading ? "Fetching..." : "Get Video"}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Preview video */}
              {videoUrl && (
                <div>
                  <div className="flex justify-center mt-6">
                    <video
                      src={videoUrl}
                      controls
                      className="h-[450px] w-[250px] rounded shadow-md"
                    />
                  </div>
                  {framesAnalysis && (
                    <div className="flex justify-center items-center mt-3 text-gray-600">
                      <ClipLoader size={16} />
                      <span className="ml-2">Analyzing frames...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Screenshots */}
              {videoUrl && screenshots.length > 0 && (
                <div className="mt-6 space-y-6">
                  <h3 className="font-semibold text-lg">Image Analysis</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {screenshots.map((item, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-2 shadow-sm bg-white"
                      >
                        <img
                          src={item.image}
                          alt={`Screenshot ${index}`}
                          className="w-full h-auto rounded mb-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-600 text-sm font-medium text-center">
                  {error}
                </p>
              )}

              {/* Hooks & Body */}
              {step === 3 && (
                <div>
                  <div className="space-y-4 pt-6">
                    <h3 className="font-semibold">2. Select Variations</h3>
                    <div className="flex gap-8 items-center">
                      <label>
                        Hooks:
                        <select
                          value={hookCount}
                          onChange={(e) => setHookCount(Number(e.target.value))}
                          className="ml-2 px-2 py-1 border rounded"
                        >
                          {[1, 2, 3, 4].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Body:
                        <select
                          value={bodyCount}
                          onChange={(e) => setBodyCount(Number(e.target.value))}
                          className="ml-2 px-2 py-1 border rounded"
                        >
                          {[1, 2, 3, 4].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-center text-center">
                    <button
                      onClick={generateBrief}
                      disabled={loadingBrief}
                      className="relative flex items-center gap-2 justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <ClipLoader
                        size={20}
                        color="#fff"
                        loading={loadingBrief}
                      />
                      <span>
                        {loadingBrief
                          ? "Generating Brief..."
                          : "Generate Brief"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
