import { useState } from "react";

export default function UploadModal({
  onClose,
  onSave,
  adAccountId,
  campaignId,
  token,
  defaultAdsetId,
  selectedPage,
}) {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadMode, setUploadMode] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    const filesWithMeta = validFiles.map((file) => ({
      file,
      optimize: false,
      primaryText: "",
      type: file.type.startsWith("image/") ? "image" : "video",
      previewUrl: URL.createObjectURL(file),
    }));

    setMediaFiles(filesWithMeta);
  };
  const handleSave = async () => {
    setIsSaving(true);
    let adsetId = null;

    if (uploadMode === "folder") {
      try {
        const adSetRes = await fetch(
          "https://n8n-stabmediabackend.jdirlx.easypanel.host/api/meta/adsets",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ad_account_id: adAccountId,
              campaign_id: campaignId,
              name: `Generated AdSet ${Date.now()}`,
            }),
          }
        );

        const adSetData = await adSetRes.json();

        if (!adSetRes.ok) {
          throw new Error(
            adSetData?.error?.message || "Failed to create AdSet"
          );
        }

        adsetId = adSetData.id;
      } catch (err) {
        console.error("❌ Failed to create AdSet:", err);
        setIsSaving(false);
        return;
      }
    }

    for (let i = 0; i < mediaFiles.length; i++) {
      const item = mediaFiles[i];

      // 1. Subir imagen o video a Meta
      const mediaFormData = new FormData();
      mediaFormData.append("access_token", token);
      mediaFormData.append("source", item.file);

      let mediaUploadUrl = "";
      let mediaResponse = null;
      let imageHash = null;
      let videoId = null;

      try {
        if (item.type === "image") {
          mediaUploadUrl = `https://graph.facebook.com/v23.0/${adAccountId}/adimages`;
          mediaResponse = await fetch(mediaUploadUrl, {
            method: "POST",
            body: mediaFormData,
          });
          const mediaData = await mediaResponse.json();
          const key = Object.keys(mediaData.images)[0];
          imageHash = mediaData.images[key].hash;
        } else if (item.type === "video") {
          mediaUploadUrl = `https://graph.facebook.com/v23.0/${adAccountId}/advideos`;
          mediaResponse = await fetch(mediaUploadUrl, {
            method: "POST",
            body: mediaFormData,
          });
          const mediaData = await mediaResponse.json();
          videoId = mediaData.id;
        }
      } catch (err) {
        console.error("❌ Error uploading media to Meta:", err);
        continue;
      }

      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("name", item.file.name);
      formData.append("type", item.type);
      formData.append("accessToken", token);
      formData.append("optimize", item.optimize);
      formData.append("primaryText", item.primaryText || "");
      formData.append("page_id", selectedPage);
      formData.append("adAccount", adAccountId);

      const resolvedAdsetId =
        uploadMode === "folder" ? adsetId : defaultAdsetId;
      if (resolvedAdsetId) {
        formData.append("adset_id", resolvedAdsetId);
      }

      if (imageHash) formData.append("media_id", imageHash);
      if (videoId) formData.append("media_id", videoId);

      try {
        const res = await fetch(
          "https://pdog.app.n8n.cloud/webhook/5abf52a2-e668-4644-9b79-d93dc9930fd7",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) throw new Error(`Error sending ${item.file.name}`);

        console.log(`✅ Sent ${item.file.name}`);
      } catch (err) {
        console.error(`❌ Failed to send ${item.file.name}`, err);
      }

      if (uploadMode === "folder" && i < mediaFiles.length - 1) {
        await new Promise((r) => setTimeout(r, 5000));
      }
    }

    onSave(mediaFiles);
    onClose();
    setIsSaving(false);
  };

  const handleCheckboxChange = (index, checked) => {
    setMediaFiles((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, optimize: checked } : item
      )
    );
  };

  const handleTextChange = (index, value) => {
    setMediaFiles((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, primaryText: value } : item
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[800px] max-w-3xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Upload Media</h2>

        {!uploadMode ? (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setUploadMode("single")}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Upload individual files
            </button>
            <button
              onClick={() => setUploadMode("folder")}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Upload a folder (creates an Ad Set)
            </button>
          </div>
        ) : (
          <>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition mb-6">
              <span className="text-sm font-semibold text-gray-700 mb-2">
                Click to upload {uploadMode === "folder" ? "a folder" : "files"}
              </span>
              <span className="text-xs text-gray-500">
                (Accepted: images and videos)
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                {...(uploadMode === "folder"
                  ? { webkitdirectory: "true", directory: "true" }
                  : {})}
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>

            {mediaFiles.length > 0 && (
              <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-2">
                {mediaFiles.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex flex-col items-center w-1/3">
                      {item.type === "image" && (
                        <img
                          src={item.previewUrl}
                          alt="preview"
                          className="object-cover rounded border"
                        />
                      )}
                      {item.type === "video" && (
                        <video
                          src={item.previewUrl}
                          controls
                          className="rounded border"
                        />
                      )}
                      <p className="text-xs mt-2 text-center text-gray-600 max-w-[8rem] break-words">
                        {item.file.name}
                      </p>
                    </div>

                    <div className="flex flex-col items-start w-2/3 pl-4">
                      <label className="flex items-center gap-2 text-sm mb-2">
                        <input
                          type="checkbox"
                          checked={item.optimize || false}
                          onChange={(e) =>
                            handleCheckboxChange(index, e.target.checked)
                          }
                        />
                        Optimize primary text
                      </label>

                      {item.optimize && (
                        <textarea
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                          rows={3}
                          placeholder="Enter text to optimize"
                          value={item.primaryText}
                          onChange={(e) =>
                            handleTextChange(index, e.target.value)
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mediaFiles.length > 0 && (
              <button
                onClick={handleSave}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={isSaving}
              >
                {isSaving ? "Uploading..." : "Save and Continue"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
